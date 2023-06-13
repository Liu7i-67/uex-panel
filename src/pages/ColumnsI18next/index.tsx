import React, { Suspense, useEffect } from 'react';
import { observer } from '@quarkunlimit/qu-mobx';
import { Provider, useStore } from './store/RootStore';
import { OtherSettingDrawer } from './modules/OtherSettingDrawer';
import { ToolBar } from './modules/ToolBar';
import { I18JSON } from './modules/I18JSON';
import { classNames } from 'utils/Tools';
import * as formatterWorker from 'utils/FormatterWorker';
import { addLocale, locale } from 'primereact/api';
import './index.scss';

const DebugI18n = React.lazy(() => import('../DebugI18n'));

const UpdateContentModal = React.lazy(
  () => import('./modules/UpdateContentModal'),
);

const ColumnsI18next = observer(function ColumnsI18next_() {
  const root = useStore();
  const { logic } = root;

  // 挂载事件
  useEffect(() => {
    formatterWorker.addOnFormat(logic.onFormat);
    formatterWorker.addOnError(logic.onError);
    addLocale('zh-CN', {
      startsWith: '开始于',
      contains: '包含',
      notContains: '不包含',
      endsWith: '结束于',
      equals: '等于',
      notEquals: '不等于',
      noFilter: '不过滤',
      filter: '过滤',
      lt: '小于',
      lte: '小于等于',
      gt: '大于',
      gte: '大于等于',
      dateIs: '在指定日期',
      dateIsNot: '不在指定日期',
      dateBefore: '在指定日期之前',
      dateAfter: '在指定日期之后',
      custom: '自定义',
      clear: '清空',
      close: '关闭',
      apply: '应用',
      matchAll: '匹配所有',
      matchAny: '匹配任何',
      addRule: '新增规则',
      removeRule: '移除规则',
      accept: '确认',
      reject: '拒绝',
      choose: '选择',
      upload: '上传',
      cancel: '取消',
      dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
      today: '今天',
      weekHeader: 'Wk',
      firstDayOfWeek: 0,
      dateFormat: 'yy-mm-dd',
      weak: '弱',
      medium: '中等',
      strong: '强',
      passwordPrompt: '输入密码',
      emptyFilterMessage: '无可用选项',
      emptyMessage: '没有相关数据',
      aria: {
        trueLabel: '正确',
        falseLabel: '错误',
        nullLabel: '没有选择',
        pageLabel: '页',
        firstPageLabel: '第一页',
        lastPageLabel: '上一页',
        nextPageLabel: '下一页',
        previousPageLabel: 'Previous Page',
        selectLabel: '选择',
        unselectLabel: '未选择',
        expandLabel: '展开',
        collapseLabel: '收起',
      },
    });
    locale('zh-CN');

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
