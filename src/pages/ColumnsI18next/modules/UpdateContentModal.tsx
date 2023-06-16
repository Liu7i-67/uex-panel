import React from 'react';
import { useStore } from '../store/RootStore';
import { observer } from '@quarkunlimit/qu-mobx';
import { Dialog } from 'primereact/dialog';

const UpdateContentModal = observer(function UpdateContentModal_() {
  const root = useStore();
  const { logic } = root;

  return (
    <Dialog
      header='更新公告'
      visible={logic.updateVisible}
      onHide={logic.changeUpdateVisible}
      maskClassName='page-ColumnsI18next-dialog'
      style={{ width: '50vw', maxHeight: '500px' }}
    >
      <h4>
        v1.3.0 <span className='ml-8'>更新时间：2023年6月16日16点27分</span>
      </h4>
      <ul>
        <li>
          1.
          中文回溯地址默认指向https://static.web.realmerit.com.cn/i18n/test/lang.json。这个地址也不是最新的json数据（需要更新可以找67），后面这个功能上到正式之后会更新优化获取最新的数据源。
        </li>
        <li>
          2. 搜索后将数据源缓存到本地，如果要获取最新的信息请点击重载数据源
        </li>
      </ul>
      <h4>
        v1.2.0 <span className='ml-8'>更新时间：2023年6月13日10点36分</span>
      </h4>
      <ul>
        <li>
          新增中文回溯功能
          <ol>
            <li>输入中文</li>
            <li>选择中文所属的语言</li>
            <li>选择匹配模式</li>
            <li>点击搜索，检索出项目中包含该中文的i18完整路径</li>
            <li>适用于shift+Q调不到指定位置的场景</li>
          </ol>
        </li>
        <li>优化更新公告展示逻辑，查看后会将版本号写入localStorage，防止同一版本反复弹出</li>
      </ul>
      <h4>
        v1.1.0 <span className='ml-8'>更新时间：2023年6月9日14点36分</span>
      </h4>
      <ul>
        <li>t函数从renderer/i18n中导入</li>
      </ul>
      <h4>
        v1.0.0 <span className='ml-8'>更新时间：2023年6月6日16点56分</span>
      </h4>
      <ul>
        <li>优化了format的逻辑，即使贴入的内容没有变化，只改了配置，再次点击转换也能正常format</li>
        <li>调整【是否全部使用Trans】开关的位置，和【是否启用暴力模式调换位置】（感觉基本都是默认开启暴力模式，调整是否全部Trans更加频繁）</li>
        <li>调整了【转换】【其他设置】按钮的位置，防止想点【转换】的时候点到【其他设置】（在网页中访问体验更佳）</li>
        <li>移除【自动导入i18next】、【自动导入Trans配置】。调整为自动判断是否需要导入（点开关点烦了）</li>
        <li>新增了这个更新公告，防止没有看消息的同学不知道页面为什么变了</li>
      </ul>
    </Dialog>
  );
});

export default UpdateContentModal;
