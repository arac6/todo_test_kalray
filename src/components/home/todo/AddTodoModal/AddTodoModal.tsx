import React, { useState, useEffect } from "react";

import "./AddTodoModal.sass";

interface TodoItem {
    id: number;
    content: string;
    done: boolean;
    done_time: string | null;
}
  
interface AddTodoModalProps {
    lastNo: number;
    isOpen: boolean;
    onClose: () => void;
    onSave: (todo: TodoItem) => void;
    existingTodo: TodoItem | null;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ lastNo, isOpen, onClose, onSave, existingTodo }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (existingTodo) {
      setContent(existingTodo.content || "");
    } else {
      setContent("");
    }
  }, [existingTodo]);

  const handleSave = (): void => {
    if (content.trim()) {
      onSave({
        id: existingTodo ? existingTodo.id : lastNo + 1,
        content,
        done: existingTodo?.done ?? false,
        done_time: existingTodo?.done_time ?? null,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{existingTodo ? "Update Task" : "Add New Task"}</h2>
        <input
          type="text"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          placeholder="Enter task content"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <div className="modal-actions">
          <button onClick={handleSave}>{existingTodo ? "Update" : "Add"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
