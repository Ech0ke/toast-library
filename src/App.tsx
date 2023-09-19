import { useRef, useState } from "react";
import { useToast } from "./context/useToast";

function App() {
  const { addToast, removeToast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string>();

  function createToast() {
    if (inputRef.current == null || inputRef.current.value === "") return;

    setId(
      addToast(inputRef.current.value, {
        autoDismiss: false,
        position: "bottom-left",
      })
    );
  }

  return (
    <div className="form">
      <input type="text" ref={inputRef} />
      <button onClick={createToast}>Add Toast</button>
      <button
        onClick={() => {
          if (id !== null && id !== undefined) {
            removeToast(id);
          }
        }}
      >
        Remove Last Toast
      </button>
    </div>
  );
}

export default App;
