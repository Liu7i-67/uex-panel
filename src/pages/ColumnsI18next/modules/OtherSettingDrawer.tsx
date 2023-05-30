import React from "react";
import { useStore } from "../store/RootStore";
import { InputText } from "primereact/inputtext";
import { observer } from "@quarkunlimit/qu-mobx";
import { Sidebar } from "primereact/sidebar";

export const OtherSettingDrawer = observer(function OtherSettingDrawer_() {
  const root = useStore();
  const { logic } = root;

  return (
    <Sidebar visible={logic.visible} onHide={logic.changeVisible}>
      <div>中文对应的renderValue</div>
      <InputText
        placeholder='请输入'
        value={logic.formData.title}
        onChange={(e) => logic.changeFormData("title", e.target.value)}
      />
      <div className='mt-12'>关键字对应的renderKey</div>
      <InputText
        placeholder='请输入'
        value={logic.formData.key}
        onChange={(e) => logic.changeFormData("key", e.target.value)}
      />
    </Sidebar>
  );
});
