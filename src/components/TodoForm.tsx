import { useState } from 'react';
import type { FormEvent } from 'react';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
      setInputValue('');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Create a new task">
      <input
        type="text"
        className={styles.input}
        placeholder="Add a new task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="New task"
      />
      <button type="submit" className={styles.addBtn} aria-label="Add task">
        Add
      </button>
    </form>
  );
}

