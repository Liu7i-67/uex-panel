import type { PluginInfo } from "@dprint/formatter";
import createWorker from "./formatter.worker.ts?worker";

const formatterWorker = new createWorker();

const pluginInfoListeners: ((info: PluginInfo) => void)[] = [];
const formatListeners: ((text: string) => void)[] = [];
const errorListeners: ((err: string) => void)[] = [];

formatterWorker.addEventListener("message", (ev) => {
  console.log("ev:", ev);
  switch (ev.data.type) {
    case "PluginInfo":
      for (const listener of pluginInfoListeners) {
        listener(ev.data.info);
      }
      break;
    case "Format":
      for (const listener of formatListeners) {
        listener(ev.data.text);
      }
      break;
    case "Error":
      for (const listener of errorListeners) {
        listener(ev.data.message);
      }
      break;
  }
});

export function loadUrl(url: string) {
  formatterWorker.postMessage({
    type: "LoadUrl",
    url,
  });
}

export function setConfig(config: any) {
  formatterWorker.postMessage({
    type: "SetConfig",
    config,
  });
}

export function formatText(filePath: string, fileText: string) {
  formatterWorker.postMessage({
    type: "Format",
    filePath,
    fileText,
  });
}

export function addOnPluginInfo(listener: (info: PluginInfo) => void) {
  pluginInfoListeners.push(listener);
}

export function removeOnPluginInfo(listener: (info: PluginInfo) => void) {
  const index = pluginInfoListeners.indexOf(listener);
  if (index >= 0) {
    pluginInfoListeners.splice(index, 1);
  }
}

export function addOnFormat(listener: (text: string) => void) {
  formatListeners.push(listener);
}

export function removeOnFormat(listener: (text: string) => void) {
  const index = formatListeners.indexOf(listener);
  if (index >= 0) {
    formatListeners.splice(index, 1);
  }
}

export function addOnError(listener: (err: string) => void) {
  errorListeners.push(listener);
}

export function removeOnError(listener: (err: string) => void) {
  const index = errorListeners.indexOf(listener);
  if (index >= 0) {
    errorListeners.splice(index, 1);
  }
}
