# Todo App - Beautiful Task Manager

A modern, feature-rich Todo List application built with React and TypeScript. This application demonstrates advanced React concepts including components, hooks, file handling, and state management with a beautiful, modern UI design.

## 🚀 Quick Start

Run the app instantly with npx:

```bash
npx @yonathan-ashebir/todo-app
```

The app will automatically:
- Build if needed
- Find an available port (starting from 3000)
- Open in your default browser
- Serve the application locally

## 📦 Installation

You can also install it globally:

```bash
npm install -g @yonathan-ashebir/todo-app
todo-app
```

## Features

### Core Functionality
- ✅ **Add Tasks**: Create new todo items with a simple input form
- ✏️ **Edit Tasks**: Update existing tasks with a comprehensive edit dialog
- 🗑️ **Delete Tasks**: Remove tasks with a single click
- ✓ **Complete Tasks**: Mark tasks as complete with visual feedback

### Advanced Features
- 📎 **File & Image Attachments**: Attach multiple files and images to tasks
- 📋 **Subtasks**: Create nested subtasks with independent completion status
- 📅 **Creation Dates**: Automatic tracking of when tasks were created
- 🔍 **Filtering**: Filter tasks by status (All, Completed, Pending)
- 🔄 **Sorting**: Sort tasks by creation date (Ascending/Descending)
- 🎨 **Beautiful UI**: Modern gradient theme with smooth animations

### Task Information Display
- Task creation date and time
- Number and names of attached files/images
- Subtask completion progress (e.g., "2/5 subtasks")
- Visual indicators for completed tasks and subtasks

## Technologies Used

- **React 19.2.0**: Latest version of React for building user interfaces
- **TypeScript**: Type-safe JavaScript for better code quality
- **Vite**: Fast build tool and development server
- **CSS Modules**: Scoped styling for component-based architecture
- **React Icons**: Beautiful icon library (Font Awesome icons)

## Design Theme

The application uses a modern gradient theme inspired by Material Design principles:
- **Primary Colors**: Purple gradient (#667eea to #764ba2)
- **Background**: Soft gradient background
- **Cards**: Clean white cards with subtle shadows
- **Icons**: Font Awesome icons from react-icons library

## Project Structure

```
react-ts/
├── src/
│   ├── components/
│   │   ├── TodoItem.tsx          # Individual todo item with all features
│   │   ├── TodoItem.module.css   # Styles for TodoItem
│   │   ├── TodoList.tsx          # List of todos component
│   │   ├── TodoList.module.css   # Styles for TodoList
│   │   ├── TodoForm.tsx          # Form for adding new todos
│   │   ├── TodoForm.module.css   # Styles for TodoForm
│   │   ├── EditDialog.tsx        # Dialog for editing todos
│   │   ├── EditDialog.module.css # Styles for EditDialog
│   │   ├── FilterSortBar.tsx     # Filter and sort controls
│   │   └── FilterSortBar.module.css # Styles for FilterSortBar
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   ├── App.module.css             # Main app styles
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd react-ts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Usage Guide

### Adding a Task
1. Type your task title in the input field
2. (Optional) Click the paperclip icon to attach files or images
3. (Optional) Add subtasks by clicking "Add Subtask" and entering text
4. Click "Add Task" or press Enter

### Editing a Task
1. Click the "Edit" button on any task
2. Modify the title, add/remove attachments, or manage subtasks
3. Click "Save Changes" to apply updates

### Managing Subtasks
- Click on any subtask to toggle its completion status
- Completed subtasks appear with strikethrough text
- Add new subtasks in the edit dialog
- Remove subtasks using the X button

### Filtering Tasks
- **All**: Shows all tasks regardless of status
- **Completed**: Shows only completed tasks
- **Pending**: Shows only incomplete tasks

### Sorting Tasks
- Click the sort icon to toggle between ascending and descending order
- Tasks are sorted by creation date

### Deleting Tasks
- Click the "Delete" button on any task
- Or click directly on the task title to delete it

## Key Concepts Demonstrated

- **React Hooks**: 
  - `useState` for managing application state
  - `useMemo` for optimized filtering and sorting
  - `useEffect` for side effects
  - `useRef` for file input references

- **Component Architecture**: Modular components for better code organization
- **TypeScript**: Type-safe props, state, and data structures
- **CSS Modules**: Scoped styling to prevent style conflicts
- **File Handling**: File upload, blob URL management, and cleanup
- **Event Handling**: Form submissions, button clicks, and keyboard events
- **Conditional Rendering**: Empty states, filtered views, and dynamic UI
- **Icon Integration**: Using react-icons library for beautiful icons

## File Attachments

The application supports:
- **Images**: JPG, PNG, GIF, and other image formats
- **Documents**: PDF, DOC, DOCX, TXT files
- Multiple attachments per task
- Visual indicators for attachment types

## Subtasks

- Text-only bullet lists
- Independent completion status
- Visual feedback with strikethrough for completed items
- Progress tracking (e.g., "3/5 subtasks completed")

## Development

The project uses:
- **Vite** for fast development and building
- **TypeScript** for type checking
- **ESLint** for code linting
- **CSS Modules** for component-scoped styling

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- File API
- Blob URLs

## License

This project is created for educational purposes as part of the A2SV curriculum.

## Author

Created as part of the A2SV (Africa to Silicon Valley) program.
