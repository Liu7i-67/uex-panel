import React from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import type { IHomeProps } from "./interface";
import { Provider } from "./store/RootStore";
import "./index.scss";

const Home = observer(function Home_(props: IHomeProps) {
  return (
    <div className="page-home">
      欢迎使用uex-panel
      <div className="mt-12">i18next 更新公告</div>
      <ul className="feat mt-8">
        <li>feat:集成了dprint,不再需要自己dprint格式化</li>
        <li>feat:集成了简体繁体翻译</li>
      </ul>
      <ul className="fix mt-8">
        <li>fix:修复了中文中有符号会被截断的bug</li>
      </ul>
      <div className="mt-12">已知问题</div>
      <ul>
        <li>如果dprint格式化之后title和key在同一行，会转换失败</li>
      </ul>
    </div>
  );
});

export default observer(function HomePage(props: IHomeProps) {
  return (
    <Provider>
      <Home {...props} />
    </Provider>
  );
});

export * from "./interface";
