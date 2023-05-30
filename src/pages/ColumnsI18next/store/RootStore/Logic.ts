/*
 * @Author: liu71
 * @Date: 2023-05-30 20:55:49
 * @Last Modified by: liu71
 * @Last Modified time: 2023-05-30 22:48:48
 */

import { makeAutoObservable } from "@quarkunlimit/qu-mobx";
import { IFormData, ILogic, IOutput, TLoadingStore } from "./interface";
import { RootStore } from "./";
import { CopyToClipboard } from "utils/Tools";

export class Logic implements ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  visible: boolean = false;

  formData: IFormData = {
    prefix: "i18next.t",
    path: "common:columns.",
    key: "key",
    title: "title",
    str: "",
  };
  output: IOutput = {
    json: "",
    replace: "",
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loadingStore = rootStore.loadingStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  copyOutPut(key: keyof IOutput) {
    CopyToClipboard(this.output[key]);
  }

  changeFormData(key: keyof IFormData, value: string) {
    this.formData[key] = value;
  }

  changeVisible() {
    this.visible = !this.visible;
  }

  formatColumns() {
    this.output.json = this.formData.str;
    this.output.replace = this.formData.str;
  }
}
