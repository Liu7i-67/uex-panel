/*
 * @Author: liu71
 * @Date: 2023-05-30 20:55:49
 * @Last Modified by: liu7i
 * @Last Modified time: 2023-06-01 16:09:32
 */

import { makeAutoObservable, toJS } from "@quarkunlimit/qu-mobx";
import {
  IFormData,
  ILogic,
  IOutput,
  IQuickSet,
  TLoadingStore,
  IObj
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
  violentPattern = true;
  allTrans = false;
  dataSourceKV:IObj = {};
  dataSourceVK:IObj = {};

  dprintError = false;
  formData: IFormData = {
    prefix: "i18next.t",
    path: "common:columns.",
    key: "key",
    title: "title",
    str: "",
    cleanStr: "",
    keyStart: "0",
    dataSource: "",
  };

  output: IOutput = {
    json: "等待转换ZN",
    replace: "等待转换",
    jsonHK: "等待转换HK",
    jsonTW: "等待转换TW",
  };
  autoImport: boolean = false;
  autoImportTans: boolean = false;
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

  changeAutoImport() {
    this.autoImport = !this.autoImport;
  }

  changeAutoImportTans() {
    this.autoImportTans = !this.autoImportTans;
  }

  changeAllTrans() {
    this.allTrans = !this.allTrans;
  }

  changeViolentPattern() {
    this.violentPattern = !this.violentPattern;
  }

  onFormat(str: string) {
    if (this.formData.cleanStr === str) {
      message({
        severity: "info",
        summary: "Info",
        detail: "当前输入内容格式化后无变化",
        life: 3000,
      });
      return;
    }
    this.output.json = "等待转换ZN";
    this.output.replace = "等待转换";
    this.output.jsonHK = "等待转换HK";
    this.output.jsonTW = "等待转换TW";
    this.formData.cleanStr = str;
  }

  onError(err: string) {
    console.error(err);
    this.dprintError = true;
    message({
      severity: "error",
      summary: "Error",
      detail: "Dprint格式化程序工作线程出错，请自行对输入文本进行格式化",
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
    let str = this.output[key];
    CopyToClipboard(str);
  }

  changeFormData(key: keyof IFormData, value: string) {
    this.formData[key] = value;
  }

  changeVisible() {
    this.visible = !this.visible;
  }

  dprintStr() {
    if (this.dprintError) {
      this.formData.cleanStr = this.formData.str;
      return;
    }
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

    const resJson: IObj = {};
    const valJson: IObj = {};

    // 生成对应的i18next
    keyArr.forEach((i) => {
      let result = "";

      if (i.includes(`${this.formData.title}:`)) {
        result = i.match(/'([^']*)'/)?.[1] || ""; 
        str = result;
      } else if (i.includes(`${this.formData.key}:`)) {
        result = i.match(/'([^']*)'/)?.[1] || "";
        val = result;
      }

      if (str !== "i18next" && val !== "i18next") {

        const alreadyKey = this.dataSourceVK[str];
        if(alreadyKey){
          valJson[str] = alreadyKey
          str = "i18next";
          val = "i18next";
          return
        } 

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

        let newStr = `${this.formData.prefix}("${this.formData.path}${valJson[result]}")`;

        if (this.allTrans) {
          newStr = `<Trans i18Key='${this.formData.path}${valJson[result]}'>{(v) => v}</Trans>`;
        }

        rowArr[index] = i.replace(`'${result}'`, newStr);
      }
    });

    this.output.json = JSON.stringify(resJson);
    this.output.replace = rowArr.join("\n");

    if (this.autoImportTans) {
      this.output.replace =
        "import { Trans } from 'renderer/i18n';\n" + this.output.replace;
    }

    if (this.autoImport) {
      this.output.replace =
        "import i18next from 'i18next';\n" + this.output.replace;
    }

    this.output.jsonHK = HKConverter(this.output.json);
    this.output.jsonTW = TWConverter(this.output.json);
    message({
      severity: "success",
      summary: "Success",
      detail: "转换完成",
      life: 1000,
    });
  }

  formatAll() {
    const stringPattern = /'[\u4e00-\u9fa5]+'/g; // 匹配字符串的正则表达式
    const chinesePattern = /[\u4e00-\u9fa5]+/g; // 匹配中文的正则表达式
    const commentPattern = /\/\/ [\u4e00-\u9fa5]+/g; // 匹配注释的正则
    const ignorePattern = /别动我[\u4e00-\u9fa5]+/g; // 匹配注释的正则
    const transPattern = /'[\u4e00-\u9fa5]+-='/g; // 匹配需要使用trans替换的字符串的正则
    const transSingePattern = /[\u4e00-\u9fa5]+-=/g; // 匹配需要使用trans替换的中文的正则

    let commentIndex = 0;
    const arrCommentObj: IObj = {};
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

    let index = Number(this.formData.keyStart) || 0;
    const json: IObj = {};
    const vkJson: IObj = {};

    if (!this.allTrans) {
      // 找到所有需要使用trans替换的字符串
      const arrT = replace.matchAll(transPattern);

      for (let item of arrT) {
        const cStr = item[0].substring(1, item[0].length - 3);
        let key = this.dataSourceVK[cStr]|| "";
        if(this.dataSourceVK[cStr]){
          vkJson[cStr] = this.dataSourceVK[cStr];
        } else if(!vkJson[cStr]) {
          key = `key${index}`;
          json[key] = cStr;
          vkJson[cStr] = key;
          index += 1;
        } else {
          key = vkJson[cStr];
        }

        replace = replace.replaceAll(
          item[0],
          `<Trans i18Key='${this.formData.path}${key}'>{(v) => v}</Trans>`
        );
      }
    }

    // 找到所有字符串
    const arr = replace.matchAll(stringPattern);

    for (let item of arr) { 
      const cStr = item[0].substring(1, item[0].length - 1);
      let key = this.dataSourceVK[cStr]|| "";
      if(this.dataSourceVK[cStr]){
        vkJson[cStr] = this.dataSourceVK[cStr];
      } else  if (!vkJson[cStr]) {
        key = `key${index}`;
        json[key] = cStr;
        vkJson[cStr] = key;
        index += 1;
      } else {
        key = vkJson[cStr];
      }

      let newStr = `${this.formData.prefix}("${this.formData.path}${key}")`;

      if (this.allTrans) {
        newStr = `<Trans i18Key='${this.formData.path}${key}'>{(v) => v}</Trans>`;
      }

      replace = replace.replaceAll(item[0], newStr);
    }

    if (!this.allTrans) {
      // 找到其它需要trans的中文
      const arr3 = replace.matchAll(transSingePattern);
      const box2: string[] = [];

      for (let item of arr3) {
        box2.push(item[0]);
      }

      box2.sort((i, j) => j.length - i.length);

      for (let item of box2) { 
        const cStr = item.substring(0, item.length - 2);
        let key = this.dataSourceVK[cStr]|| "";
        if(this.dataSourceVK[cStr]){
          vkJson[cStr] = this.dataSourceVK[cStr];
        } else  if (!vkJson[cStr]) {
          key = `key${index}`;
          json[key] = cStr;
          vkJson[cStr] = key;
          index += 1;
        } else {
          key = vkJson[cStr];
        }

        replace = replace.replaceAll(
          item,
          `<Trans i18Key='${this.formData.path}${key}'>{(v) => v}</Trans>`
        );
      }
    }

    // 找到其它的中文
    const arr2 = replace.matchAll(chinesePattern);
    const box: string[] = [];

    for (let item of arr2) {
      box.push(item[0]);
    }

    box.sort((i, j) => j.length - i.length);

    for (let item of box) { 
      const cStr = item;
      let key = this.dataSourceVK[cStr]|| "";
      if(this.dataSourceVK[cStr]){
        vkJson[cStr] = this.dataSourceVK[cStr];
      } else  if (!vkJson[cStr]) {
        key = `key${index}`;
        json[key] = cStr;
        vkJson[cStr] = key;
        index += 1;
      } else {
        key = vkJson[cStr];
      }

      let newStr = `{${this.formData.prefix}("${this.formData.path}${key}")}`;

      if (this.allTrans) {
        newStr = `<Trans i18Key='${this.formData.path}${key}'>{(v) => v}</Trans>`;
      }

      replace = replace.replaceAll(item, newStr);
    }

    // 还原保护的注释
    Object.keys(arrCommentObj).forEach((i) => {
      replace = replace.replace(i, arrCommentObj[i]);
    });

    this.output.json = JSON.stringify(json);
    this.output.replace = replace;
    if (this.autoImportTans) {
      this.output.replace =
        "import { Trans } from 'renderer/i18n';\n" + this.output.replace;
    }

    if (this.autoImport) {
      this.output.replace =
        "import i18next from 'i18next';\n" + this.output.replace;
    }
    this.output.jsonHK = HKConverter(this.output.json);
    this.output.jsonTW = TWConverter(this.output.json);
    message({
      severity: "success",
      summary: "Success",
      detail: "转换完成",
      life: 1000,
    });
  }

  translation() {
    this.output.json = this.formData.str;
    this.output.jsonHK = HKConverter(this.output.json);
    this.output.jsonTW = TWConverter(this.output.json);
    message({
      severity: "success",
      summary: "Success",
      detail: "翻译完成",
      life: 1000,
    });
  }

  formatDataSource() {
    if (!this.formData.dataSource) {
      this.dataSourceKV = {};
      this.dataSourceVK = {};
      return;
    }
    const cleanSource = getJSONToParse(this.formData.dataSource); 
    if (
      !cleanSource ||
      Object.prototype.toString.call(cleanSource) !== "[object Object]"
    ) {

      this.dataSourceKV = {};
      this.dataSourceVK = {};
      message({
        severity: "error",
        summary: "Error",
        detail: "数据源不合法或者解析后不是一个对象",
        life: 3000,
      });
      return
    }
    this.dataSourceKV  = cleanSource;
    const VK:{[key:string]:string} = {}
    Object.keys(this.dataSourceKV).forEach(key=>{
      VK[this.dataSourceKV[key] as string] = key
    })

    this.dataSourceVK = VK; 
    message({
      severity: "success",
      summary: "Success",
      detail: "数据源解析成功",
      life: 1000,
    });
  }
}
