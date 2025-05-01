import { app } from "electron";
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
