import React, { Suspense, useEffect } from 'react';
import { observer } from '@quarkunlimit/qu-mobx';
import { Provider, useStore } from './store/RootStore';
import { OtherSettingDrawer } from './modules/OtherSettingDrawer';
import { ToolBar } from './modules/ToolBar';
import { I18JSON } from './modules/I18JSON';
import { classNames } from 'utils/Tools';
import { Button } from 'primereact/button';
import * as formatterWorker from 'utils/FormatterWorker';
import { changeLocale, t, Trans } from '@/i18n';
import './index.scss';
import i18next from 'i18next';
import { publish } from '@/i18n';

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

  // 挂载事件2
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
        <div>
          <div>{t('applicationManage:other.key14')}</div>
          <Trans i18Key='applicationManage:other.key14'>{(v) => v}</Trans> <br />
          <Trans i18Key='applicationManage:other.key13'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='applicationManage:other.key12'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='applicationManage:other.key11'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='applicationManage:other.key10'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='applicationManage:other.key9'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='applicationManage:other.key8'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='applicationManage:other.key7'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='appointRecord:bespeakStatus.0'>{(v) => v}</Trans>
          <br />
          <Trans i18Key='appointRecord:bespeakStatus.all'>{(v) => v}</Trans>
          <br />
          <div>
            <Button className='mr-8' onClick={() => changeLocale('zh-CN')}>zh-CN</Button>
            <Button className='mr-8' onClick={() => changeLocale('zh-TW')}>zh-TW</Button>
            <Button onClick={() => changeLocale('zh-HK')}>zh-HK</Button>
          </div>
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
