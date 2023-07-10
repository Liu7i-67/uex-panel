import { observer } from '@quarkunlimit/qu-mobx';
import { Sidebar } from 'primereact/sidebar';
import React from 'react';
import { useStore } from '../store/RootStore';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ISaveItem } from '../store/RootStore/interface';
import { Button } from 'primereact/button';

const nameBody = (item: ISaveItem) => item.label;
const dataBody = (item: ISaveItem) => {
  return <div>{JSON.stringify(item.data)}</div>;
};

export const SettingSidebar = observer(function SettingSidebar_() {
  const root = useStore();
  const { logic } = root;

  return (
    <Sidebar visible={logic.drawer.visible} onHide={logic.changeDrawer} style={{ width: '60vw' }}>
      <DataTable value={logic.drawer.list} tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight='90vh'>
        <Column field='label' style={{ width: '200px' }} header='名称' body={nameBody}></Column>
        <Column field='data' header='内容' body={dataBody}></Column>
        <Column
          field='option'
          header='操作'
          style={{ width: '200px' }}
          body={(item: ISaveItem) => (
            <div>
              <Button size='small' severity='danger' onClick={() => logic.remove(item)}>
                删除
              </Button>
              <Button size='small' className='ml-8' onClick={() => logic.read(item)}>
                读取
              </Button>
            </div>
          )}
        >
        </Column>
      </DataTable>
    </Sidebar>
  );
});
