import React, { Suspense, useEffect } from 'react';
import { observer } from '@quarkunlimit/qu-mobx';
import { Provider, useStore } from './store/RootStore';
import { OtherSettingDrawer } from './modules/OtherSettingDrawer';
import { ToolBar } from './modules/ToolBar';
import { I18JSON } from './modules/I18JSON';
import { classNames } from 'utils/Tools';
import * as formatterWorker from 'utils/FormatterWorker';
import './index.scss';

const DebugI18n = React.lazy(() => import('../DebugI18n'));

const UpdateContentModal = React.lazy(
  () => import('./modules/UpdateContentModal'),
);

const ColumnsI18next = observer(function ColumnsI18next_() {
  const root = useStore();
  const { logic } = root;

  useEffect(() => {
    logic.initShowUpdate();
  }, []);

  // 挂载事件
  useEffect(() => {
    formatterWorker.addOnFormat(logic.onFormat);
    formatterWorker.addOnError(logic.onError);

    return () => {
      formatterWorker.removeOnError(logic.onError);
      formatterWorker.removeOnFormat(logic.onFormat);
    };
  }, []);

  // 加载wasm
  useEffect(() => {
    if (logic.pluginUrl == null) {
      return;
    }
    formatterWorker.loadUrl(logic.pluginUrl);
    formatterWorker.setConfig({
      lineWidth: 120,
      indentWidth: 2,
      quoteStyle: 'alwaysSingle',
      'arrowFunction.useParentheses': 'force',
      'jsx.quoteStyle': 'preferSingle',
      'module.sortImportDeclarations': 'maintain',
    });
  }, [logic.pluginUrl]);

  useEffect(() => {
    if (!logic.formData.cleanStr) {
      return;
    }
    logic.formatColumns();
  }, [logic.formData.cleanStr]);

  return (
    <div className='page-ColumnsI18next'>
      <Suspense fallback='loading'>{logic.debugMode && <DebugI18n toTrans={logic.changeDebugMode} />}</Suspense>
      <div className={classNames({ hidden: logic.debugMode })}>
        <ToolBar />
        <OtherSettingDrawer />
        <Suspense fallback='loading'>
          <UpdateContentModal />
        </Suspense>
        <div className='mt-8'>
          tips: 双击即可复制
          <a
            href='https://f1ufsuw9mx.feishu.cn/docx/JvgJd9EbPoMpTpx4EJEc9gRanvf'
            className='ml-20'
            target='blank'
          >
            帮助文档
          </a>
          <span
            className='ml-8 update-mark'
            onClick={logic.changeUpdateVisible}
          >
            更新公告
          </span>
        </div>
        <I18JSON />
        <div
          className='out-put'
          onDoubleClick={() => logic.copyOutPut('replace')}
        >
          {logic.output.replace}
        </div>
      </div>
    </div>
  );
});

export default observer(function ColumnsI18nextPage() {
  return (
    <Provider>
      <ColumnsI18next />
    </Provider>
  );
});

export * from './interface';
