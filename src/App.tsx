import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { DragEvent } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import type { Todo, FilterType, SortOrder, Attachment, Subtask } from './types';
import TodoList from './components/TodoList';
import FilterSortBar from './components/FilterSortBar';
import ManageTaskDialog from './components/ManageTaskDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import { saveTodosToStorage, loadTodosFromStorage } from './utils/storage';
import { useTheme } from './contexts/ThemeContext';
import styles from './App.module.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [createInitialFiles, setCreateInitialFiles] = useState<File[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; todo: Todo | null }>({
    isOpen: false,
    todo: null,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadedTodos = loadTodosFromStorage();
    setTodos(loadedTodos);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem('todo-app-todos')) {
      saveTodosToStorage(todos).catch(console.error);
    }
  }, [todos]);

  const [draftTodoId, setDraftTodoId] = useState<string | null>(null);

  const handleAutoSave = async (
    id: string | null,
    title: string,
    attachments: (File | Attachment)[],
    subtasks: Subtask[]
  ) => {
    const newFiles = attachments.filter((att) => att instanceof File) as File[];
    const existingAttachments = attachments.filter(
      (att) => !(att instanceof File)
    ) as Attachment[];

    const newAttachments = await Promise.all(
      newFiles.map(async (file) => {
        // Convert File to data URL for storage
        const dataURL = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        return {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type.startsWith('image/') ? ('image' as const) : ('file' as const),
          url: dataURL,
        };
      })
    );

    const allAttachments = [...existingAttachments, ...newAttachments];

    if (id) {
      // Update existing todo
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                title: title.trim() || todo.title,
                attachments: allAttachments,
                subtasks,
              }
            : todo
        )
      );
    } else {
      // Create new draft todo
      if (!title.trim() && allAttachments.length === 0 && subtasks.length === 0) {
        return; // Don't create empty todos
      }

      const newTodo: Todo = {
        id: draftTodoId || crypto.randomUUID(),
        title: title.trim() || 'Untitled Task',
        createdAt: new Date(),
        completed: false,
        attachments: allAttachments,
        subtasks,
      };

      if (draftTodoId) {
        // Update existing draft
        setTodos(
          todos.map((todo) => (todo.id === draftTodoId ? newTodo : todo))
        );
      } else {
        // Create new draft
        setDraftTodoId(newTodo.id);
        setTodos([...todos, newTodo]);
      }
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setDialogMode('edit');
  };

  const handleDialogClose = () => {
    // Clean up empty draft todos
    if (draftTodoId) {
      const draftTodo = todos.find((t) => t.id === draftTodoId);
      if (draftTodo && (!draftTodo.title.trim() || draftTodo.title === 'Untitled Task') && draftTodo.attachments.length === 0 && draftTodo.subtasks.length === 0) {
        setTodos(todos.filter((t) => t.id !== draftTodoId));
      }
    }
    setDialogMode(null);
    setEditingTodo(null);
    setCreateInitialFiles([]);
    setDraftTodoId(null);
  };

  const handleDeleteClick = useCallback((id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setDeleteConfirm({ isOpen: true, todo });
    }
  }, [todos]);

  const handleDeleteConfirm = () => {
    if (!deleteConfirm.todo) return;

    const todo = deleteConfirm.todo;
    // Clean up blob URLs (if any are blob URLs)
    todo.attachments.forEach((att) => {
      if (att.url.startsWith('blob:')) {
        URL.revokeObjectURL(att.url);
      }
    });
    setTodos(todos.filter((t) => t.id !== todo.id));
    setDeleteConfirm({ isOpen: false, todo: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, todo: null });
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: todo.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : todo
      )
    );
  };

  const openCreateDialog = useCallback((files: File[] = []) => {
    setCreateInitialFiles(files);
    setDialogMode('create');
    setDraftTodoId(null); // Reset draft ID when opening new dialog
  }, []);

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      openCreateDialog(files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Apply filter
    if (filter === 'completed') {
      filtered = todos.filter((todo) => todo.completed);
    } else if (filter === 'pending') {
      filtered = todos.filter((todo) => !todo.completed);
    }

    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (trimmedSearch) {
      filtered = filtered.filter((todo) => {
        const inTitle = todo.title.toLowerCase().includes(trimmedSearch);
        const inSubtasks = todo.subtasks.some((s) =>
          s.text.toLowerCase().includes(trimmedSearch)
        );
        return inTitle || inSubtasks;
      });
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      const dateA = a.createdAt.getTime();
      const dateB = b.createdAt.getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [todos, filter, sortOrder, searchTerm]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    if (selectedIndex >= filteredAndSortedTodos.length) {
      setSelectedIndex(Math.max(-1, filteredAndSortedTodos.length - 1));
    }
  }, [filteredAndSortedTodos.length, selectedIndex]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't handle shortcuts when dialogs are open or when typing in inputs
      if (dialogMode !== null || deleteConfirm.isOpen) return;
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + / for search
      if (modKey && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Ctrl/Cmd + K for new task (N is captured by browser for new window)
      if (modKey && e.key === 'k') {
        e.preventDefault();
        openCreateDialog();
        return;
      }

      // Ctrl/Cmd + S for sort toggle
      if (modKey && e.key === 's') {
        e.preventDefault();
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        return;
      }

      // Ctrl/Cmd + 1, 2, 3 for filters
      if (modKey && e.key === '1') {
        e.preventDefault();
        setFilter('all');
        return;
      }
      if (modKey && e.key === '2') {
        e.preventDefault();
        setFilter('completed');
        return;
      }
      if (modKey && e.key === '3') {
        e.preventDefault();
        setFilter('pending');
        return;
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredAndSortedTodos.length > 0) {
          setSelectedIndex((prev) =>
            prev < filteredAndSortedTodos.length - 1 ? prev + 1 : prev
          );
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(-1, prev - 1));
        return;
      }

      // Enter to edit selected task
      if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < filteredAndSortedTodos.length) {
        e.preventDefault();
        handleEdit(filteredAndSortedTodos[selectedIndex]);
        return;
      }

      // Delete or Backspace to delete selected task
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedIndex >= 0 &&
        selectedIndex < filteredAndSortedTodos.length
      ) {
        e.preventDefault();
        handleDeleteClick(filteredAndSortedTodos[selectedIndex].id);
        return;
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedIndex(-1);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialogMode, deleteConfirm.isOpen, filteredAndSortedTodos, selectedIndex, handleEdit, handleDeleteClick, openCreateDialog]);

  return (
    <main
      className={styles.container}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className={styles.sheet}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>✓</span>
              Todo List
            </h1>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
          <p className={styles.subtitle}>Organize your tasks with style</p>
          <div className={styles.keyboardHints}>
            <span className={styles.keyboardHint}>
              <kbd>⌘</kbd> + <kbd>/</kbd> Search
            </span>
            <span className={styles.keyboardHint}>
              <kbd>⌘</kbd> + <kbd>K</kbd> New Task
            </span>
            <span className={styles.keyboardHint}>
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span className={styles.keyboardHint}>
              <kbd>↵</kbd> Edit
            </span>
            <span className={styles.keyboardHint}>
              <kbd>⌫</kbd> Delete
            </span>
          </div>
        </div>

        <FilterSortBar
          filter={filter}
          sortOrder={sortOrder}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilter}
          onSortChange={setSortOrder}
          onAddClick={() => openCreateDialog()}
          searchInputRef={searchInputRef}
        />

        <TodoList
          todos={filteredAndSortedTodos}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleComplete={handleToggleComplete}
          onToggleSubtask={handleToggleSubtask}
          selectedIndex={selectedIndex}
        />
      </div>

      <ManageTaskDialog
        mode={dialogMode === 'edit' ? 'edit' : 'create'}
        isOpen={dialogMode !== null}
        todo={editingTodo}
        initialFiles={createInitialFiles}
        onClose={handleDialogClose}
        onAutoSave={(id, title, attachments, subtasks) =>
          handleAutoSave(id || (dialogMode === 'edit' && editingTodo ? editingTodo.id : draftTodoId), title, attachments, subtasks)
        }
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirm.isOpen}
        taskTitle={deleteConfirm.todo?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </main>
  );
}

export default App;
