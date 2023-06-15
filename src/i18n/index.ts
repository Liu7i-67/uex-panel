import { initReactI18next } from 'react-i18next';
import type { Resource } from 'i18next';
import axios from 'axios';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { ns } from './resources';
import { baseUrl, isDev } from '../../config/variable';
import { i18nDB } from '../database/I18nBase';

export const langArr = ['zh-CN', 'zh-TW', 'zh-HK'] as const;
export type TKey = typeof langArr[number];

const supportedLanguages = new Set<TKey>(langArr);

async function loadResource(lang: TKey): Promise<Resource> {
  try {
    // 判断是否为开发环境
    if (isDev) {
      const res = await import(/* webpackChunkName: 'i18n' */ `./resources/${lang}`);
      return res.default;
    }
    // 生产环境首先尝试从indexDB获取resource
    const oldData = await i18nDB.get('data') as unknown as Resource;
    if (oldData && oldData[lang]) {
      return oldData;
    }
    // indexDB中没有，从CDN获取
    await axios({
      method: 'get',
      url: `${baseUrl}${lang}.json`,
    }).then((response) => {
      const newData = Object.assign({}, oldData, { [lang]: response.data });
      i18nDB.set('data', newData);
      return {
        [lang]: response.data,
      };
    }).catch((error) => {
      console.error(`${lang} loading failure:`, error);
    });
  } catch (error) {
    console.error(`${lang} loading failure catch:`, error);
    // 如果发生了异常，加载中文兜底
    if (isDev) {
      const res = await import(/* webpackChunkName: 'i18n' */ `./resources/zh-CN`);
      return res.default;
    }
    // 生产环境首先尝试从indexDB获取resource
    const oldData = await i18nDB.get('data') as unknown as Resource;
    if (oldData && oldData['zh-CN']) {
      return oldData;
    }
    // indexDB中没有，从CDN获取
    await axios({
      method: 'get',
      url: `${baseUrl}zh-CN.json`,
    }).then((response) => {
      const newData = Object.assign({}, oldData, { [lang]: response.data });
      i18nDB.set('data', newData);
      return {
        [lang]: response.data,
      };
    }).catch((error) => {
      console.error(`base ${lang} loading failure:`, error);
    });
  }
}

async function initI18N(lang: TKey) {
  const resources = await loadResource(lang);

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
      partialBundledLanguages: false,
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
    console.error('initLang:Error', error);
  }
}

export async function changeLocale(_lang: TKey) {
  console.error('change _lang:', _lang);
  i18next.changeLanguage(_lang).finally(() => {
    window.localStorage.setItem('realmerit_language', _lang);
    window.location.reload();
  });
}

export { t, Trans } from './Trans';
