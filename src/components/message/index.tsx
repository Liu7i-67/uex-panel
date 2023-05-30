import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Toast } from "primereact/toast";
import type { ToastMessage } from "primereact/toast";

const div = document.createElement("div");
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

function notice(props: ToastMessage) {
  return ReactDOM.render(<Message {...(props || {})} />, div);
}

export const message = (props: ToastMessage) => notice(props);
