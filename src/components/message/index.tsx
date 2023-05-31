import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
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

const root = createRoot(div);

function notice(props: ToastMessage) {
  return root.render(<Message {...(props || {})} />);
}

export const message = (props: ToastMessage) => notice(props);
