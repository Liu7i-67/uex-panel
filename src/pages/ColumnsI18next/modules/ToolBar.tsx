import React from "react";
import { useStore } from "../store/RootStore";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { observer } from "@quarkunlimit/qu-mobx";
import { InputSwitch } from "primereact/inputswitch";

export const ToolBar = observer(function ToolBar_() {
  const root = useStore();
  const { logic } = root;

  return (
    <>
      <div className="flex">
        <label className="form mr-20">
          <span>前缀</span>
          <InputText
            placeholder="请输入"
            value={logic.formData.prefix}
            onChange={(e) => logic.changeFormData("prefix", e.target.value)}
          />
        </label>
        <label className="form mr-20">
          <span>路径</span>
          <InputText
            placeholder="请输入"
            value={logic.formData.path}
            onChange={(e) => logic.changeFormData("path", e.target.value)}
          />
        </label>
        <InputSwitch
          checked={logic.allTrans}
          onChange={logic.changeAllTrans}
          tooltip="是否全部使用Trans"
        /> 
        <Button onClick={logic.changeVisible} className="ml-8">
          其他设置
        </Button>
        <Button onClick={logic.dprintStr} className="ml-8">
          转换
        </Button>
        <Button onClick={logic.translation} className="ml-8">
          仅翻译
        </Button>
      </div>

      <InputTextarea
        className="full"
        placeholder="请输入"
        value={logic.formData.str}
        onChange={(e) => logic.changeFormData("str", e.target.value)}
      />
    </>
  );
});
