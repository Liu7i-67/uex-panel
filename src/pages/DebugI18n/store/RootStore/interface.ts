import { LoadingStore } from '@quarkunlimit/qu-mobx';
import { RootStore } from './';
import { Logic } from './Logic';
import { Computed } from './Computed';

export type TLoadingStore = LoadingStore<'loading'>;

/** 逻辑接口 */
export interface ILogic {
  /** @param 匹配的结果 */
  result: IResult[];
  /** @param 目标文本 */
  cnString: string;
  /** @param 文本类型 */
  stringType: TI18n;
  /** @param 匹配模式 */
  matchType: TMatch;
  /** @param 匹配目标 */
  matchTarget: TTarget;
  /** @function 修改匹配模式 */
  changeMatchType: (mode: TMatch) => void;
  /** @function 修改匹配目标 */
  changeMatchTarget: (mode: TTarget) => void;
  /** @function 修改目标文本 */
  changeCnString: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @function 修改文本类型 */
  changeStringType: (str: TI18n) => void;
  /** @function 搜索 */
  search: () => void;
  /** @function 载入数据源 */
  loadResource: () => Promise<unknown>;
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  /** @param 数据源 */
  resource: {
    [key in TI18n]: string;
  };
  /** @param 是否展示自定义数据源输入框 */
  showCustom: boolean;
  changeShowCustom: () => void;
  diyUrl: string;
  changeDiyUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveDiyUrl: () => void;
  /** @function 载入资源之前检查一下本地有没有 */
  beforeLoadResource: () => Promise<unknown> | string;
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

export type TI18n = 'zh-CN' | 'zh-TW' | 'zh-HK';

/** @type FM-模糊匹配 PM-精准匹配 */
export type TMatch = 'FM' | 'PM';

/** @type text-根据key找中文 key-根据中文找key */
export type TTarget = 'text' | 'key';

export interface IResult {
  /** @param 全部文本 */
  full: string;
  /** @param 对应的key */
  key: string;
  /** @param 父级路径 */
  path: string[];
  [key: string]: (string | number | string[]);
}
