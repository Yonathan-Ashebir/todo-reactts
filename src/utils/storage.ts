import type { Todo, Attachment } from '../types';

const STORAGE_KEY = 'todo-app-todos';

// Serialize Todo for storage (convert blob URLs to data URLs if needed)
export async function serializeTodoForStorage(todo: Todo): Promise<any> {
  const serializedAttachments = await Promise.all(
    todo.attachments.map(async (att) => {
      // If it's already a data URL, keep it
      if (att.url.startsWith('data:')) {
        return att;
      }
      // If it's a blob URL, we need to fetch and convert
      try {
        const response = await fetch(att.url);
        const blob = await response.blob();
        const dataURL = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        return {
          ...att,
          url: dataURL,
        };
      } catch {
        // If fetch fails, keep original URL (might be invalid)
        return att;
      }
    })
  );

  return {
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    attachments: serializedAttachments,
  };
}

// Deserialize Todo from storage
export function deserializeTodoFromStorage(data: any): Todo {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    attachments: data.attachments.map((att: Attachment) => ({
      ...att,
      url: att.url, // Data URLs work directly
    })),
  };
}

// Save todos to localStorage
export async function saveTodosToStorage(todos: Todo[]): Promise<void> {
  try {
    const serialized = await Promise.all(todos.map(serializeTodoForStorage));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
}

// Load todos from localStorage
export function loadTodosFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map(deserializeTodoFromStorage);
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
}

