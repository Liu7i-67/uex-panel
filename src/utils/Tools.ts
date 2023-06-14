import { message } from '@/components/message';

export interface IItem {
  [key: string]: boolean;
}

export type TItem = string | IItem | number | undefined;

export const classNames = (...args: TItem[]) => {
  const nameArr: string[] = [];
  args?.forEach?.((i: string) => {
    if (['string', 'number'].includes(typeof i)) {
      nameArr.push(`${i}`);
    } else if (typeof i === 'object' && i !== null) {
      Object.keys(i)?.forEach?.((j) => {
        // @ts-ignore
        if (i[j]) {
          nameArr.push(`${j}`);
        }
      });
    }
  });

  return nameArr.join(' ');
};

/** @function 复制内容到剪切板 */
export const CopyToClipboard = (val: string) => {
  // @ts-ignore
  if (typeof navigator?.clipboard?.writeText !== 'undefined') {
    // @ts-ignore
    navigator.clipboard.writeText(val).then(
      function() {
        message({
          severity: 'success',
          summary: 'Success',
          detail: '复制成功~',
          life: 3000,
        });
      },
      // @ts-ignore
      function(e) {
        message({
          severity: 'error',
          summary: 'Error',
          detail: '复制成功~',
          life: 3000,
        });
      },
    );
    return;
  }
  // 1 手动创建可编辑元素，比如textarea，
  var textArea = document.createElement('textarea');
  // 2 然后将要拷贝的值设置为它的Value
  textArea.value = val;
  // 将textarea插入页面
  document.body.appendChild(textArea);
  // 调用textarea的 select() 方法将值选中
  textArea.select();
  // 3 textarea要设置样式为不可见(使用样式将其移出可视区域即可)
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  // 4 调用document.execCommand('copy')
  document.execCommand('copy'); // 复制
  document.body.removeChild(textArea);
  message({
    severity: 'success',
    summary: 'Success',
    detail: '复制成功~',
    life: 3000,
  });
};

/**
 * json数据转换
 * @param data json字符串
 * @returns [any]
 */
export function getJSONToParse(data: string) {
  let resData = null;
  try {
    resData = JSON.parse(data);
  } catch (error) {}
  return resData;
}
