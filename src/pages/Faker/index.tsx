import React from 'react';
import { observer } from '@quarkunlimit/qu-mobx';
import { Provider, useStore } from './store/RootStore';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import './index.scss';
import { EType } from './store/RootStore/interface';
import { ChildContent } from './modules/ChildContent';
import { SettingSidebar } from './modules/SettingSidebar';

interface IFakerProps {
}

const typeList = [
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

const Faker = observer(function Faker_(props: IFakerProps) {
  const root = useStore();
  const { logic } = root;

  return (
    <div className='page_faker'>
      <div className='tool_bar'>
        <Button size='small' onClick={logic.scanStr}>
          生成数据
        </Button>
        <InputText
          tooltip='当前设置的名称'
          value={logic.objName}
          className='ml-8'
          onChange={(e) => {
            logic.changeObjName(e.target.value);
          }}
        />
        <Button size='small' className='ml-8' onClick={logic.save}>
          保存当前设置
        </Button>
        <Button size='small' className='ml-8' onClick={logic.changeDrawer}>
          管理已有的配置
        </Button>
      </div>
      <div className='content'>
        <div>
          <InputNumber
            value={logic.obj.count}
            tooltip='需要生成的数据条数'
            onChange={(e) => {
              logic.changeCount(logic.obj, e.value);
            }}
          />
          <Button size='small' className='ml-8' onClick={() => logic.addRow(logic.obj)}>
            +child
          </Button>
        </div>
        <ChildContent rows={logic.obj.children} pNode={logic.obj} />
        <SettingSidebar />
      </div>
    </div>
  );
});

export default observer(function FakerPage(props: IFakerProps) {
  return (
    <Provider>
      <Faker {...props} />
    </Provider>
  );
});
