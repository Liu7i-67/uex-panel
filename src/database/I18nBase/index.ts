import { NGDexieStore } from '../NGDexieStore';
import type { Resource } from 'i18next';

const initData: Resource = {
  'zh-CN': {
    'name': '张三',
  },
};

const indexName: string[] = ['data'];

export const i18nDB = new NGDexieStore<typeof initData>(
  initData,
  'i18nBase',
  indexName,
);
