import { initReactI18next } from 'react-i18next';
import type { Resource } from 'i18next';
import axios from 'axios';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { ns } from './resources';
import { baseUrl, isDev } from '../../config/variable';

type TKey = 'zh-CN' | 'zh-TW' | 'zh-HK';

const supportedLanguages = new Set(['zh-CN', 'zh-TW', 'zh-HK']);

async function initI18N(lang: string) {
  let resources: Resource = { 'zh-CN': {}, 'zh-TW': {}, 'zh-HK': {} };

  let r = {} as any;
  try {
    if (isDev) {
      r = await import(/* webpackChunkName: 'i18n' */ `./resources/${lang}`);
      r = r.default;
    } else {
      await axios({
        method: 'get',
        url: `${baseUrl}${lang}.json`,
      }).then((response) => {
        // 响应数据自动解压缩
        r[lang] = response.data;
      }).catch((error) => {
        console.error(error);
      });
    }
  } catch (error) {
    if (isDev) {
      r = await import(/* webpackChunkName: 'i18n' */ `./resources/zh-CN`);
      r = r.default;
    } else {
      await axios({
        method: 'get',
        url: `${baseUrl}${lang}.json`,
      }).then((response) => {
        // 响应数据自动解压缩
        r[lang] = response.data;
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  resources = r;

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
  if (!supportedLanguages.has(lang)) {
    lang = 'zh-CN';
  }

  return {
    lang,
  };
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
