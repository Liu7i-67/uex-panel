import type { IResult } from './store/RootStore/interface';

export interface IObj {
  [key: string]: string | { [key: string]: string };
}

export const seactStr = (req: {
  /** @param 文本内容 */
  resource: IObj | string;
  /** @param 路径 */
  path: string[];
  /** @param 搜索的内容 */
  search: string;
  /** @param 输出的目标数组 */
  targetArr: IResult[];
  /** @param 对应的key */
  key: string;
  /** @param 是否为精准匹配 true-是 */
  isPM: boolean;
}) => {
  const { resource, path, search, targetArr, key, isPM } = req;
  switch (typeof resource) {
    case 'string':
      {
        if (!resource.includes(search)) {
          return;
        }
        if (isPM && (resource !== search)) {
          return;
        }
        targetArr.push({
          key,
          path,
          full: resource,
        });
      }
      break;
    case 'object':
      {
        if (!resource) {
          return;
        }
        const list = Object.keys(resource);
        for (let i of list) {
          seactStr({
            resource: resource[i],
            path: key ? [...path, key] : path,
            search,
            targetArr,
            key: i,
            isPM,
          });
        }
      }
      break;
  }
};
