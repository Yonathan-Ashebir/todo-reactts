import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './DeleteConfirmDialog.module.css';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <FaExclamationTriangle className={styles.icon} />
        </div>
        <h2 className={styles.title}>Delete Task?</h2>
        <p className={styles.message}>
          Are you sure you want to delete <strong>"{taskTitle}"</strong>? This action cannot be
          undone.
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

