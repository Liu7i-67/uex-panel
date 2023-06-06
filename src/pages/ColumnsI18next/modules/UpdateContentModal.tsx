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
        <li>优化了format的逻辑，即使贴入的内容没有变化，只改了配置，再次点击转换也能正常format 【by 周涛】</li>
        <li>调整【是否全部使用Trans】开关的位置，和【是否启用暴力模式调换位置】（感觉基本都是默认开启暴力模式，调整是否全部Trans更加频繁）【by 67】</li>
        <li>调整了【转换】【其他设置】按钮的位置，防止想点【转换】的时候点到【其他设置】（在网页中访问体验更佳）【by 67】</li>
        <li>移除【自动导入i18next】、【自动导入Trans配置】。调整为自动判断是否需要导入（点开关点烦了）【by 67】</li>
        <li>新增了这个更新公告，防止没有看消息的同学不知道页面为什么变了【by 67】</li>
      </ul>
    </Dialog>
  );
});

export default UpdateContentModal