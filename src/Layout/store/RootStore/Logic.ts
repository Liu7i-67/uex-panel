import { makeAutoObservable } from "@quarkunlimit/qu-mobx";
import { ILogic, TLoadingStore } from "./interface";
import { RootStore } from "./";
import { routerList } from "@/config/router";
import type { IRouterItem } from "@/config/router";

export class Logic implements ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  renderColumns = false;
  routerItem: IRouterItem = routerList[0];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loadingStore = rootStore.loadingStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  changeRouterItem(routerItem: IRouterItem) {
    this.routerItem = routerItem;
  }
}
