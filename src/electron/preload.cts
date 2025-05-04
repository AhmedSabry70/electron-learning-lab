import electron, { IpcRendererEvent } from "electron";

electron.contextBridge.exposeInMainWorld("myAPI", {
  subscribeStatistics: (cb) => {
    return ipcOn("statistics", (stats) => {
      cb(stats);
    });
  },
  getStaticData: () => ipcInvoke("getStaticData"),
} satisfies Window["myAPI"]);

function ipcInvoke<key extends keyof EventPayloadMapping>(
  key: key
): Promise<EventPayloadMapping[key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<key extends keyof EventPayloadMapping>(
  key: key,
  callback: (payload: EventPayloadMapping[key]) => void
) {
  const handler = (_: IpcRendererEvent, payload: EventPayloadMapping[key]) => {
    callback(payload);
  };

  electron.ipcRenderer.on(key, handler);

  return () => {
    electron.ipcRenderer.off(key, handler);
  };
}
