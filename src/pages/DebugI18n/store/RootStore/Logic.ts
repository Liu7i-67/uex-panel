import { makeAutoObservable, runInAction } from '@quarkunlimit/qu-mobx';
import { ILogic, IResult, TI18n, TLoadingStore, TMatch } from './interface';
import { message } from '@/components/message';
import { RootStore } from './';
import { getJSONToParse } from '@/utils/Tools';
import { seactStr } from '../../tools';
import { ChangeEvent } from 'react';
import axios from 'axios';
import { baseUrl } from '@/../config/variable';

export class Logic implements ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  cnString: string = '';
  stringType: TI18n = 'zh-CN';
  resource: { 'zh-CN': string; 'zh-TW': string; 'zh-HK': string } = { 'zh-CN': '', 'zh-HK': '', 'zh-TW': '' };
  matchType: TMatch = 'FM';
  result: IResult[] = [];
  showCustom: boolean = false;
  diyUrl: string = `${baseUrl}zh-CN.json`;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loadingStore = rootStore.loadingStore;
    makeAutoObservable(this, {}, { autoBind: true });
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
      const res = await this.loadResource();
      if (res !== 'success') {
        return;
      }
    }
    runInAction(() => {
      const str = dataSource || this.resource[this.stringType];

      let reg = new RegExp(`("[^"]*?"): *("[^"]*${this.cnString}[^"]*")`, 'gu');
      if (this.matchType === 'PM') {
        reg = new RegExp(`("[^"]*?"): *("${this.cnString}")`, 'gu');
      }
      const match = str.matchAll(reg);
      let index = 1;
      const result: IResult[] = [];
      for (let item of match) {
        result.push({
          index,
          full: item[2],
          key: item[1],
          findIndex: item.index,
          path: [],
        });
        index++;
      }
      this.result = result;
    });
  }
  async search2() {
    const dataSource = this.resource[this.stringType];
    if (!dataSource) {
      const res = await this.loadResource();
      if (res !== 'success') {
        return;
      }
    }
    runInAction(() => {
      const str = dataSource || this.resource[this.stringType];
      const strObj = getJSONToParse(str);

      const result: IResult[] = [];
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

  loadResource() {
    const that = this;
    return new Promise((res) => {
      let url = `${baseUrl}${this.stringType}.json`;

      const diyUrl = localStorage.getItem('url');
      if (diyUrl) {
        url = diyUrl;
      }
      message({
        severity: 'info',
        summary: '提示',
        detail: '正在加载数据源，请耐心等待...',
        life: 3000,
      });

      axios({
        method: 'get',
        url,
      }).then((response) => {
        // 响应数据自动解压缩
        console.log('response:', response);
        if (response.status !== 200) {
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
          that.resource[that.stringType] = JSON.stringify(response.data) || '';
          res('success');
        });
      }).catch(() => {
        message({
          severity: 'error',
          summary: '错误',
          detail: '数据源获取失败',
          life: 3000,
        });
        return res('error');
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
