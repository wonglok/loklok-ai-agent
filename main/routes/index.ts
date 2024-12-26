export function installRoutes({ ipcMain }) {
  ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
  });

  let handle = (
    eventName = "loadFolder",
    func = async (args: any): Promise<any> => {}
  ) => {
    // main app
    ipcMain.on(eventName, async (event, arg) => {
      let parsedArg = JSON.parse(arg);

      let reply = (payload) => {
        event.reply(
          eventName,
          JSON.stringify({
            callID: parsedArg.callID,
            payload: payload,
          })
        );
      };

      let closeIsCalled = false;
      let closeOnce = () => {
        if (closeIsCalled) {
          return;
        }
        if (!closeIsCalled) {
          closeIsCalled = true;
        }

        event.reply(
          eventName,
          JSON.stringify({
            callID: parsedArg.callID,
            close: true,
          })
        );
      };

      await func({
        inbound: parsedArg.payload,
        reply: reply,
        close: closeOnce,
      });

      closeOnce();
    });
  };

  handle("loadFolder", async ({ inbound, reply, close }) => {
    //
    reply({ message: "reply 1", inbound });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reply({ message: "reply 2", inbound });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reply({ message: "reply 3", inbound });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reply({ message: "reply 4", inbound });

    close();
  });
}
