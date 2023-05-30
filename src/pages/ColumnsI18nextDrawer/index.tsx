import React from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import type { IColumnsI18nextDrawerProps } from "./interface";
import { Provider, useStore } from "./store/RootStore";
import { Sidebar } from "primereact/sidebar";

const ColumnsI18nextDrawer = observer(function ColumnsI18nextDrawer_(
  props: IColumnsI18nextDrawerProps
) {
  const root = useStore();

  return (
    <Sidebar visible={true} onHide={() => {}} fullScreen>
      ColumnsI18nextDrawer
    </Sidebar>
  );
});

export default observer(function ColumnsI18nextDrawerPage(
  props: IColumnsI18nextDrawerProps
) {
  return (
    <Provider>
      <ColumnsI18nextDrawer {...props} />
    </Provider>
  );
});

export * from "./interface";
