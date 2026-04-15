# TAAPMAAN - Urban Heat Intelligence Console

TAAPMAAN is a high-performance, medical-grade urban heat safety command center built for high-density environments like Mumbai. It provides hyper-localized micro-climate monitoring and generates personalized safety protocols based on age, exposure duration, and activity type.

## 🚀 Key Features

- **Personalized Safety Engine:** Generates medically-tailored safety advice specifically for ELDERLY, CHILDREN, and OUTDOOR WORKERS.
- **Micro-Climate Mapping:** Interactive heat map using hyper-localized spatial jitter models to track "Hotspots" and "Safe Havens" (Aarey Colony, National Parks).
- **Direct SMS Alerting:** One-click integration to push refined safety reports to emergency contacts via native SMS protocols.
- **Brutalist Command UI:** A high-precision, 0px-radius "rectangular" aesthetic designed for maximum functional space and navigational clarity.
- **Smart Window Tracking:** Analyzes daily thermal peaks to suggest "Optimal Exposure Windows."

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App/Pages Router)
- **State Management:** React Hooks & Shared Persistent Context
- **Mapping:** Leaflet.js with Custom HeatLayer Integration
- **Weather Data:** Open-Meteo API (Hyper-localized)
- **Styling:** Tailwind CSS (Brutalist Architectural System)
- **Icons:** Lucide-react (Custom Instrument Cluster)

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file (optional, defaults to Open-Meteo):
```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_optional_key
```

### 3. Development
```bash
npm run dev
```

## 🏗 How the Code Works

### 1. Risk Matrix (`src/lib/heatIndex.ts`)
The core intelligence lives here. It calculates a "RealFeel" heat index using Temperature + Humidity. Unlike standard scales, it weights risk differently for vulnerable populations (Elderly/Children) based on physiological thermal stress thresholds.

### 2. Hyper-Localized Modeling (`src/components/shared/HeatMap.tsx`)
Since urban heat isn't uniform, we use a `spatialJitter` function. This model simulates heat variations based on geographical coordinates ($Lat \times Lon$), realistically recreating the "Urban Heat Island" effect between dense concrete sectors and green safe havens.

### 3. Personalized Protocol Engine (`src/components/screens/RiskDashboard.tsx`)
The `getMeasures` function is the medical brain of the UI. It doesn't just show labels; it unshifts critical cards based on:
- **Persona:** Toggles "Heart Check" (Elderly) vs "Vehicle Safety" (Children).
- **Duration:** If exposure turns `over_60` in high heat, it triggers a `CRITICAL STOP` protocol.

### 4. Global State Sync (`src/hooks/useAppState.ts`)
The `AppState` tracks the user's entire identity throughout the session. This allows for seamless transitions between the "Setup" phase and the live dashboard, ensuring that every widget reflects the same personalized data.

---

**TAAPMAAN - Safety First. Life First.**
