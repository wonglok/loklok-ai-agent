import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const handler = {
  //

  run: (method, value, emit) => {
    let callID = "_" + Math.random().toString(36).slice(2, 9);
    let hh = (_event, response) => {
      //

      try {
        let parsed = JSON.parse(response);
        if (parsed.callID === callID) {
          if (parsed.close) {
            ipcRenderer.removeListener(method, hh);
          } else {
            emit(parsed.payload);
          }
        }
      } catch (e) {
        console.log(e);
      }

      //
    };

    ipcRenderer.on(method, hh);
    ipcRenderer.send(
      method,
      JSON.stringify({
        callID: callID,
        payload: value,
      })
    );
  },

  //

  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },

  //

  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  //
};

contextBridge.exposeInMainWorld("ipc", handler);

export type IpcHandler = typeof handler;
