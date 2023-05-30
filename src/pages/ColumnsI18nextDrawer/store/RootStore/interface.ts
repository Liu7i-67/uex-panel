
import { LoadingStore } from '@quarkunlimit/qu-mobx';
import { RootStore } from './';
import { Logic } from "./Logic"
import { Computed } from "./Computed"


export type TLoadingStore = LoadingStore<'loading'>;

/** 逻辑接口 */
export interface ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
}  
  
/** 计算属性接口 */
export interface IComputed {
  rootStore: RootStore;
}

/** 根Store接口 */
export interface IRootStore {
  logic: Logic;
  computed: Computed;
  loadingStore: TLoadingStore;
}
  