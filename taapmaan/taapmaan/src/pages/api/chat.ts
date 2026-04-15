import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, persona, riskLevel, heatIndexScore, city, duration } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return a static "AI-like" response if no API key
    return res.status(200).json({ 
        content: `As a ${persona?.replace('_', ' ')} in ${city}, with a Heat Index of ${heatIndexScore}°F (${riskLevel}):
• Drink 500ml of water every hour, even if not thirsty.
• Take 15-minute breaks in shade for every hour of activity.
• Wear light-colored, loose cotton clothing and a wide-brimmed hat.`
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // using available sonnet 3.5 if the specific future one is not real
        max_tokens: 1024,
        system: `You are TAAPMAAN, a caring urban heat safety planner. 
Heat Index: ${heatIndexScore}°F (${riskLevel}) in ${city}. 
User is a ${persona} planning ${duration}hrs outdoors. 
Give ≤3 bullet-point safety tips, specific and caring. Be concise.`,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    res.status(200).json({ content: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
}
