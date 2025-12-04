import type { Todo } from '../types';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  return (
    <li className={styles.todoItem}>
      <span className={styles.title} onClick={() => onDelete(todo.id)}>
        {todo.title}
      </span>
      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(todo)}
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

