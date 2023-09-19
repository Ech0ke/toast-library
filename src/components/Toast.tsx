type ToastProps = {
  text: string;
  remove: () => void;
};

function Toast({ text, remove }: ToastProps) {
  return (
    <div className="toast" onClick={remove}>
      {text}
    </div>
  );
}

export default Toast;
