/*
 * @Author: liu71
 * @Date: 2023-05-30 21:11:50
 * @Last Modified by: liu71
 * @Last Modified time: 2023-05-30 21:31:41
 */
import { lazy } from "react";

export interface IRouterItem {
  title: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
}

export const routerList = [
  {
    title: "i18next",
    component: lazy(() => import("pages/ColumnsI18next")),
  },
  {
    title: "其他",
    component: lazy(() => import("pages/Other")),
  },
];
