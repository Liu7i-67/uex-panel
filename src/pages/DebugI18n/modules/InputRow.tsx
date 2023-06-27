import React from 'react';
import { useStore } from '../store/RootStore';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { observer } from '@quarkunlimit/qu-mobx';
import { SelectButton } from 'primereact/selectbutton';

const options = [
  { name: 'zh-CN', value: 'zh-CN' },
  { name: 'zh-TW', value: 'zh-TW' },
  { name: 'zh-HK', value: 'zh-HK' },
];

const options2 = [
  { name: '模糊匹配', value: 'FM' },
  { name: '精准匹配', value: 'PM' },
];

const options3 = [
  { name: '查找Key', value: 'key' },
  { name: '查找文本', value: 'text' },
];

export const InputRow = observer(function InputRow_() {
  const root = useStore();
  const { logic } = root;

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    logic.search();
  }, []);

  return (
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
      <SelectButton
        className='ml-8'
        optionLabel='name'
        options={options3}
        value={logic.matchTarget}
        onChange={(e) => {
          logic.changeMatchTarget(e.value);
        }}
      />

      <Button onClick={logic.loadResource} className='ml-24'>
        重载数据源
      </Button>
      <Button onClick={logic.search} className='ml-24'>
        搜索
      </Button>
    </div>
  );
});
