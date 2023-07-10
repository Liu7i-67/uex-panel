import { LoadingStore } from '@quarkunlimit/qu-mobx';
import { RootStore } from './';
import { Logic } from './Logic';
import { Computed } from './Computed';

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

export enum EType {
  /** @param 数组 */
  ARRAY = 'Array',
  /** @param 对象 */
  OBJECT = 'OBJECT',
  /** @param 简单类型 */
  SIMPLE = 'SIMPLE',
}

export interface IRow {
  /** @param 唯一标识符 */
  id: string;
  /** @param 类型 */
  type: EType;
  /** @param 用于调用fakerjs的参数 */
  fakerValue: string;
  /** @param 生成的数量 */
  count: number;
  /** @param 字段名 */
  label: string;
  children: IRow[];
}

export interface ISaveItem {
  label: string;
  data: IRow;
}
