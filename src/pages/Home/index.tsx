import type { PluginInfo } from "@dprint/formatter";
import React, { useState, useEffect } from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import type { IHomeProps } from "./interface";
import { Provider, useStore } from "./store/RootStore";
import "./index.scss";
import { UrlSaver } from "utils/UrlSharer";
import {
  getPluginUrls,
  getLanguageFromPluginUrl,
  getPluginDefaultConfig,
} from "utils/plugins";
import * as formatterWorker from "utils/FormatterWorker";
import { InputTextarea } from "primereact/inputtextarea";

const urlSaver = new UrlSaver();
const initialUrl = urlSaver.getUrlInfo();
let isFirstLoad = true;

const Home = observer(function Home_(props: IHomeProps) {
  const root = useStore();
  const [pluginUrls, setPluginUrls] = useState<string[]>([]);
  //  "https://static.web.realmerit.com.cn/typescript-0.68.0.wasm"

  const [pluginUrl, setPluginUrl] = useState(
    "https://static.web.realmerit.com.cn/typescript-0.68.0.wasm"
  );
  /**
   * {
    name: "dprint-plugin-typescript",
    version: "0.84.4",
    configKey: "typescript",
    fileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "cjs", "mts", "cts"],
    fileNames: [],
    helpUrl: "https://dprint.dev/plugins/typescript",
    configSchemaUrl:
      "https://plugins.dprint.dev/dprint/dprint-plugin-typescript/0.84.4/schema.json",
  }
   */
  const [pluginInfo, setPluginInfo] = useState<PluginInfo | undefined>({
    name: "dprint-plugin-typescript",
    version: "0.84.4",
    configKey: "typescript",
    fileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "cjs", "mts", "cts"],
    fileNames: [],
    helpUrl: "https://dprint.dev/plugins/typescript",
    configSchemaUrl:
      "https://plugins.dprint.dev/dprint/dprint-plugin-typescript/0.84.4/schema.json",
  });

  const [text, setText] = useState(initialUrl.text);
  const [configText, setConfigText] = useState(initialUrl.configText ?? "");
  const [defaultConfigText, setDefaultConfigText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // initialization
  useEffect(() => {
    const abortController = new AbortController();
    getPluginUrls(abortController.signal)
      .then((pluginUrls) => {
        setPluginUrls(pluginUrls.concat(initialUrl.plugin ?? []));
        if (initialUrl.plugin == null) {
          setPluginUrl(
            pluginUrls.find(
              (url) =>
                getLanguageFromPluginUrl(url) ===
                (initialUrl.language ?? "typescript")
            )!
          );
        }
      })
      .catch((err) => {
        if (!abortController.signal.aborted) {
          console.error(err);
          alert(
            "There was an error getting the plugins. Try refreshing the page or check the browser console."
          );
        }
      });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    formatterWorker.addOnPluginInfo(onPluginInfo);
    formatterWorker.addOnFormat(onFormat);
    formatterWorker.addOnError(onError);

    return () => {
      formatterWorker.removeOnPluginInfo(onPluginInfo);
      formatterWorker.removeOnError(onError);
      formatterWorker.removeOnFormat(onFormat);
    };

    function onPluginInfo(pluginInfo: PluginInfo) {
      setPluginInfo(pluginInfo);
    }

    function onFormat(text: string) {
      setFormattedText(text);
    }

    function onError(err: string) {
      alert(
        "There was an error with the formatter worker. Try refreshing the page or check the browser console."
      );
    }
  }, [setFormattedText, setPluginInfo]);

  useEffect(() => {
    if (pluginUrl == null) {
      return;
    }

    const language = getLanguageFromPluginUrl(pluginUrl);
    const isBuiltInLanguage = !!language;

    urlSaver.updateUrl({
      text,
      configText: configText === defaultConfigText ? undefined : configText,
      plugin: isBuiltInLanguage ? undefined : pluginUrl,
      language: isBuiltInLanguage ? language : undefined,
    });
  }, [text, configText, pluginUrl, defaultConfigText]);

  useEffect(() => {
    setIsLoading(true);

    if (pluginUrl == null) {
      return;
    }

    formatterWorker.loadUrl(pluginUrl);
  }, [pluginUrl]);

  useEffect(() => {
    if (pluginUrl == null || pluginInfo == null) {
      return;
    }

    const abortController = new AbortController();
    getPluginDefaultConfig(pluginInfo.configSchemaUrl, abortController.signal)
      .then((defaultConfigText) => {
        if (isFirstLoad && initialUrl.configText != null) {
          setConfigText(initialUrl.configText);
          isFirstLoad = false;
        } else {
          setConfigText(defaultConfigText);
        }
        setDefaultConfigText(defaultConfigText);
        setIsLoading(false);
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        console.error(err);
        alert(
          "There was an error loading the plugin. Check the console or try refreshing the page."
        );
      });

    return () => {
      abortController.abort();
    };
  }, [pluginUrl, pluginInfo]);

  console.log("formatterWorker:", formatterWorker);
  if (pluginUrl == null || pluginInfo == null) {
    return (
      <div
        onClick={() => {
          console.log("formatterWorker:", formatterWorker);
          formatterWorker.loadUrl(pluginUrl);
        }}
      >
        正在初始化
      </div>
    );
  }

  return (
    <div className="page-home">
      欢迎使用uex-panel
      <div>
        <InputTextarea
          className="full"
          placeholder="请输入需要转换的columns"
          value={text}
          rows={10}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>翻译后：{formattedText}</div>
    </div>
  );
});

export default observer(function HomePage(props: IHomeProps) {
  return (
    <Provider>
      <Home {...props} />
    </Provider>
  );
});

export * from "./interface";
