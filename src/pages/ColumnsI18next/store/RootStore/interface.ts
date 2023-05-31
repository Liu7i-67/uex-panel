import { LoadingStore } from "@quarkunlimit/qu-mobx";
import { RootStore } from "./";
import { Logic } from "./Logic";
import { Computed } from "./Computed";

export type TLoadingStore = LoadingStore<"loading">;

/** 逻辑接口 */
export interface ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  /** @param 其他设置drawer是否可见 */
  visible: boolean;
  /** @function 修改drawer可见状态 */
  changeVisible: () => void;
  /** @param 表单数据 */
  formData: IFormData;
  /** @param 展示的文案 */
  output: IOutput;
  /** @function 修改表单数据 */
  changeFormData: (key: keyof IFormData, value: string) => void;
  /** @function 格式化输入的str */
  formatColumns: () => void;
  /** @function 复制输出的内容 */
  copyOutPut: (key: keyof IOutput) => void;
  /** @param 快捷设置数据源 */
  quick: IQuickSet[];
  /** @function 快捷设置其他 */
  quickSetting: (item: IQuickSet) => void;
  /** @param 添加快捷设置 */
  addQuickSet: () => void;
  /** @param 删除快捷设置 */
  deleteQuickSet: (item: IQuickSet) => void;
  /** @param 将快捷设置缓存到本地 */
  saveToLocal: () => void;
  /** @param 读取本地缓存的快捷设置 */
  readLocalData: () => void;
  /** @param dprint wasm路径 */
  pluginUrl: string;
  /** @function 使用dprint格式化文本 */
  onFormat: (str: string) => void;
  /** @function dprint格式化异常 */
  onError: (err: string) => void;
  /** @function 使用dprint格式化输入的参数 */
  dprintStr: () => void;
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

export interface IFormData {
  /** @param 前缀 */
  prefix: string;
  /** @param 路径 */
  path: string;
  /** @param 捕获的title */
  title: string;
  /** @param 捕获的key */
  key: string;
  /** @param 输入的文案 */
  str: string;
  /** @param dprint格式化之后的文案 */
  cleanStr: string;
}

export interface IOutput {
  /** @param 输出i18next的json */
  json: string;
  /** @param 输出i18next的json-HK */
  jsonHK: string;
  /** @param 输出i18next的json-TW */
  jsonTW: string;
  /** @param 输出替换的文案 */
  replace: string;
}

export interface IQuickSet {
  title: string;
  key: string;
  id: number;
  canDelete: boolean;
}
