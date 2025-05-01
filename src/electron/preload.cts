import electron from "electron";

electron.contextBridge.exposeInMainWorld("myAPI", {
  subscribesStatistics: (cb: (statistics: unknown) => void) => {
    electron.ipcRenderer.on("statistics", (_, stats) => {
      cb(stats);
    });
  },
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
});
