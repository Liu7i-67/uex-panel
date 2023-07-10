import { observer } from '@quarkunlimit/qu-mobx';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useStore } from '../store/RootStore';
import React from 'react';
import { EType, IRow } from '../store/RootStore/interface';
import { fakerList, typeList } from '../tool';
import { Button } from 'primereact/button';

interface IProps {
  pNode: IRow;
  rows: IRow[];
  style?: React.CSSProperties;
}

export const ChildContent = observer(function ChildContent_(props: IProps) {
  const root = useStore();
  const { logic } = root;
  const { rows, style, pNode } = props;

  return (
    <div className='children-box' style={style}>
      {rows.map((r) => {
        return (
          <div key={r.id} className='mb-8'>
            <div className='row-item'>
              <InputText
                tooltip='字段名'
                value={r.label}
                onChange={(e) => {
                  logic.changeName(r, e.target.value);
                }}
              />
              {r.type == EType.SIMPLE && (
                <Dropdown
                  onChange={(e) => {
                    logic.changeFakerValue(r, e.value);
                  }}
                  value={r.fakerValue}
                  options={fakerList}
                  optionLabel='label'
                  optionValue='value'
                  className='ml-4'
                  placeholder='字段内容'
                  tooltip='用于调用fakerjs生成数据'
                  filter
                />
              )}
              {r.type == EType.ARRAY && (
                <InputNumber
                  value={r.count}
                  className='ml-4'
                  tooltip='需要生成的数据条数'
                  onChange={(e) => {
                    logic.changeCount(r, e.value);
                  }}
                />
              )}
              <Dropdown
                onChange={(e) => {
                  logic.changeType(r, e.value);
                }}
                value={r.type}
                options={typeList}
                optionLabel='label'
                optionValue='value'
                className='ml-4'
                placeholder='请选择类型'
                tooltip='字段的类型'
              />
              <Button
                size='small'
                className='ml-8'
                severity='danger'
                onClick={() => logic.removeRow(pNode, r)}
                tooltip='删除'
              >
                -
              </Button>
              {r.type !== EType.SIMPLE && (
                <Button
                  size='small'
                  className='ml-8'
                  onClick={() => logic.addRow(r)}
                  tooltip='新增'
                >
                  +
                </Button>
              )}
            </div>
            {!!r.children.length && <ChildContent rows={r.children} pNode={r} />}
          </div>
        );
      })}
    </div>
  );
});
