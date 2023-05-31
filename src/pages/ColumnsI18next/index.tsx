import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import { Provider, useStore } from "./store/RootStore";
import { OtherSettingDrawer } from "./modules/OtherSettingDrawer";
import { ToolBar } from "./modules/ToolBar";
import "./index.scss";

const ColumnsI18next = observer(function ColumnsI18next_() {
  const root = useStore();
  const { logic } = root;

  useEffect(() => {
    logic.readLocalData();
  }, []);

  return (
    <div className="page-ColumnsI18next">
      <div>
        tips: 只能识别单引号，例如：<code>title: '名称'</code>
        ，双引号的先用Dprint格式化一下。
      </div>
      <ToolBar />
      <OtherSettingDrawer />
      <div className="mt-8">tips: 双击即可复制</div>
      <div className="out-put" onDoubleClick={() => logic.copyOutPut("json")}>
        {logic.output.json}
      </div>
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
