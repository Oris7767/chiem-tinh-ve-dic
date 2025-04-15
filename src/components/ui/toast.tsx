import * as React from "react";

const Toast = () => {
  return <div>Toast Placeholder</div>;
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const ToastViewport = () => {
  return <div />;
};

const ToastTitle = () => {
  return <h5 />;
};

const ToastDescription = () => {
  return <p />;
};

const ToastClose = () => {
  return <button />;
};

const ToastAction = () => {
  return <button />;
};

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};