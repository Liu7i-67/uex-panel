import React, { useEffect } from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import { Provider, useStore } from "./store/RootStore";
import { OtherSettingDrawer } from "./modules/OtherSettingDrawer";
import { ToolBar } from "./modules/ToolBar";
import * as formatterWorker from "utils/FormatterWorker";
import { TabView, TabPanel } from "primereact/tabview";
import "./index.scss";

const ColumnsI18next = observer(function ColumnsI18next_() {
  const root = useStore();
  const { logic } = root;

  // 挂载事件
  useEffect(() => {
    formatterWorker.addOnFormat(logic.onFormat);
    formatterWorker.addOnError(logic.onError);

    return () => {
      formatterWorker.removeOnError(logic.onError);
      formatterWorker.removeOnFormat(logic.onFormat);
    };
  }, []);

  // 加载wasm
  useEffect(() => {
    if (logic.pluginUrl == null) {
      return;
    }
    formatterWorker.loadUrl(logic.pluginUrl);
    formatterWorker.setConfig({
      lineWidth: 120,
      indentWidth: 2,
      quoteStyle: "alwaysSingle",
      "arrowFunction.useParentheses": "force",
      "jsx.quoteStyle": "preferSingle",
      "module.sortImportDeclarations": "maintain",
    });
  }, [logic.pluginUrl]);

  useEffect(() => {
    if (!logic.formData.cleanStr) {
      return;
    }
    logic.formatColumns();
  }, [logic.formData.cleanStr]);

  return (
    <div className="page-ColumnsI18next">
      <ToolBar />
      <OtherSettingDrawer />
      <div className="mt-8">tips: 双击即可复制</div>
      <TabView>
        <TabPanel header="zh_CN">
          <div
            className="out-put"
            onDoubleClick={() => logic.copyOutPut("json")}
          >
            <div></div>
            {logic.output.json}
          </div>
        </TabPanel>
        <TabPanel header="zh_HK">
          <div
            className="out-put"
            onDoubleClick={() => logic.copyOutPut("jsonHK")}
          >
            <div></div>
            {logic.output.jsonHK}
          </div>
        </TabPanel>
        <TabPanel header="zh_TW">
          <div
            className="out-put"
            onDoubleClick={() => logic.copyOutPut("jsonTW")}
          >
            <div></div>
            {logic.output.jsonTW}
          </div>
        </TabPanel>
      </TabView>
      <div
        className="out-put"
        onDoubleClick={() => logic.copyOutPut("replace")}
      >
        {logic.output.replace}
      </div>
    </div>
  );
});

export default observer(function ColumnsI18nextPage() {
  return (
    <Provider>
      <ColumnsI18next />
    </Provider>
  );
});

export * from "./interface";
