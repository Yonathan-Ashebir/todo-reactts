import { useState } from 'react';
import type { Todo } from './types';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import EditDialog from './components/EditDialog';
import styles from './App.module.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdd = (title: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
    };
    setTodos([...todos, newTodo]);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = (id: string, newTitle: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo)));
    setEditingTodo(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTodo(null);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Todo List</h1>
      <TodoForm onAdd={handleAdd} />
      <TodoList todos={todos} onEdit={handleEdit} onDelete={handleDelete} />
      <EditDialog
        todo={editingTodo}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveEdit}
      />
    </main>
  );
}

export default App;
