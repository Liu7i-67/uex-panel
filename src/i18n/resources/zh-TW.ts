import { ns } from './index';
import type { Resource } from 'i18next';

const resources: Resource = { 'zh-TW': {} };

for (let item of ns) {
  let data = {};
  try {
    data = require(`../zh-TW/${item}.json`);
  } catch (error) {
    data = require(`../zh-CN/${item}.json`);
  }
  resources['zh-TW'][item] = data;
}

export default resources;
