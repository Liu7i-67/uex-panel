import React from "react";
import { useStore } from "../store/RootStore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { observer } from "@quarkunlimit/qu-mobx";
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";

 const UpdateContentModal = observer(function UpdateContentModal_() {
  const root = useStore();
  const { logic } = root;

  return (
    <Dialog
      header="更新公告"
      visible={logic.updateVisible}
      onHide={logic.changeUpdateVisible}
      maskClassName="page-ColumnsI18next-dialog"
      style={{ width: '50vw',maxHeight:'500px' }}
    >
      <h4>v1.0.0 <span className="ml-8">更新时间：2023年6月6日16点56分</span></h4>
      <ul>
        <li>1.移除【自动导入i18next】、【自动导入Trans配置】。调整为自动判断是否需要导入（点开关点烦了）</li>
        <li>2.调整【是否全部使用Trans】开关的位置，和【是否启用暴力模式调换位置】（感觉基本都是默认开启暴力模式）</li>
        <li>3.新增了这个更新公告，防止没有看消息的同学不知道页面为什么变了</li>
      </ul>
    </Dialog>
  );
});

export default UpdateContentModal