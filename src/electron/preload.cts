import electron from "electron";

electron.contextBridge.exposeInMainWorld("myAPI", {
  subscribeStatistics: (cb) => {
    ipcOn("statistics", (stats) => {
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
  electron.ipcRenderer.on(key, (_, payload) => callback(payload));
}
