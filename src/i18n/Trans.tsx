import i18next, { CustomTypeOptions } from 'i18next';
import { observer } from '@quarkunlimit/qu-mobx';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { subscribe, unsubscribe } from './index';

type check<P, D> = D extends TMax ? '' extends P ? ':' : ''
  : '' extends P ? ''
  : '.';

type Join<K, P, D> = K extends string | number
  ? P extends string | number ? `${K}${D extends TMax ? ':' : ''}${check<P, D>}${P}`
  : never
  : never;

type Paths<T, D extends number = 20> = [D] extends [never] ? never
  : T extends object ? {
    [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>, D>
      : never;
  }[keyof T]
  : '';
type TMax = 20;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];
export type NestedObjectPaths = Paths<CustomTypeOptions['resources']>;
interface IProps {
  i18Key: NestedObjectPaths;
  children: (val: any) => React.ReactNode;

  options?: object;
}
export const isGodModel = window.sessionStorage.getItem('__god_model__') === 'whoisyourdaddy';
export function t(key: any, options?: { returnObjects?: boolean; [x: string]: any }): any {
  // @ts-ignore
  const _v = i18next.t(key, options);

  if (typeof _v === 'string') {
    return isGodModel ? `{{${key}}}` + _v : _v;
  }
  return _v;
}
export function Trans(props: IProps) {
  const { t } = useTranslation();
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const { i18Key, options } = props;
  // @ts-ignore
  const _v = t(props.i18Key, { ...(options ?? {}) });
  const v = isGodModel ? `{{${i18Key}}}` + _v : _v;
  if (props.i18Key.includes(_v)) {
    subscribe('load', forceUpdate);
  } else {
    unsubscribe('load', forceUpdate);
  }
  return (
    <>
      <span data-i18={i18Key} style={{ display: 'none' }}></span>
      {props.children(v)}
    </>
  );
}

/**
 * <Trans i18Key="flow:title">{v=>v}</Trans>
 */
