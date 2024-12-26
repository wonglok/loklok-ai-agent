import { ollama as ollamaProvider } from "ollama-ai-provider";
import { streamObject } from "ai";
import { z } from "zod";
import { loadModel, makeHandler } from "./helper";

export async function installAI({ ipcMain }) {
  let onRunTask = makeHandler({ ipcMain });

  onRunTask("getEmbeddingsByList", async ({ inbound, reply }) => {
    await loadModel({ name: "nomic-embed-text", reply });

    let embed = await ollamaProvider.embedding("nomic-embed-text", {
      maxEmbeddingsPerCall: 768,
      truncate: true,
    });

    let result = await embed.doEmbed({
      values: inbound || [
        "I am a software developer",
        "i love Jesus because he loves me first",
      ],
    });

    let response = inbound.map((rawString, idx) => {
      return {
        raw: rawString,
        embeddings: result.embeddings[idx],
      };
    });

    await reply({
      type: "data",
      value: response,
      inbound,
      usage: result.usage,
    });

    await reply({
      type: "completed",
      value: response,
      inbound,
      usage: result.usage,
    });
  });

  onRunTask("loadFolder", async ({ inbound, reply }) => {
    await loadModel({ name: "llama3.3", reply });

    let model = ollamaProvider("llama3.3");

    const { elementStream } = streamObject({
      model: model,
      output: "array",
      schema: z.object({
        name: z.string(),
        class: z
          .string()
          .describe("Character class, e.g. warrior, mage, or thief."),
        description: z.string(),
      }),
      prompt: "Generate 3 hero descriptions for a fantasy role playing game.",
    });

    await reply({
      type: "status",
      value: "begin-think",
      datetime: new Date().getTime(),
    });

    let tick = new Date().getTime();

    let allHeros = [];
    for await (const hero of elementStream) {
      await reply({
        type: "data",
        value: hero,

        datetime: new Date().getTime(),
        delta: new Date().getTime() - tick,
      });

      allHeros.push(hero);

      tick = new Date().getTime();
    }

    await reply({
      type: "completed",
      value: allHeros,
      inbound,
    });

    await reply({
      type: "status",
      value: "finish-think",
      datetime: new Date().getTime(),
    });
  });
}
