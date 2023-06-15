import Dexie, { Table } from 'dexie';

const getLoginInfo = () => {
  return {
    user: {
      createTenant: '67',
      tenant: '67',
      id: '67',
    },
    hospital_key: 'test',
  };
};

interface ITable {
  id: number;
  hospitalKey: string;
  tenant: string;
  userId: string;
}

export class NGDexieStore<T> {
  private hospitalKey: string;
  private tenant: string;
  private userId: string;
  private tableName: string;
  private moduleName: string;
  private indexName: string[];
  private defaults: T;
  private path: string;
  private _instance: any;
  constructor(defaults: T, name: string, indexName: string[]) {
    const user = getLoginInfo().user;
    this.hospitalKey = getLoginInfo().hospital_key;
    this.tenant = user.createTenant == user.tenant ? '' : user.tenant;
    this.userId = user.id;
    this.tableName = getLoginInfo().hospital_key;
    this.moduleName = name;
    this.indexName = indexName;
    this.defaults = defaults;
    this._instance = new Dexie('RealmeritDatabase');
  }

  private get instance() {
    return this._instance;
  }

  private async getOldData(key?: any) {
    try {
      const itemKey = `${this.userId}${this.tenant}-${this.moduleName}`;
      const data: any = window.localStorage.getItem(itemKey);
      if (data) {
        const resData = JSON.parse(data);
        if (key) {
          await this.set(key, resData[key]);
          window.localStorage.removeItem(itemKey);
        }
        return resData;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  private async checkOpen() {
    await this.instance.open()
      .then((db: Dexie) => {
        const tableInstance = db.table(this.tableName);
        this.instance[this.tableName] = tableInstance;
      })
      .catch(async (err: any) => {
        await this.instance.version(1).stores({
          [this.tableName]: `++id, hospitalKey, tenant, userId, moduleType, ${this.indexName.join(',')}`,
        });
        await this.instance.open();
      });
  }

  private async checkTable() {
    const tables = this.instance.tables || [];
    const hasTable = tables.some((item: Table) => item.name === this.tableName);
    const isOpen = this.instance.isOpen();
    if (!hasTable) {
      if (isOpen) {
        this.instance.close();
        await this.instance.version(this.instance.verno + 1).stores({
          [this.tableName]: `++id, hospitalKey, tenant, userId, moduleType, ${this.indexName.join(',')}`,
        });
        await this.instance.open();
      } else {
        await this.checkOpen();
      }
    }
  }

  public async get<Key extends keyof T>(key?: Key | string): Promise<ITable | null | undefined> {
    try {
      if (key) await this.getOldData(key);
      await this.checkTable();
      const res = await this.instance[this.tableName].get({
        moduleType: this.moduleName,
        tenant: this.tenant,
        userId: this.userId,
      });
      const resData = res ?? this.defaults;
      if (key) {
        if (!resData[key]) {
          return undefined;
        }
        return resData[key];
      }
      return resData;
    } catch (error) {
      console.error(`get-error->${this.path}`, error);
      return undefined;
    }
  }

  public async set<Key extends keyof T>(key: Key | string, value?: T[Key]): Promise<boolean> {
    try {
      const tableInfo = await this.get();
      if (tableInfo && tableInfo.id) {
        await this.instance[this.tableName].update(tableInfo.id, {
          [key]: { ...value },
        });
      } else {
        await this.instance[this.tableName].add({
          hospitalKey: this.hospitalKey,
          tenant: this.tenant,
          userId: this.userId,
          moduleType: this.moduleName,
          [key]: { ...value },
        });
      }
      return true;
    } catch (error) {
      console.error(`set-error->${this.path}`, error);
      return false;
    }
  }

  public async delete<Key extends keyof T>(key: Key): Promise<boolean> {
    try {
      const tableInfo = await this.get();
      if (tableInfo && tableInfo.id) {
        await this.instance[this.tableName].delete(tableInfo.id);
      }
      return true;
    } catch (error) {
      console.error(`delete-error->${this.path}`, error);
      return false;
    }
  }
}
