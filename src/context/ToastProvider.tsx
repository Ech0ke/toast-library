import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";

type ToastContextType = {
  toasts: Toast[];
  addToast: (text: string, options?: Partial<ToastOptions>) => string;
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
  console.log(toasts);

  function addToast(text: string, userOptions: Partial<ToastOptions> = {}) {
    const options = { ...DEFAULT_OPTIONS, ...userOptions };
    const id = crypto.randomUUID();
    setToasts((currentToasts) => [...currentToasts, { id, text, options }]);

    if (options.autoDismiss) {
      setTimeout(() => removeToast(id), options.autoDismissTimeout);
    }

    return id;
  }

  function removeToast(id: string) {
    setToasts((currentToasts) => {
      return currentToasts.filter((toast) => toast.id !== id);
    });
  }

  const toastsByPosition = useMemo(() => {
    return toasts.reduce((grouped, toast) => {
      const { position } = toast.options;
      if (grouped[position] == null) {
        grouped[position] = [];
      }
      grouped[position].push(toast);

      return grouped;
    }, {} as Record<string, Toast[]>);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {createPortal(
        Object.entries(toastsByPosition).map(([position, toasts]) => (
          <div key={position} className={`toast-container ${position}`}>
            {toasts.map((toast) => (
              <Toast
                remove={() => removeToast(toast.id)}
                text={toast.text}
                key={toast.id}
              />
            ))}
          </div>
        )),
        document.getElementById("toast-container") as HTMLDivElement
      )}
    </ToastContext.Provider>
  );
}
