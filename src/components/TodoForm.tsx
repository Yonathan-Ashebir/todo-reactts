import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  FaPlus,
  FaPaperclip,
  FaTimes,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileImage,
  FaFile,
} from 'react-icons/fa';
import type { Attachment, Subtask } from '../types';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAutoSave?: (title: string, attachments: (File | Attachment)[], subtasks: Subtask[]) => void;
  initialTitle?: string;
  initialFiles?: File[];
  initialAttachments?: Attachment[];
  initialSubtasks?: Subtask[];
  onDone?: () => void;
  primaryLabel?: string;
  mode?: 'create' | 'edit';
}

interface LocalAttachment {
  id: string;
  file: File;
  url: string;
}

type UnifiedAttachment = LocalAttachment | { id: string; attachment: Attachment };

interface PreviewState {
  url: string;
  name: string;
}

export default function TodoForm({
  onAutoSave,
  initialTitle = '',
  initialFiles = [],
  initialAttachments = [],
  initialSubtasks = [],
  onDone,
  primaryLabel,
  mode = 'create',
}: TodoFormProps) {
  const isEdit = mode === 'edit';
  const [inputValue, setInputValue] = useState(initialTitle);
  const [attachments, setAttachments] = useState<UnifiedAttachment[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    isEdit && initialSubtasks.length > 0
      ? initialSubtasks
      : [{ id: crypto.randomUUID(), text: '', completed: false }]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const label = (typeof primaryLabel === 'string' && primaryLabel.length > 0)
    ? primaryLabel
    : 'Done';

  useEffect(() => {
    setInputValue(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (!textAreaRef.current) return;
    const el = textAreaRef.current;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  useEffect(() => {
    if (isEdit && initialAttachments.length > 0) {
      setAttachments(
        initialAttachments.map((att) => ({
          id: att.id,
          attachment: att,
        }))
      );
    } else if (initialFiles.length > 0) {
      addFiles(initialFiles);
    }
  }, [initialFiles, initialAttachments, isEdit]);

  useEffect(() => {
    if (isEdit && initialSubtasks.length > 0) {
      setSubtasks(initialSubtasks);
    }
  }, [initialSubtasks, isEdit]);

  useEffect(
    () => () => {
      // cleanup on unmount - only revoke URLs for File-based attachments
      attachments.forEach((att) => {
        if ('file' in att) {
          URL.revokeObjectURL(att.url);
        }
      });
    },
    [attachments]
  );

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    setAttachments((prev) => {
      const existingKeys = new Set(
        prev.map((a) => {
          if ('file' in a) {
            return `${a.file.name}-${a.file.size}-${a.file.lastModified}`;
          }
          return a.id;
        })
      );
      const next: UnifiedAttachment[] = [...prev];
      files.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (existingKeys.has(key)) return;
        next.push({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
        });
      });
      return next;
    });
  };

  // Auto-save effect with debouncing
  useEffect(() => {
    if (!onAutoSave) return;

    const timeoutId = setTimeout(() => {
      const allAttachments: (File | Attachment)[] = attachments.map((att) => {
        if ('file' in att) {
          return att.file;
        }
        return att.attachment;
      });
      const validSubtasks = isEdit
        ? subtasks.filter((s) => s.text.trim() || s.completed)
        : subtasks.filter((s) => s.text.trim()).map((s) => ({
            id: s.id,
            text: s.text.trim(),
            completed: false,
          }));
      onAutoSave(inputValue, allAttachments, validSubtasks);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, attachments, subtasks, onAutoSave, isEdit]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Just close the dialog - changes are already auto-saved
    if (onDone) {
      onDone();
    }

    if (!isEdit) {
      setInputValue('');
      attachments.forEach((att) => {
        if ('file' in att) {
          URL.revokeObjectURL(att.url);
        }
      });
      setAttachments([]);
      setSubtasks([{ id: crypto.randomUUID(), text: '', completed: false }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    if (onDone) {
      onDone();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att && 'file' in att) {
        URL.revokeObjectURL(att.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: crypto.randomUUID(), text: '', completed: false },
    ]);
  };

  const updateSubtask = (id: string, text: string) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text } : subtask
      )
    );
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    );
  };

  const removeSubtask = (id: string) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((s) => s.id !== id));
    }
  };

  const isImageFile = (fileOrAttachment: File | Attachment) => {
    if (fileOrAttachment instanceof File) {
      return fileOrAttachment.type.startsWith('image/');
    }
    return fileOrAttachment.type === 'image';
  };

  const getFileName = (att: UnifiedAttachment) => {
    if ('file' in att) {
      return att.file.name;
    }
    return att.attachment.name;
  };

  const getFileUrl = (att: UnifiedAttachment) => {
    if ('file' in att) {
      return att.url;
    }
    return att.attachment.url;
  };

  const getIconForFile = (fileOrAttachment: File | Attachment) => {
    const name = (fileOrAttachment instanceof File
      ? fileOrAttachment.name
      : fileOrAttachment.name
    ).toLowerCase();
    if (name.endsWith('.pdf')) return <FaFilePdf className={styles.attachmentIcon} />;
    if (name.endsWith('.doc') || name.endsWith('.docx'))
      return <FaFileWord className={styles.attachmentIcon} />;
    if (name.endsWith('.ppt') || name.endsWith('.pptx'))
      return <FaFilePowerpoint className={styles.attachmentIcon} />;
    if (isImageFile(fileOrAttachment))
      return <FaFileImage className={styles.attachmentIcon} />;
    if (name.endsWith('.txt')) return <FaFileAlt className={styles.attachmentIcon} />;
    return <FaFile className={styles.attachmentIcon} />;
  };

  const handleAttachmentClick = (attachment: UnifiedAttachment) => {
    const url = getFileUrl(attachment);
    const name = getFileName(attachment);
    const isImage = 'file' in attachment
      ? attachment.file.type.startsWith('image/')
      : attachment.attachment.type === 'image';

    if (isImage) {
      setPreview({ url, name });
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadPreview = () => {
    if (!preview) return;
    const link = document.createElement('a');
    link.href = preview.url;
    link.download = preview.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Create a new task">
      <div className={styles.titleSection}>
        <label className={styles.titleLabel}>Task</label>
        <div
          className={styles.textAreaWrapper}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <textarea
            className={styles.textArea}
            placeholder="Describe your task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="New task"
            rows={3}
            ref={textAreaRef}
          />
          <button
            type="button"
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
          >
            <FaPaperclip />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
          />

          {attachments.length > 0 && (
            <div className={styles.attachments}>
              <div className={styles.attachmentsRow}>
                {attachments.map((attachment) => {
                  const fileName = getFileName(attachment);
                  const fileUrl = getFileUrl(attachment);
                  const fileOrAttachment: File | Attachment = 'file' in attachment
                    ? attachment.file
                    : attachment.attachment;
                  const isImage = isImageFile(fileOrAttachment);

                  return (
                    <div
                      key={attachment.id}
                      className={styles.attachment}
                      onClick={() => handleAttachmentClick(attachment)}
                    >
                      <div className={styles.attachmentIconWrapper}>
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={fileName}
                            className={styles.attachmentThumb}
                          />
                        ) : (
                          getIconForFile(fileOrAttachment)
                        )}
                      </div>
                      <div className={styles.attachmentInfo}>
                        <span className={styles.attachmentName}>{fileName}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.removeAttachment}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(attachment.id);
                        }}
                        aria-label="Remove attachment"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.subtasksSection}>
        <div className={styles.subtasksHeader}>
          <label className={styles.subtasksLabel}>Subtasks (optional):</label>
          <button
            type="button"
            className={styles.addSubtaskBtn}
            onClick={addSubtask}
          >
            <FaPlus /> Add
          </button>
        </div>
        {subtasks.length > 0 && (
          <ul className={styles.subtasksList}>
            {subtasks.map((subtask) => (
              <li key={subtask.id} className={styles.subtaskItem}>
                <button
                  type="button"
                  className={`${styles.subtaskCheckbox} ${
                    subtask.completed ? styles.checked : ''
                  }`}
                  onClick={() => toggleSubtask(subtask.id)}
                >
                  {subtask.completed && '✓'}
                </button>
                <input
                  type="text"
                  placeholder="Subtask..."
                  value={subtask.text}
                  onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                  className={`${styles.subtaskField} ${
                    subtask.completed ? styles.subtaskCompleted : ''
                  }`}
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeSubtask}
                    onClick={() => removeSubtask(subtask.id)}
                    aria-label="Remove subtask"
                  >
                    <FaTimes />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className={styles.addBtn} aria-label={label}>
        <FaPlus /> {label}
      </button>

      {preview && (
        <div
          className={styles.previewOverlay}
          onClick={() => setPreview(null)}
        >
          <div
            className={styles.previewDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.url}
              alt={preview.name}
              className={styles.previewImage}
            />
            <div className={styles.previewDetails}>
              <span className={styles.previewName}>{preview.name}</span>
              <div className={styles.previewActions}>
                <button
                  type="button"
                  className={styles.previewButton}
                  onClick={handleDownloadPreview}
                >
                  Download
                </button>
                <button
                  type="button"
                  className={styles.previewButtonSecondary}
                  onClick={() => setPreview(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
