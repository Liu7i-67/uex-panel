import { initReactI18next } from 'react-i18next';
import type { Resource } from 'i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { ns } from './resources';

type TKey = 'zh-CN' | 'zh-TW' | 'zh-HK';

const supportedLanguages = new Set(['zh-CN', 'zh-TW', 'zh-HK']);

async function initI18N(lang: string) {
  let resources: Resource = { 'zh-CN': {}, 'zh-TW': {}, 'zh-HK': {} };

  let r = {} as any;
  try {
    r = await import(/* webpackChunkName: 'i18n' */ `./resources/${lang}`);
  } catch (error) {
    r = await import(/* webpackChunkName: 'i18n' */ `./resources/zh-CN`);
  }

  resources = r.default;

  return i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'zh-CN',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
      lng: lang,
      partialBundledLanguages: true,
      ns,
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
