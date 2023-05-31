import React from "react";
import { useStore } from "../store/RootStore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { observer } from "@quarkunlimit/qu-mobx";
import { Sidebar } from "primereact/sidebar";

export const OtherSettingDrawer = observer(function OtherSettingDrawer_() {
  const root = useStore();
  const { logic } = root;

  return (
    <Sidebar
      visible={logic.visible}
      onHide={logic.changeVisible}
      maskClassName="page-ColumnsI18next-drawer"
    >
      <div>中文对应的renderValue</div>
      <InputText
        placeholder="请输入"
        value={logic.formData.title}
        onChange={(e) => logic.changeFormData("title", e.target.value)}
      />
      <div className="mt-12">关键字对应的renderKey</div>
      <InputText
        placeholder="请输入"
        value={logic.formData.key}
        onChange={(e) => logic.changeFormData("key", e.target.value)}
      />
      <Button size="small" className="mt-4" onClick={logic.addQuickSet}>
        添加到快捷设置
      </Button>
      <div className="mt-12">快捷设置</div>
      {logic.quick.map((item) => (
        <div
          className="picker-item"
          key={item.id}
          onClick={() => logic.quickSetting(item)}
        >
          <span>
            {item.title} ---- {item.key}
          </span>
          {item.canDelete && (
            <span
              className="close"
              onClick={(e) => {
                e.stopPropagation();
                logic.deleteQuickSet(item);
              }}
            >
              x
            </span>
          )}
        </div>
      ))}
    </Sidebar>
  );
});
