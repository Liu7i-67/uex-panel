import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';

const div = document.createElement('div');
document.body.appendChild(div);

const Message = (props: ToastMessage) => {
  const toast = useRef<Toast>(null);
  useEffect(() => {
    if (!toast.current) {
      return;
    }
    toast.current.show(props);
  }, [toast.current]);
  return <Toast ref={toast} />;
};

const root = createRoot(div);

function notice(props: ToastMessage) {
  return root.render(<Message {...(props || {})} />);
}

export const mes = (props: ToastMessage) => notice(props);

export const message = {
  error: (data: string) =>
    mes({
      severity: 'error',
      summary: 'error',
      detail: data,
      life: 1000,
    }),
  success: (data: string) =>
    mes({
      severity: 'success',
      summary: 'success',
      detail: data,
      life: 1000,
    }),
  warn: (data: string) =>
    mes({
      severity: 'warn',
      summary: 'warn',
      detail: data,
      life: 1000,
    }),
  info: (data: string) =>
    mes({
      severity: 'info',
      summary: 'info',
      detail: data,
      life: 1000,
    }),
};
