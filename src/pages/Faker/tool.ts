import { EType, IRow as IItemRow } from './store/RootStore/interface';
import { faker } from '@faker-js/faker/locale/zh_CN';

export interface IRow {
  label: string;
  value: string;
}

export interface IRowBox extends IRow {
  children: IRow[];
}

export const fakerList: IRow[] = [
  {
    label: '人名',
    value: 'person.fullName',
  },
  {
    label: '生日',
    value: 'date.birthdate',
  },
];

export const getData = (row: IItemRow) => {
  if (row.type === EType.SIMPLE) {
    let fn: any = faker;
    const list = row.fakerValue.split('.');
    for (let key of list) {
      fn = fn[key];
    }
    return fn?.();
  }

  const arr: any = [];

  const count = row.type === EType.OBJECT ? 1 : row.count;

  for (let i = 0; i < count; i++) {
    const obj: any = {};

    for (let r of row.children) {
      if (r.type !== EType.SIMPLE) {
        obj[r.label] = getData(r);
        continue;
      }

      let fn: any = faker;
      const list = r.fakerValue.split('.');
      for (let key of list) {
        fn = fn[key];
      }

      obj[r.label] = fn?.();
    }
    arr.push(obj);
  }

  if (row.type === EType.OBJECT) {
    return arr[0];
  }
  return arr;
};

export const typeList = [
  {
    value: EType.SIMPLE,
    label: '字段',
  },
  {
    value: EType.ARRAY,
    label: '数组',
  },
  {
    value: EType.OBJECT,
    label: '对象',
  },
];

export const getColorNum = () => {
  return Math.floor(Math.random() * 256);
};
