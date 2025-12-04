import { forwardRef } from 'react';
import { FaTrash, FaCheck, FaImage, FaFile, FaCalendarAlt } from 'react-icons/fa';
import type { Todo } from '../types';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  isSelected?: boolean;
}

const TodoItem = forwardRef<HTMLLIElement, TodoItemProps>(function TodoItem(
  {
    todo,
    onEdit,
    onDelete,
    onToggleComplete,
    onToggleSubtask,
    isSelected = false,
  },
  ref
) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = todo.subtasks.length;

  return (
    <li
      ref={ref}
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={() => onEdit(todo)}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <button
              className={styles.checkbox}
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(todo.id);
              }}
              aria-label={todo.completed ? 'Mark as pending' : 'Mark as complete'}
            >
              {todo.completed && <FaCheck />}
            </button>
            <h3 className={`${styles.title} ${todo.completed ? styles.titleCompleted : ''}`}>
              {todo.title}
            </h3>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }}
              aria-label="Delete task"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <FaCalendarAlt className={styles.metaIcon} />
            <span className={styles.metaText}>{formatDate(todo.createdAt)}</span>
          </div>

          {todo.attachments.length > 0 && (
            <div className={styles.metaItem}>
              {todo.attachments.some((a) => a.type === 'image') ? (
                <FaImage className={styles.metaIcon} />
              ) : (
                <FaFile className={styles.metaIcon} />
              )}
              <span className={styles.metaText}>
                {todo.attachments.length} attachment{todo.attachments.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className={styles.metaItem}>
              <span className={styles.metaText}>
                {completedSubtasks}/{totalSubtasks} subtasks
              </span>
            </div>
          )}
        </div>

        {todo.attachments.length > 0 && (
          <div className={styles.attachments}>
            {todo.attachments.map((attachment) => (
              <div key={attachment.id} className={styles.attachment}>
                {attachment.type === 'image' ? (
                  <FaImage className={styles.attachmentIcon} />
                ) : (
                  <FaFile className={styles.attachmentIcon} />
                )}
                <span className={styles.attachmentName}>{attachment.name}</span>
              </div>
            ))}
          </div>
        )}

        {todo.subtasks.length > 0 && (
          <ul className={styles.subtasks}>
            {todo.subtasks.map((subtask) => (
              <li
                key={subtask.id}
                className={`${styles.subtask} ${subtask.completed ? styles.subtaskCompleted : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSubtask(todo.id, subtask.id);
                }}
              >
                <span className={styles.subtaskBullet}>•</span>
                <span className={styles.subtaskText}>{subtask.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
});

export default TodoItem;
