import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";

type ToastContextType = {
  toasts: Toast[];
  addToast: (text: string, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
};

type Toast = {
  id: string;
  text: string;
  options: ToastOptions;
};
type ToastOptions = {
  autoDismiss: boolean;
  autoDismissTimeout: number;
  position: string;
};

export const ToastContext = createContext<ToastContextType | null>(null);

const DEFAULT_OPTIONS: ToastOptions = {
  autoDismiss: true,
  autoDismissTimeout: 4000,
  position: "top-center",
};

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(text: string, userOptions?: ToastOptions) {
    const options = { ...DEFAULT_OPTIONS, ...userOptions };
    const id = crypto.randomUUID();
    setToasts((currentToasts) => [...currentToasts, { id, text, options }]);

    if (options.autoDismiss) {
      setTimeout(() => removeToast(id), options.autoDismissTimeout);
    }
  }

  function removeToast(id: string) {
    setToasts((currentToasts) => {
      return currentToasts.filter((toast) => toast.id !== id);
    });
  }
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {createPortal(
        toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-container ${toast.options.position}`}
          >
            <Toast text={toast.text} remove={() => removeToast(toast.id)} />
          </div>
        )),
        document.getElementById("toast-container") as HTMLDivElement
      )}
    </ToastContext.Provider>
  );
}
