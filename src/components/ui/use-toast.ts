import * as React from "react";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = ({
    title,
    description,
    action,
    variant = "default",
  }: Omit<ToastProps, "id">) => {
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: Math.random().toString(36).slice(2), title, description, action, variant },
    ]);
  };

  return {
    toast,
    toasts,
  };
}