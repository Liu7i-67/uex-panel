import React, { useEffect } from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import { Provider, useStore } from "./store/RootStore";
import { OtherSettingDrawer } from "./modules/OtherSettingDrawer";
import { ToolBar } from "./modules/ToolBar";
import { I18JSON } from "./modules/I18JSON";
import * as formatterWorker from "utils/FormatterWorker";
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
      <I18JSON />
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
