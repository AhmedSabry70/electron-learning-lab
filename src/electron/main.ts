import { app, BrowserWindow } from "electron";
import {
  getStaticData,
  pollSystemHealthMonitoring,
} from "./resourceManager.js";
import { getPreloadPath, getUIPath, ipcMainHandler, isDev } from "./util.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    // Production mode
    console.log("App is running in production");
    mainWindow.loadFile(getUIPath());
  }

  pollSystemHealthMonitoring(mainWindow);

  ipcMainHandler("getStaticData", () => {
    return getStaticData();
  });
});

// quitting the app when no windows are open on non-macOS platforms
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
