import { ns } from './index';
import type { Resource } from 'i18next';

const resources: Resource = { 'zh-CN': {} };

for (let item of ns) {
  const data = require(`../zh-CN/${item}.json`);
  resources['zh-CN'][item] = data;
}

export default resources;
