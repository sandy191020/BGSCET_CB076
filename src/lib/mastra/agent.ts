import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";

export const ndviAgent = new Agent({
  name: "NDVI Analysis Agent",
  instructions: `
    You are an AI agent specialized in analyzing satellite imagery for sustainable farming.
    Your goal is to calculate the NDVI (Normalized Difference Vegetation Index) for a given farm.
    NDVI = (NIR - Red) / (NIR + Red).
    
    Always provide a detailed reasoning for your score.
  `,
  model: {
    id: "openai/gpt-4o",
  },
});

export const mastra = new Mastra({
  agents: { ndviAgent },
});
