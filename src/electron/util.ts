import { app, ipcMain, WebContents, WebFrameMain } from "electron";
import path from "path";
import { pathToFileURL } from "url";

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

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function ipcMainHandler<key extends keyof EventPayloadMapping>(
  key: string,
  handler: () => EventPayloadMapping[key]
) {
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame as WebFrameMain);
    return handler();
  });
}

export function ipcWebContentsSend<key extends keyof EventPayloadMapping>(
  key: key,
  webContents: WebContents,
  payload: EventPayloadMapping[key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  console.log(`kkkkkkkkkkkkkkkkkkkkkkkkkkkk: ${frame.url}`);

  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event");
  }
}
