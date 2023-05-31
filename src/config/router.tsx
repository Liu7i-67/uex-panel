/*
 * @Author: liu71
 * @Date: 2023-05-30 21:11:50
 * @Last Modified by: liu7i
 * @Last Modified time: 2023-05-31 15:26:45
 */
import { lazy } from "react";

export interface IRouterItem {
  title: string;
  component: React.LazyExoticComponent<(props?: any) => JSX.Element>;
}

export const routerList: IRouterItem[] = [
  {
    title: "首页",
    component: lazy(() => import("pages/Home/index")),
  },
  {
    title: "i18next",
    component: lazy(() => import("pages/ColumnsI18next")),
  },
  {
    title: "其他",
    component: lazy(() => import("pages/Other")),
  },
];
