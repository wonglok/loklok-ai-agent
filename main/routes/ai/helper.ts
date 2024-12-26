import ollama from "ollama";

export const loadModel = async ({ name, reply }) => {
  let begin = new Date().getTime();

  let progress = await ollama.pull({
    model: name,
    stream: true,
  });

  await reply({
    type: "status",
    value: "begin-download",
    datetime: new Date().getTime(),
  });

  for await (const prog of progress) {
    console.log(prog);

    if (prog.completed) {
      await reply({
        type: "download",
        value: `${((prog.completed / prog.total) * 100).toFixed(1)}%`,
        datetime: new Date().getTime(),
      });
    } else {
      await reply({
        type: "download",
        value: `${prog.status}`,
        datetime: new Date().getTime(),
      });
    }
  }
  await reply({
    type: "status",
    value: "finish-download",
    datetime: new Date().getTime(),
    duration: new Date().getTime() - begin,
  });
};

export const makeHandler =
  ({ ipcMain }) =>
  (eventName = "loadFolder", func = async (args: any): Promise<any> => {}) => {
    // main app
    ipcMain.on(eventName, async (event, arg) => {
      let parsedArg = JSON.parse(arg);

      let reply = async (payload) => {
        await event.reply(
          eventName,
          JSON.stringify({
            callID: parsedArg.callID,
            payload: payload,
          })
        );
      };

      let closeIsCalled = false;
      let closeOnce = async () => {
        if (closeIsCalled) {
          return;
        }
        if (!closeIsCalled) {
          closeIsCalled = true;
        }

        await event.reply(
          eventName,
          JSON.stringify({
            callID: parsedArg.callID,
            payload: {
              type: "status",
              value: "close",
              datetime: new Date().getTime(),
            },
            close: true,
          })
        );
      };

      await func({
        inbound: parsedArg.payload,
        reply: reply,
      })
        .then(() => {
          closeOnce();
        })
        .catch((e) => {
          console.log(e);
          closeOnce();
        });
    });
  };
