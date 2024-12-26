import { installAI } from "./ai/ai";

export async function installRoutes({ ipcMain }) {
  ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
  });

  installAI({ ipcMain });
}
