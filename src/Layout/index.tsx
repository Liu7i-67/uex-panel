import { Suspense, lazy } from "react";
import { Button } from "primereact/button";
import { observer } from "@quarkunlimit/qu-mobx";
import type { ILayoutProps } from "./interface";
import { Provider, useStore } from "./store/RootStore";
import "./index.scss";

const ColumnsI18nextDrawer = lazy(() => import("pages/ColumnsI18nextDrawer"));

const Layout = observer(function Layout_() {
  const root = useStore();

  return (
    <div className="layout">
      <Button>columns i18next</Button>
      <Suspense fallback="loading">
        <ColumnsI18nextDrawer />
      </Suspense>
    </div>
  );
});

export default observer(function LayoutPage() {
  return (
    <Provider>
      <Layout />
    </Provider>
  );
});

export * from "./interface";
