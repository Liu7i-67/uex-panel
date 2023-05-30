import { Suspense } from "react";
import { observer } from "@quarkunlimit/qu-mobx";
import { Provider, useStore } from "./store/RootStore";
import { routerList } from "@/config/router";
import "./index.scss";
import { classNames } from "utils/Tools";

const Layout = observer(function Layout_() {
  const root = useStore();
  const { logic } = root;

  return (
    <div className='layout'>
      <div className='layout-content'>
        <Suspense fallback='loading'>
          <logic.routerItem.component />
        </Suspense>
      </div>
      <div className='layout-tabs'>
        {routerList.map((item) => {
          return (
            <div
              key={item.title}
              className={classNames({
                "layout-nav": true,
                active: logic.routerItem.title === item.title,
              })}
              onClick={() => logic.changeRouterItem(item)}>
              {item.title}
            </div>
          );
        })}
      </div>
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
