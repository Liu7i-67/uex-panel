import React, { useEffect } from 'react';
import { Provider, useStore } from './store/RootStore';
import { observer } from '@quarkunlimit/qu-mobx';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CopyToClipboard } from 'utils/Tools';
import { FilterMatchMode } from 'primereact/api';

interface IProps {
  /** @function 去翻译 */
  toTrans: () => void;
}

const options = [
  { name: 'zh-CN', value: 'zh-CN' },
  { name: 'zh-TW', value: 'zh-TW' },
  { name: 'zh-HK', value: 'zh-HK' },
];

const options2 = [
  { name: '模糊匹配', value: 'FM' },
  { name: '精准匹配', value: 'PM' },
];

const DebugI18n = observer(function DebugI18n_(props: IProps) {
  const root = useStore();
  const { logic } = root;

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    logic.search2();
  }, []);

  return (
    <div>
      <Button onClick={props.toTrans}>
        返回翻译模式
      </Button>
      <div className='flex mt-8'>
        <span>文本：</span>
        <InputText
          placeholder='请输入'
          value={logic.cnString}
          onChange={logic.changeCnString}
          onKeyDown={onKeyDown}
        />
        <span className='ml-8'>文本类型：</span>
        <SelectButton
          optionLabel='name'
          options={options}
          value={logic.stringType}
          onChange={(e) => {
            logic.changeStringType(e.value);
          }}
        />
        <SelectButton
          className='ml-8'
          optionLabel='name'
          options={options2}
          value={logic.matchType}
          onChange={(e) => {
            logic.changeMatchType(e.value);
          }}
        />

        <Button onClick={logic.loadResource} className='ml-24'>
          重载数据源
        </Button>
        <Button onClick={logic.search2} className='ml-24'>
          搜索
        </Button>
      </div>
      <div className='mt-24'>
        <div className='total'>共有{logic.result.length}项</div>
        <DataTable
          value={logic.result}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className='mt-8'
          // filters={{
          //   key: {
          //     value: null,
          //     matchMode: FilterMatchMode.CONTAINS,
          //   },
          //   full: {
          //     value: null,
          //     matchMode: FilterMatchMode.CONTAINS,
          //   },
          // }}
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
              if (!!path && !path.includes('.')) {
                path += '.';
              }
              const str = `${record.path?.[0]}:${path}${record.key}`;

              return <span className='ml-8' onDoubleClick={() => CopyToClipboard(str)}>{str}</span>;
            }}
          >
          </Column>
          <Column field='full' header='完整文本' filter filterPlaceholder='请输入' style={{ width: '40%' }}></Column>
        </DataTable>
      </div>
    </div>
  );
});

export default observer((props: IProps) => (
  <Provider>
    <DebugI18n {...props} />
  </Provider>
));
