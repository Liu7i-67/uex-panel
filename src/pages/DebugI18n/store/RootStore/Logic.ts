import { makeAutoObservable, runInAction } from '@quarkunlimit/qu-mobx';
import { ILogic, IResult, TI18n, TLoadingStore, TMatch, TTarget } from './interface';
import { message } from '@/components/message';
import { RootStore } from './';
import { getJSONToParse } from '@/utils/Tools';
import { seactStr } from '../../tools';
import { ChangeEvent } from 'react';

export class Logic implements ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  cnString: string = '';
  stringType: TI18n = 'zh-CN';
  resource: { 'zh-CN': string; 'zh-TW': string; 'zh-HK': string } = { 'zh-CN': '', 'zh-HK': '', 'zh-TW': '' };
  matchType: TMatch = 'FM';

  result: IResult[] = [];
  showCustom: boolean = false;
  diyUrl: string = '';
  matchTarget: TTarget = 'key';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loadingStore = rootStore.loadingStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  changeMatchTarget(mode: TTarget) {
    this.matchTarget = mode;
  }

  saveDiyUrl() {
    const url = localStorage.getItem('url');
    if (!this.diyUrl) {
      if (!url) {
        return;
      }
      localStorage.removeItem('url');
      message({
        severity: 'success',
        summary: '成功',
        detail: '自定义数据源已移除',
        life: 3000,
      });
      return;
    }
    if (url === this.diyUrl) {
      return;
    }
    localStorage.setItem('url', this.diyUrl);
    message({
      severity: 'success',
      summary: '成功',
      detail: '自定义数据源设置保存成功，请点击重载数据源加载数据',
      life: 3000,
    });
  }

  changeShowCustom() {
    this.showCustom = !this.showCustom;
  }

  changeDiyUrl(e: ChangeEvent<HTMLInputElement>) {
    const newUrl = e.target.value || '';
    this.diyUrl = newUrl;
  }

  changeMatchType(mode: TMatch) {
    this.matchType = mode;
  }

  async search() {
    const dataSource = this.resource[this.stringType];
    if (!dataSource) {
      const res = await this.beforeLoadResource();
      if (res !== 'success') {
        return;
      }
    }
    runInAction(() => {
      const str = dataSource || this.resource[this.stringType];
      const strObj = getJSONToParse(str);
      const result: IResult[] = [];
      if (this.matchTarget === 'text') {
        if (!this.cnString.includes(':')) {
          message({
            severity: 'error',
            summary: '错误',
            detail: '请输入完整路径，例如：dashboards:controlCabin.infoList.key37',
            life: 3000,
          });
          return;
        }

        const [ns, path] = this.cnString.split(':');
        const keyArr = path.split('.');
        let val: any = strObj[ns];
        for (let key of keyArr) {
          if (val) {
            val = val[key];
          }
        }

        if (val) {
          result.push({
            full: ['[object Object]', '[object Array]'].includes(
                Object.prototype.toString.call(val),
              )
              ? JSON.stringify(val)
              : val,
            key: keyArr.slice(-1)[0],
            path: [ns].concat(keyArr.slice(0, keyArr.length - 1)),
          });
        }

        this.result = result;
        return;
      }

      seactStr({
        resource: strObj,
        path: [],
        search: this.cnString,
        targetArr: result,
        key: '',
        isPM: this.matchType === 'PM',
      });

      this.result = result;
    });
  }

  beforeLoadResource() {
    const langStr = localStorage.getItem(this.stringType);
    if (langStr) {
      this.resource[this.stringType] = langStr;
      return 'success';
    }
    return this.loadResource();
  }

  loadResource() {
    const that = this;
    return new Promise((res, rej) => {
      let url = `https://static.web.realmerit.com.cn/i18n/test/i18n.${this.stringType}.json`;

      const diyUrl = localStorage.getItem('url');
      if (diyUrl) {
        url = diyUrl;
      }

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function() {
        if (xhr.status !== 200) {
          message({
            severity: 'error',
            summary: '错误',
            detail: '数据源获取失败',
            life: 3000,
          });
          return res('error');
        }
        message({
          severity: 'success',
          summary: '成功',
          detail: '数据源加载成功',
          life: 3000,
        });
        runInAction(() => {
          that.resource[that.stringType] = xhr.responseText || '';
          localStorage.setItem(that.stringType, xhr.responseText);
          res('success');
        });
      };
      xhr.onerror = function() {
        message({
          severity: 'error',
          summary: '错误',
          detail: '数据源获取失败',
          life: 3000,
        });
        return res('error');
      };
      xhr.send();
      message({
        severity: 'info',
        summary: '提示',
        detail: '正在加载数据源，请耐心等待...',
        life: 3000,
      });
    });
  }

  changeCnString(e: React.ChangeEvent<HTMLInputElement>) {
    this.cnString = e.target.value ?? '';
  }

  changeStringType(str: TI18n) {
    this.stringType = str;
  }
}
