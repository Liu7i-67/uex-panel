/*
 * @Author: liu71
 * @Date: 2023-05-30 20:55:49
 * @Last Modified by: liu7i
 * @Last Modified time: 2023-05-31 16:21:25
 */

import { makeAutoObservable } from "@quarkunlimit/qu-mobx";
import {
  IFormData,
  ILogic,
  IOutput,
  IQuickSet,
  TLoadingStore,
} from "./interface";
import { RootStore } from "./";
import { CopyToClipboard, getJSONToParse } from "utils/Tools";
import { message } from "@/components/message";
import * as formatterWorker from "utils/FormatterWorker";

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
    cleanStr: "",
  };
  output: IOutput = {
    json: "等待转换",
    replace: "等待转换",
  };

  quick: IQuickSet[] = [
    {
      key: "key",
      title: "title",
      id: 0,
      canDelete: false,
    },
    {
      key: "field",
      title: "label",
      id: 1,
      canDelete: false,
    },
  ];
  pluginUrl: string =
    "https://static.web.realmerit.com.cn/typescript-0.68.0.wasm";

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loadingStore = rootStore.loadingStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  onFormat(str: string) {
    console.log("fmt:", str);
    this.formData.cleanStr = str;
  }

  onError(err: string) {
    console.error(err);
    message({
      severity: "error",
      summary: "Error",
      detail: "Dprint格式化程序工作线程出错",
      life: 3000,
    });
  }

  addQuickSet() {
    const item: IQuickSet = {
      key: this.formData.key,
      title: this.formData.title,
      id: Date.now(),
      canDelete: true,
    };

    this.quick = [...this.quick, item];

    this.saveToLocal();
  }

  deleteQuickSet(item: IQuickSet) {
    this.quick = this.quick.filter((i) => i.id !== item.id);
    this.saveToLocal();
  }

  saveToLocal() {
    localStorage.setItem("i18next", JSON.stringify(this.quick));
  }

  readLocalData() {
    const local: IQuickSet[] = getJSONToParse(
      localStorage.getItem("i18next") || ""
    );
    if (!local) {
      return;
    }
    const diyData = local.filter((i) => i.canDelete);
    this.quick = [...this.quick, ...(diyData || [])];
  }

  quickSetting(item: IQuickSet) {
    this.formData.key = item.key;
    this.formData.title = item.title;
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

  dprintStr() {
    formatterWorker.formatText("file.ts", this.formData.str);
  }

  formatColumns() {
    const rowArr = this.formData.cleanStr.split("\n");

    const keyArr: string[] = [];
    // 过滤掉不要的
    rowArr.forEach((i) => {
      if (
        i.includes(`${this.formData.title}:`) ||
        i.includes(`${this.formData.key}:`)
      ) {
        keyArr.push(i);
      }
    });

    let str = "i18next";
    let val = "i18next";

    const resJson: { [key: string]: string } = {};
    const valJson: { [key: string]: string } = {};

    // 生成对应的i18next
    keyArr.forEach((i) => {
      let result = "";

      if (i.includes(`${this.formData.title}:`)) {
        result = i.match(/'([^']*)'/)?.[1] || "";
        // const chinesePattern = /[\u4e00-\u9fa5]+/g; // 匹配中文的正则表达式
        // result = i.match(chinesePattern)?.[0] || "";
        str = result;
      } else if (i.includes(`${this.formData.key}:`)) {
        result = i.match(/'([^']*)'/)?.[1] || "";
        val = result;
      }

      if (str !== "i18next" && val !== "i18next") {
        resJson[val] = str;
        valJson[str] = val;
        str = "i18next";
        val = "i18next";
      }
    });

    // 修改之前的
    rowArr.forEach((i, index) => {
      if (i.includes(`${this.formData.title}:`)) {
        const chinesePattern = /[\u4e00-\u9fa5]+/g; // 匹配中文的正则表达式
        const result = i.match(chinesePattern)?.[0] || "";
        rowArr[index] = i.replace(
          `'${result}'`,
          `${this.formData.prefix}("${this.formData.path}${valJson[result]}")`
        );
      }
    });

    this.output.json = JSON.stringify(resJson);
    this.output.replace = rowArr.join("\n");
  }
}
