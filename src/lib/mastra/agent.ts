/**
 * Mastra AI Agent — configured to use OpenRouter (free tier)
 *
 * Model: nvidia/llama-3.1-nemotron-70b-instruct:free
 * OpenRouter is an OpenAI-compatible API, so we use @ai-sdk/openai with a custom baseURL.
 *
 * NOTE: MASTRA_API_KEY does NOT exist — Mastra is a framework, not an API service.
 * The key you need is OPENROUTER_API_KEY from https://openrouter.ai/
 *
 * Free models available on OpenRouter (no credit card needed):
 *   - nvidia/llama-3.1-nemotron-70b-instruct:free   ← we use this
 *   - deepseek/deepseek-r1:free
 *   - google/gemma-3-27b-it:free
 *   - meta-llama/llama-4-maverick:free
 */

import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { createOpenAI } from "@ai-sdk/openai";

// OpenRouter is OpenAI-compatible — just point to their base URL
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    // Optional: OpenRouter uses these to track usage on their dashboard
    "HTTP-Referer": "https://greenledger.app",
    "X-Title": "GreenLedger Carbon Credit Platform",
  },
});

export const ndviAgent = new Agent({
  id: "ndvi-analysis-agent",
  name: "NDVI Analysis Agent",
  instructions: `
    You are GreenLedger's AI verification agent specialised in satellite-based carbon credit analysis.

    When given farm coordinates and size, you:
    1. Analyse vegetation density using NDVI scoring (NIR band vs Red band)
    2. Check for suspicious patterns that could indicate fraud
    3. Calculate the exact number of carbon credits the farm earns
    4. Return your reasoning step by step

    NDVI Formula: (NIR - Red) / (NIR + Red)
    - NDVI > 0.70 → Excellent vegetation → Tier 1 credits
    - NDVI 0.45–0.70 → Healthy vegetation → Tier 2 credits
    - NDVI < 0.45 → Poor vegetation → Rejected

    Credit formula: floor(NDVI × farm_area_acres × 5)

    Always be concise and technical in your output.
  `,
  // nvidia/llama-3.1-nemotron-70b — free on OpenRouter, excellent quality
  model: openrouter("nvidia/llama-3.1-nemotron-70b-instruct:free"),
});

export const mastra = new Mastra({
  agents: { ndviAgent },
});
