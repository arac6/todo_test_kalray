import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

import "./TodoTable.sass";
import Pagination from "../Pagination/Pagination";
import AddTodoModal from "../AddTodoModal/AddTodoModal";
import service from "../../../../services/appService";
import TodoTableControls from "./TodoTableControls";
import TodoTableHeader from "./TodoTableHeader";
import TodoItemRow from "./TodoItemRow";

interface TodoItem {
  id: number;
  content: string;
  done: boolean;
  done_time: string | null;
}

const TodoTable: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // const >> infinite scroll
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 10;  // initial >> 10

  useEffect(() => {
    service.getToDoList().then(response => {
      setTodos(response.data);
      setFilteredTodos(response.data);
    }).catch(error => {
      console.error("Failed to fetch todo list:", error);
    });
  }, []);

  useEffect(() => {
    applyFilterAndSort();
  }, [todos, filter, sortBy, sortOrder]);

  // handle >> scroll event
  useEffect(() => {
    if (infiniteScrollEnabled && scrollRef.current) {
      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          if ((scrollTop + clientHeight >= scrollHeight - 10 && !loadingMore) && !filter) {
            setLoadingMore(true);
            loadMoreItems();
          }
        }
      };
  
      scrollRef.current.addEventListener("scroll", handleScroll);
      return () => scrollRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, [infiniteScrollEnabled, loadingMore]); // filteredTodos

  // scroll down >> load items
  const loadMoreItems = useCallback(() => {
    const nextPage = currentPage + 1;
    const nextItems = todos.slice(filteredTodos.length, nextPage * itemsPerPage);

    if (nextItems.length === 0) {
        setLoadingMore(false);
        return;
      }

    setTimeout(() => {
      setFilteredTodos(prevTodos => {
        const newTodos = todos.slice(prevTodos.length, nextPage * itemsPerPage);
        return [...prevTodos, ...newTodos]
      });
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 1500);
  }, [currentPage, filteredTodos.length, todos]);

  const toggleInfiniteScroll = () => {
    setInfiniteScrollEnabled(prev => !prev);
    setCurrentPage(1);
    if (!infiniteScrollEnabled) {
      setFilteredTodos(todos.slice(0, itemsPerPage));
    } else {
      applyFilterAndSort();
    }
  };

  const applyFilterAndSort = useCallback(() => {
    let updatedTodos = [...todos];

    // apply >> filter
    if (filter) {
      updatedTodos = updatedTodos.filter(todo =>
        todo.content.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // apply >> sort
    updatedTodos.sort((a, b) => {
      if (sortBy === "done") {  // column >> done
        return sortOrder === "asc"
          ? Number(a.done) - Number(b.done)
          : Number(b.done) - Number(a.done);
      } else if (sortBy === "done_time") {  // column >> date_time
        if (a.done_time === null) return sortOrder === "asc" ? -1 : 1;
        if (b.done_time === null) return sortOrder === "asc" ? 1 : -1;
        return sortOrder === "asc"
          ? new Date(a.done_time).getTime() - new Date(b.done_time).getTime()
          : new Date(b.done_time).getTime() - new Date(a.done_time).getTime();
      } else if (sortBy === 'content') {
        return sortOrder === "asc"
          ? a.content.localeCompare(b.content)
          : b.content.localeCompare(a.content);
      } else {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
    });

    setFilteredTodos(updatedTodos);
  }, [todos, filter, sortBy, sortOrder]);

  // feat >> sort by column
  const handleSort = useCallback((column: string): void => {
    if (sortBy === column) {
      setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }, [sortBy]);

  // feat >> filter
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(e.target.value);
    setCurrentPage(1);

    if (infiniteScrollEnabled) {
        setLoadingMore(false);
    }
  }, [infiniteScrollEnabled]);
  
  // feat >> mark as done
  const handleToggleDone = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            done: !todo.done,
            done_time: todo.done ? null : new Date().toISOString()  // set >> done_time
          }
        : todo
    );
    setTodos(updatedTodos);
  };

  // feat >> delete
  const handleDelete = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    applyFilterAndSort();
  };

  // feat >> add / edit
  const handleAddTodo = (newTodo: TodoItem) => {
    if (editingTodo) {   // task >> edit
      const updatedTodos = todos.map(todo => (todo.id === newTodo.id ? newTodo : todo));
      setTodos(updatedTodos);
    } else {    // task >> add
      setTodos(prevTodos => [...prevTodos, newTodo]);
    }
    setIsModalOpen(false);
    setEditingTodo(null)
  };

  const handleOpenModal = (todo?: TodoItem) => {
    setEditingTodo(todo || null);
    setIsModalOpen(true);
  };

  const currentTodos = useMemo(
    () => (infiniteScrollEnabled ? filteredTodos : filteredTodos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )), [infiniteScrollEnabled, filteredTodos, currentPage, itemsPerPage]
  );
  const maxId = useMemo(
    () => todos.length > 0 ? todos.reduce((max, obj) => (obj.id > max ? obj.id : max), todos[0].id) : 0,
    [todos]
  );

  return (
    <div className="todo-table">
      <TodoTableControls
        onAddTask={() => handleOpenModal()}
        filter={filter}
        onFilterChange={handleFilterChange}
        onToggleScroll={toggleInfiniteScroll}
        infiniteScrollEnabled={infiniteScrollEnabled}
      />
      
      <div ref={scrollRef} className="scroll-container">
        <table>
            <TodoTableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
            <tbody>
                {currentTodos.map(todo => (
                    <TodoItemRow
                        key={todo.id}
                        todo={todo}
                        onToggleDone={handleToggleDone}
                        onDelete={handleDelete}
                        onEdit={handleOpenModal}
                    />
                ))}
            </tbody>
        </table>

        {loadingMore && <div className="loading">Loading more items...</div>}
      </div>

      {!infiniteScrollEnabled && (
        <Pagination
            totalItems={filteredTodos.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
        />
      )}
      
      <AddTodoModal
        lastNo={maxId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTodo}
        existingTodo={editingTodo}
      />
    </div>
  );
};

export default TodoTable;
