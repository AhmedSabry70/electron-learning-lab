import { app, BrowserWindow } from "electron";
import path from "path";
import {
  getSystemHealthReport,
  startSystemHealthMonitoring,
} from "./resourceManager.js";
import { isDev } from "./util.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    const contents = mainWindow.webContents;
    console.log(contents);
  } else {
    // Production mode
    console.log("App is running in production");
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  getSystemHealthReport();
  startSystemHealthMonitoring();
});

// quitting the app when no windows are open on non-macOS platforms
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
