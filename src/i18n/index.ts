import { initReactI18next } from 'react-i18next';
import { makeAutoObservable } from '@quarkunlimit/qu-mobx';
import type { ResourceLanguage } from 'i18next';
import axios from 'axios';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { ns } from './resources';
import { baseUrl, isDev } from '../../config/variable';
import { i18nDB, I18Record } from '../database/I18nBase';

export const langArr = ['zh-CN', 'zh-TW', 'zh-HK'] as const;
export type TKey = typeof langArr[number];

const supportedLanguages = new Set<TKey>(langArr);

// 存储所有订阅者的回调函数
const subscribers: { [key: string]: Map<Function, Function> } = {};

// 订阅消息
export function subscribe(topic: string, callback: Function) {
  if (subscribers[topic]) {
    subscribers[topic].set(callback, callback);
  } else {
    subscribers[topic] = new Map<Function, Function>();
    subscribers[topic].set(callback, callback);
  }
}

// 取消订阅消息
export function unsubscribe(topic: string, callback: Function) {
  if (subscribers[topic]) {
    subscribers[topic].delete(callback);
  }
}

// 发布消息
export function publish(topic: string, data: string | boolean) {
  if (subscribers[topic]) {
    for (let [, callback] of subscribers[topic]) {
      callback(data);
    }
  }
}

function getI18Md5() {
  const i18nMd5Content = document.head.querySelector('meta[name="i18n"]')?.getAttribute('content') || '';
  const i18nMd5 = i18nMd5Content.split(' ').reduce((result, current) => {
    const [key, value] = current.split(':');
    result[key as TKey] = value;
    return result;
  }, {} as { [key in TKey]: string | undefined });
  return i18nMd5;
}

async function loadBaseLang() {
  const res = await loadResource('zh-CN');

  Object.keys(res).forEach((ns) => {
    i18next.addResourceBundle('zh-TW', ns, res[ns], true);
  });
  publish('load', true);
}

async function loadResource(lang: TKey): Promise<ResourceLanguage> {
  try {
    // 判断是否为开发环境
    if (isDev) {
      const res = await import(/* webpackChunkName: 'i18n' */ `./resources/${lang}`);
      return res.default[lang] as ResourceLanguage;
    }
    const md5 = getI18Md5();
    // 生产环境首先尝试从indexDB获取resource
    const oldData = await i18nDB.get(lang) as unknown as (I18Record | undefined);
    const key = md5[lang] || '';
    const record = oldData?.[key];
    if (md5[lang] && record) {
      return record.resource;
    }
    // indexDB中没有，从CDN获取
    const res: { status: number; data: ResourceLanguage } = await axios({
      method: 'get',
      url: `${baseUrl}${lang}.${key ? `${key}.` : ''}json`,
    });
    if (res.status === 200) {
      const newData = Object.assign({}, oldData, { [key]: { date: Date.now(), resource: res.data } });
      let count = 0;
      let min = 0;
      let oldItem = '';
      for (let item in newData) {
        count += 1;
        if (newData[item].date < min) {
          oldItem = item;
          min = newData[item].date;
        }
      }
      if (count > 4) {
        delete newData[oldItem];
      }
      i18nDB.set(lang, newData);

      return res.data;
    }
    return {} as ResourceLanguage;
  } catch (error) {
    // 如果发生了异常，加载中文兜底
    if (isDev) {
      const res = await import(/* webpackChunkName: 'i18n' */ `./resources/zh-CN`);
      return res.default[lang] as ResourceLanguage;
    }
    const md5 = getI18Md5();
    // 生产环境首先尝试从indexDB获取resource
    const oldData = await i18nDB.get('zh-CN') as unknown as (I18Record | undefined);
    const key = md5['zh-CN'] || '';
    const record = oldData?.[key];
    if (record) {
      return record.resource;
    }
    // indexDB中没有，从CDN获取
    const res: { status: number; data: ResourceLanguage } = await axios({
      method: 'get',
      url: `${baseUrl}zh-CN.${md5['zh-CN'] ? `${md5['zh-CN']}.` : ''}json`,
    });
    if (res.status === 200) {
      const newData = Object.assign({}, oldData, { [key]: { date: Date.now(), resource: res.data } });
      let count = 0;
      let min = 0;
      let oldItem = '';
      for (let item in newData) {
        count += 1;
        if (newData[item].date < min) {
          oldItem = item;
          min = newData[item].date;
        }
      }
      if (count > 4) {
        delete newData[oldItem];
      }
      i18nDB.set('zh-CN', newData);

      return res.data;
    }
    return {} as ResourceLanguage;
  }
}

async function initI18N(lang: TKey) {
  // const res = await loadResource(lang);
  const res = {};
  const resources = { [lang]: res };
  loadBaseLang();
  return i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // 如果没有可用的用户语言翻译，要使用的语言。将其显式设置为false将根本不会触发加载fallbackLng。
      fallbackLng: 'zh-CN',
      // 将信息级别记录到控制台
      debug: isDev,
      // 插值
      interpolation: {
        // escape传递值以避免XSS注入
        escapeValue: false,
      },
      // 要使用的语言(覆盖语言检测)。如果设置为'cimode'，则输出文本将是密钥
      lng: lang,
      // 允许在初始化时设置一些资源，而其他资源可以使用后端连接器加载
      partialBundledLanguages: true,
      // 要加载的名称空间的字符串或数组
      ns,
      // 如果没有传递给转换函数，则使用默认命名空间
      defaultNS: false,
      react: {
        useSuspense: true,
      },
      resources: resources,
    })
    .catch((e) => {
      console.error('i18next init error:', e);
    });
}

function g_lang(_lang?: TKey) {
  let lang = _lang
    || window.localStorage.getItem('realmerit_language')
    || navigator.language;
  if (!supportedLanguages.has(lang as TKey)) {
    lang = 'zh-CN';
  }

  return {
    lang,
  } as { lang: TKey };
}
export async function initLang() {
  try {
    const { lang } = g_lang();
    await initI18N(lang);
  } catch (error) {
  }
}

export async function changeLocale(_lang: TKey) {
  i18next.changeLanguage(_lang).finally(() => {
    window.localStorage.setItem('realmerit_language', _lang);
    window.location.reload();
  });
}

export { t, Trans } from './Trans';
