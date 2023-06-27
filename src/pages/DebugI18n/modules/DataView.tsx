import React from 'react';
import { useStore } from '../store/RootStore';
import { observer } from '@quarkunlimit/qu-mobx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CopyToClipboard } from 'utils/Tools';

export const DataView = observer(function DataView_() {
  const root = useStore();
  const { logic } = root;

  return (
    <div className='mt-24'>
      <div className='total'>共有{logic.result.length}项</div>
      <DataTable
        value={logic.result}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className='mt-8'
      >
        <Column
          field='index'
          header='序号'
          style={{ width: '10%' }}
          body={(r, e) => {
            return e.rowIndex + 1;
          }}
        >
        </Column>
        <Column
          field='key'
          header='标识'
          style={{ width: '50%' }}
          filter
          filterPlaceholder='请输入'
          body={(record) => {
            let path = record.path?.slice?.(1).join('.');
            if (!!path) {
              path += '.';
            }
            const str = `${record.path?.[0]}:${path}${record.key}`;

            return <span className='ml-8' onDoubleClick={() => CopyToClipboard(str)}>{str}</span>;
          }}
          showAddButton={false}
        >
        </Column>
        <Column
          field='full'
          header='完整文本'
          filter
          filterPlaceholder='请输入'
          style={{ width: '40%' }}
          showAddButton={false}
        >
        </Column>
      </DataTable>
    </div>
  );
});
