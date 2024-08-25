import React from "react";

interface TodoTableHeaderProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

const TodoTableHeader: React.FC<TodoTableHeaderProps> = ({ sortBy, sortOrder, onSort }) => {
  const renderSortIndicator = (column: string) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return null;
  };

  return (
    <thead>
      <tr>
        <th onClick={() => onSort("id")}>ID {renderSortIndicator("id")}</th>
        <th onClick={() => onSort("content")}>Content {renderSortIndicator("content")}</th>
        <th onClick={() => onSort("done")}>Status {renderSortIndicator("done")}</th>
        <th onClick={() => onSort("done_time")}>Done Time {renderSortIndicator("done_time")}</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default TodoTableHeader;
