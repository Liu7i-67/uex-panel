import { ns } from './index';
import type { Resource } from 'i18next';

const resources: Resource = { 'zh-HK': {} };

for (let item of ns) {
  let data = {};
  try {
    data = require(`../zh-HK/${item}.json`);
  } catch (error) {
    data = require(`../zh-CN/${item}.json`);
  }
  resources['zh-HK'][item] = data;
}

export default resources;
