import { NGI18Store } from '../NGDexieStore';
import type { TKey } from '../../i18n';
import type { ResourceLanguage } from 'i18next';

export type T18Store = {
  [key in TKey]: I18Record;
};

export interface I18Resource {
  date: number;
  /** @param 文本内容 */
  resource: ResourceLanguage;
}

export interface I18Record {
  [key: string]: I18Resource;
}

const initData: T18Store = {
  'zh-CN': {},
  'zh-HK': {},
  'zh-TW': {},
};

const indexName: string[] = ['data'];
export const i18nDB = new NGI18Store<typeof initData>(
  initData,
  'i18n',
  indexName,
);
