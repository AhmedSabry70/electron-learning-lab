import { app, ipcMain, WebContents } from "electron";
import path from "path";

export const isDev = () => {
  return process.env.NODE_ENV === "development";
};

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}

export function ipcMainHandler<key extends keyof EventPayloadMapping>(
  key: string,
  handler: () => EventPayloadMapping[key]
) {
  ipcMain.handle(key, () => handler());
}

export function ipcWebContentsSend<key extends keyof EventPayloadMapping>(
  key: key,
  webContents: WebContents,
  payload: EventPayloadMapping[key]
) {
  webContents.send(key, payload);
}
