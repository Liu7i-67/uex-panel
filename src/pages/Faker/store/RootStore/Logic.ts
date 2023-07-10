import { makeAutoObservable } from '@quarkunlimit/qu-mobx';
import { EType, ILogic, IRow, ISaveItem, TLoadingStore } from './interface';
import { RootStore } from './';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { getColorNum, getData } from '../../tool';
import { message } from '@/components/message';
import { getJSONToParse } from '@/utils/Tools';

export class Logic implements ILogic {
  loadingStore: TLoadingStore;
  rootStore: RootStore;
  str: string = '';
  target: string = '';
  obj: IRow = {
    id: 'top',
    count: 1,
    type: EType.ARRAY,
    label: '',
    fakerValue: '',
    children: [],
  };
  objName: string = '';
  drawer = {
    visible: false,
    list: [] as ISaveItem[],
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loadingStore = rootStore.loadingStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  changeDrawer() {
    this.drawer.visible = !this.drawer.visible;
    if (this.drawer.visible) {
      this.readSetting();
    }
  }

  changeObjName(name: string) {
    this.objName = name;
  }

  changeStr(str?: string) {
    this.str = str || '';
  }

  changeTarget(target?: string) {
    this.target = target;
  }

  scanStr() {
    const mock = getData(this.obj);
    console.log('mock:', mock);
  }

  addRow(item: IRow) {
    item.children.push({
      id: Date.now() + 'id',
      type: EType.SIMPLE,
      fakerValue: '',
      count: 1,
      label: 'key',
      children: [],
    });
  }

  removeRow(pNode: IRow, item: IRow) {
    pNode.children = pNode.children.filter((c) => c.id !== item.id);
  }

  changeName(item: IRow, val: string) {
    item.label = val;
  }

  changeType(item: IRow, val: EType) {
    item.type = val;
  }

  changeFakerValue(item: IRow, val: string) {
    item.fakerValue = val;
  }

  changeCount(item: IRow, val: number) {
    item.count = val;
  }

  save() {
    console.log(this.obj);
    console.log(this.objName);
    if (!this.objName) {
      message.warn('请为当前数据命名');
      return;
    }
    const data: ISaveItem[] = getJSONToParse(localStorage.getItem('faker')) || [];
    if (data.some((i) => i.label === this.objName)) {
      message.warn('保存失败，已存在同名文件');
      return;
    }
    data.push({
      label: this.objName,
      data: this.obj,
    });
    localStorage.setItem('faker', JSON.stringify(data));
    message.success('保存成功');
  }

  remove(item: ISaveItem) {
    const newData = this.drawer.list.filter((i) => i.label !== item.label);
    localStorage.setItem('faker', JSON.stringify(newData));
    this.drawer.list = newData;
    message.success('删除成功');
  }

  read(item: ISaveItem) {
    this.objName = item.label;
    this.obj = item.data;
    message.success('读取成功');
  }

  readSetting() {
    const data: ISaveItem[] = getJSONToParse(localStorage.getItem('faker')) || [];
    this.drawer.list = data;
  }
}
