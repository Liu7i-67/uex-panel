import React from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import type { IHomeProps } from "./interface";
import { Provider } from "./store/RootStore";
import "./index.scss";

const Home = observer(function Home_(props: IHomeProps) {
  return <div className="page-home">欢迎使用uex-panel</div>;
});

export default observer(function HomePage(props: IHomeProps) {
  return (
    <Provider>
      <Home {...props} />
    </Provider>
  );
});

export * from "./interface";
