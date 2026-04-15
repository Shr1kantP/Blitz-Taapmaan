"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Map, Marker, Circle, LeafletMouseEvent } from "leaflet";
import { requestNotificationPermission, sendHeatNotification, getRiskFromAPI } from "../../lib/notifications";
import type { HeatRiskResponse } from "../../types/tapmaan";
import styles from "./LiveMap.module.css";

const LiveMap = () => {
  const [permissionState, setPermissionState] = useState<
    "idle" | "requesting" | "granted" | "denied" | "unsupported"
  >("idle");
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const circleRef = useRef<Circle | null>(null);
  const lastNotificationTime = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const detectIOSSafari = (): boolean => {
    const ua = window.navigator.userAgent;
    return (
      /iP(hone|ad|od)/.test(ua) &&
      /Safari/.test(ua) &&
      !window.navigator.standalone
    );
  };

  const handlePermissionRequest = async () => {
    setPermissionState("requesting");
    const granted = await requestNotificationPermission();
    setPermissionState(granted ? "granted" : "denied");
  };

  const handleStartTracking = () => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported");
      return;
    }

    setIsTracking(true);
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        // Update map marker and circle
        if (mapRef.current && markerRef.current && circleRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          circleRef.current.setLatLng([latitude, longitude]);
          circleRef.current.setRadius(accuracy);
          mapRef.current.panTo([latitude, longitude]);
        }

        // Trigger notification with debouncing (every 5 minutes)
        const now = Date.now();
        if (
          !lastNotificationTime.current ||
          now - lastNotificationTime.current >= 5 * 60 * 1000
        ) {
          const riskData = await getRiskFromAPI(latitude, longitude);
          if (riskData && (riskData.riskLevel === "Moderate" || riskData.riskLevel === "High" || riskData.riskLevel === "Extreme")) {
            await sendHeatNotification(riskData);
            lastNotificationTime.current = now;
          }
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    watchIdRef.current = watchId;
  };

  const handleStopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  useEffect(() => {
    const loadMap = async () => {
      const L = await import("leaflet");
      const map = L.map("map").setView([51.505, -0.09], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([51.505, -0.09]).addTo(map);
      markerRef.current = marker;

      const circle = L.circle([51.505, -0.09], { radius: 500 }).addTo(map);
      circleRef.current = circle;

      map.on("click", async (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const riskData = await getRiskFromAPI(lat, lng);
        if (riskData) await sendHeatNotification(riskData);
      });
    };

    loadMap();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.alertContainer}>
        <button
          className={styles.alertButton}
          onClick={handlePermissionRequest}
        >
          {permissionState === "idle" && "🔔 Enable Alerts"}
          {permissionState === "requesting" && "⏳ Enabling…"}
          {permissionState === "granted" && "✅ Alerts On"}
          {permissionState === "denied" && "🔕 Blocked"}
          {permissionState === "unsupported" && "🔕 Not Supported"}
        </button>
        {permissionState === "denied" && (
          <p className={styles.errorMessage}>
            To re-enable, go to browser Settings → Site Settings → Notifications
            and allow TaapMaan
          </p>
        )}
        <button
          className={styles.alertButton}
          onClick={isTracking ? handleStopTracking : handleStartTracking}
        >
          {isTracking ? "⏹️ Stop Live Tracking" : "▶️ Start Live Tracking"}
        </button>
        {coordinates && (
          <p className={styles.coordinatesText}>
            📍 Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
          </p>
        )}
      </div>
      <div id="map" className={styles.mapContainer}></div>
    </div>
  );
};

export default LiveMap;