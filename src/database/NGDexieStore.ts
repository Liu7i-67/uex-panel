import Dexie, { Table } from 'dexie';

interface ITable {
  id: number;
  hospitalKey: string;
  tenant: string;
  userId: string;
}

export class NGI18Store<T> {
  private tableName: string;
  private moduleName: string;
  private indexName: string[];
  private defaults: T;
  private path: string;
  private _instance: any;
  private environment: string;
  constructor(defaults: T, name: string, indexName: string[]) {
    this.tableName = 'i18n';
    this.moduleName = name;
    this.indexName = indexName;
    this.defaults = defaults;
    this.environment = 'diy';
    this._instance = new Dexie('RealmeritDatabase');
  }

  private get instance() {
    return this._instance;
  }

  private async checkOpen() {
    await this.instance.open()
      .then((db: Dexie) => {
        const tableInstance = db.table(this.tableName);
        this.instance[this.tableName] = tableInstance;
      })
      .catch(async (err: any) => {
        await this.instance.version(1).stores({
          [this.tableName]: `++id, moduleType, environment, ${this.indexName.join(',')}`,
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
          [this.tableName]: `++id, moduleType, environment, ${this.indexName.join(',')}`,
        });
        await this.instance.open();
      } else {
        await this.checkOpen();
      }
    }
  }

  public async get<Key extends keyof T>(key?: Key | string): Promise<ITable | null | undefined> {
    try {
      await this.checkTable();
      const res = await this.instance[this.tableName].get({
        moduleType: this.moduleName,
        environment: this.environment,
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
          environment: this.environment,
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
