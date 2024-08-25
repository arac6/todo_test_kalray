import React from "react";

interface TodoItem {
  id: number;
  content: string;
  done: boolean;
  done_time: string | null;
}

interface TodoItemRowProps {
  todo: TodoItem;
  onToggleDone: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: TodoItem) => void;
}

const TodoItemRow: React.FC<TodoItemRowProps> = ({ todo, onToggleDone, onDelete, onEdit }) => {
  return (
    <tr>
      <td>{todo.id}</td>
      <td style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.content}
      </td>
      <td>{todo.done ? "Done" : "Pending"}</td>
      <td>{todo.done_time ? new Date(todo.done_time).toLocaleString() : "N/A"}</td>
      <td>
        <button
          className={`${todo.done ? "undone-button" : "done-button"}`}
          onClick={() => onToggleDone(todo.id)}
        >
          {todo.done ? "Undo" : "Done"}
        </button>
        <button className="edit-button" onClick={() => onEdit(todo)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(todo.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default TodoItemRow;
