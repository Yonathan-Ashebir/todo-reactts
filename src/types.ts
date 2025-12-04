export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string; // For images, this will be a data URL or blob URL
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  createdAt: Date;
  completed: boolean;
  attachments: Attachment[];
  subtasks: Subtask[];
}

export type FilterType = 'all' | 'completed' | 'pending';
export type SortOrder = 'asc' | 'desc';
