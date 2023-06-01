import React from "react";
import { useStore } from "../store/RootStore";
import { observer } from "@quarkunlimit/qu-mobx";
import { TabView, TabPanel } from "primereact/tabview";

export const I18JSON = observer(function I18JSON_() {
  const root = useStore();
  const { logic } = root;

  return (
    <TabView>
      <TabPanel header="zh_CN">
        <div className="out-put" onDoubleClick={() => logic.copyOutPut("json")}>
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
  );
});
