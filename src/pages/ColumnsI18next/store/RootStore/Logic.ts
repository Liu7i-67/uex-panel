/*
 * @Author: liu71
 * @Date: 2023-05-30 20:55:49
 * @Last Modified by: liu7i
 * @Last Modified time: 2023-06-01 11:42:33
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
import * as OpenCC from "opencc-js";

const HKConverter = OpenCC.Converter({ from: "cn", to: "hk" });
const TWConverter = OpenCC.Converter({ from: "cn", to: "twp" });
export class Logic implements ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  visible: boolean = false;
  violentPattern = false;

  formData: IFormData = {
    prefix: "i18next.t",
    path: "common:columns.",
    key: "key",
    title: "title",
    str: "",
    cleanStr: "",
    keyStart: "0",
  };

  output: IOutput = {
    json: "等待转换ZN",
    replace: "等待转换",
    jsonHK: "等待转换HK",
    jsonTW: "等待转换TW",
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

  changeViolentPattern() {
    this.violentPattern = !this.violentPattern;
  }

  onFormat(str: string) {
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
    if (this.violentPattern) {
      this.formatAll();
      return;
    }
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
    this.output.jsonHK = HKConverter(this.output.json);
    this.output.jsonTW = TWConverter(this.output.json);
  }

  formatAll() {
    const stringPattern = /'[\u4e00-\u9fa5]+'/g; // 匹配字符串的正则表达式
    const chinesePattern = /[\u4e00-\u9fa5]+/g; // 匹配中文的正则表达式
    const commentPattern = /\/\/ [\u4e00-\u9fa5]+/g; // 匹配注释的正则
    const ignorePattern = /别动我[\u4e00-\u9fa5]+/g; // 匹配注释的正则

    let commentIndex = 0;
    const arrCommentObj: { [key: string]: string } = {};
    let replace = this.formData.cleanStr;

    // 找到所有的注释保护起来
    const arrComment = replace.matchAll(commentPattern);
    for (let item of arrComment) {
      const key = `${Date.now() + Math.random() * 1000}-${commentIndex}`;
      commentIndex += 1;
      arrCommentObj[key] = item[0];
      replace = replace.replace(item[0], key);
    }

    // 找到所有需要跳过的内容保护起来
    const arrComment2 = replace.matchAll(ignorePattern);
    for (let item of arrComment2) {
      const key = `${Date.now() + Math.random() * 1000}-${commentIndex}`;
      commentIndex += 1;
      arrCommentObj[key] = item[0].substring(3);
      replace = replace.replace(item[0], key);
    }

    // 找到所有字符串
    const arr = replace.matchAll(stringPattern);

    let index = Number(this.formData.keyStart) || 0;
    const json: { [key: string]: string } = {};
    const vkJson: { [key: string]: string } = {};

    for (let item of arr) {
      let key = "";
      const cStr = item[0].substring(1, item[0].length - 1);
      if (!vkJson[cStr]) {
        key = `key${index}`;
        json[key] = cStr;
        vkJson[cStr] = key;
        index += 1;
      } else {
        key = vkJson[cStr];
      }

      replace = replace.replaceAll(
        item[0],
        `${this.formData.prefix}("${this.formData.path}${key}")`
      );
    }

    // 找到其它的中文
    const arr2 = replace.matchAll(chinesePattern);
    const box: string[] = [];

    for (let item of arr2) {
      box.push(item[0]);
    }

    box.sort((i, j) => j.length - i.length);

    for (let item of box) {
      let key = "";
      const cStr = item;
      if (!vkJson[cStr]) {
        key = `key${index}`;
        json[key] = cStr;
        vkJson[cStr] = key;
        index += 1;
      } else {
        key = vkJson[cStr];
      }

      replace = replace.replaceAll(
        item,
        `{${this.formData.prefix}("${this.formData.path}${key}")}`
      );
    }

    // 还原保护的注释
    Object.keys(arrCommentObj).forEach((i) => {
      replace = replace.replace(i, arrCommentObj[i]);
    });

    this.output.json = JSON.stringify(json);
    this.output.replace = replace;
    this.output.jsonHK = HKConverter(this.output.json);
    this.output.jsonTW = TWConverter(this.output.json);
  }

  translation() {
    this.output.json = this.formData.str;
    this.output.jsonHK = HKConverter(this.output.json);
    this.output.jsonTW = TWConverter(this.output.json);
  }
}
