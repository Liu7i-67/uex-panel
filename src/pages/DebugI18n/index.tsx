import React from 'react';
import { Provider, useStore } from './store/RootStore';
import { observer } from '@quarkunlimit/qu-mobx';
import { Button } from 'primereact/button';
import { InputRow } from './modules/InputRow';
import { DataView } from './modules/DataView';
import { InputText } from 'primereact/inputtext';
import { baseUrl } from '@/../config/variable';
import { changeLocale, t, Trans } from '@/i18n';

interface IProps {
  /** @function 去翻译 */
  toTrans: () => void;
}

const DebugI18n = observer(function DebugI18n_(props: IProps) {
  const root = useStore();
  const { logic } = root;

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    logic.saveDiyUrl();
  }, []);

  return (
    <div>
      <Button onClick={props.toTrans}>
        返回翻译模式{t('applicationManage:other.key14')}
      </Button>
      {logic.showCustom && (
        <InputText
          placeholder='请输入'
          value={logic.diyUrl}
          onChange={logic.changeDiyUrl}
          onBlur={logic.saveDiyUrl}
          onKeyDown={onKeyDown}
          className='url-input'
          size={40}
          tooltip={`示例：${baseUrl}zh-CN.json  设置后该参数将覆盖文本类型对应的数据源`}
        />
      )}
      <Button onClick={logic.changeShowCustom} className='ml-8'>
        设置自定义数据源
      </Button>
      <InputRow />
      <DataView />
    </div>
  );
});

export default observer((props: IProps) => (
  <Provider>
    <DebugI18n {...props} />
  </Provider>
));
