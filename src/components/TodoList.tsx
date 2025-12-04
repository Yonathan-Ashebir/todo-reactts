import type { Todo } from '../types';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
}

export default function TodoList({
  todos,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleSubtask,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <p className={styles.emptyText}>No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  return (
    <ul className={styles.todoList} aria-live="polite" aria-label="Todo items list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onToggleSubtask={onToggleSubtask}
        />
      ))}
    </ul>
  );
}
