import React from "react";

interface TodoTableControlsProps {
  onAddTask: () => void;
  filter: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleScroll: () => void;
  infiniteScrollEnabled: boolean;
}

const TodoTableControls: React.FC<TodoTableControlsProps> = ({
  onAddTask,
  filter,
  onFilterChange,
  onToggleScroll,
  infiniteScrollEnabled,
}) => {
  return (
    <div className="todo-table-controls">
      <button className="add-button" onClick={onAddTask}>+ Add New Task</button>
      
      <input
        type="text"
        placeholder="Filter tasks..."
        value={filter}
        onChange={onFilterChange}
      />
      
      <button className={`${!infiniteScrollEnabled ? "toggle-scroll-button" : "toggle-pagination-button"}`} onClick={onToggleScroll}>
        {infiniteScrollEnabled ? "Switch to Pagination" : "Switch to Infinite Scroll"}
      </button>
    </div>
  );
};

export default TodoTableControls;
