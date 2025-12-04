import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Todo } from '../types';
import styles from './EditDialog.module.css';

interface EditDialogProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newTitle: string) => void;
}

export default function EditDialog({ todo, isOpen, onClose, onSave }: EditDialogProps) {
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (todo && isOpen) {
      setEditValue(todo.title);
    }
  }, [todo, isOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = editValue.trim();
    if (trimmedValue && todo) {
      onSave(todo.id, trimmedValue);
      onClose();
    }
  };

  const handleCancel = () => {
    setEditValue('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <dialog
        open={isOpen}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        aria-label="Edit task dialog"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="edit-input" className={styles.label}>
            Edit task
          </label>
          <input
            id="edit-input"
            type="text"
            className={styles.input}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} value="save">
              Save
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

