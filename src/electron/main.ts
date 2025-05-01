import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import {
  getStaticData,
  getSystemHealthReport,
  pollSystemHealthMonitoring,
  startSystemHealthMonitoring,
} from "./resourceManager.js";
import { getPreloadPath, isDev } from "./util.js";

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
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  getSystemHealthReport();
  startSystemHealthMonitoring();
  pollSystemHealthMonitoring(mainWindow);

  ipcMain.handle("getStaticData", () => {
    return getStaticData();
  });
});

// quitting the app when no windows are open on non-macOS platforms
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
