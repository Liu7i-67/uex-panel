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
}

export interface IOutput {
  /** @param 输出i18next的json */
  json: string;
  /** @param 输出替换的文案 */
  replace: string;
}
