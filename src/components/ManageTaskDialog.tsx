import { FaTimes } from 'react-icons/fa';
import TodoForm from './TodoForm';
import type { Todo, Attachment, Subtask } from '../types';
import styles from './ManageTaskDialog.module.css';

type ManageMode = 'create' | 'edit';

interface ManageTaskDialogProps {
  mode: ManageMode;
  isOpen: boolean;
  todo: Todo | null;
  initialFiles?: File[];
  onClose: () => void;
  onAutoSave?: (id: string | null, title: string, attachments: (File | Attachment)[], subtasks: Subtask[]) => void;
}

export default function ManageTaskDialog({
  mode,
  isOpen,
  todo,
  initialFiles = [],
  onClose,
  onAutoSave,
}: ManageTaskDialogProps) {
  const isEdit = mode === 'edit';

  if (!isOpen) return null;
  if (isEdit && !todo) return null;

  const titleText = isEdit ? 'Task Details' : 'Create Task';
  const primaryText = 'Done';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <dialog
        open={isOpen}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        aria-label="Manage task dialog"
      >
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.dialogTitle}>{titleText}</h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.body}>
          <TodoForm
            mode={isEdit ? 'edit' : 'create'}
            onAutoSave={
              onAutoSave
                ? (title, allAttachments, allSubtasks) => {
                    onAutoSave(isEdit && todo ? todo.id : null, title, allAttachments, allSubtasks);
                  }
                : undefined
            }
            initialTitle={isEdit && todo ? todo.title : ''}
            initialFiles={!isEdit ? initialFiles : []}
            initialAttachments={isEdit && todo ? todo.attachments : []}
            initialSubtasks={isEdit && todo ? todo.subtasks : []}
            onDone={onClose}
            primaryLabel={primaryText}
          />
        </div>
      </dialog>
    </div>
  );
}


