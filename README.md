# Todo List Application - React + TypeScript

A modern, beautiful Todo List application built with React and TypeScript. This application demonstrates the use of React components, hooks, and CSS Modules for styling.

## Features

- ✅ **Add Tasks**: Create new todo items with a simple input form
- ✏️ **Edit Tasks**: Update existing tasks using an intuitive edit dialog
- 🗑️ **Delete Tasks**: Remove tasks by clicking the delete button or clicking on the task title
- 🎨 **Beautiful UI**: Modern, clean interface with smooth animations and transitions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **React 19.2.0**: Latest version of React for building user interfaces
- **TypeScript**: Type-safe JavaScript for better code quality
- **Vite**: Fast build tool and development server
- **CSS Modules**: Scoped styling for component-based architecture

## Project Structure

```
react-ts/
├── src/
│   ├── components/
│   │   ├── TodoItem.tsx          # Individual todo item component
│   │   ├── TodoItem.module.css    # Styles for TodoItem
│   │   ├── TodoList.tsx           # List of todos component
│   │   ├── TodoList.module.css    # Styles for TodoList
│   │   ├── TodoForm.tsx           # Form for adding new todos
│   │   ├── TodoForm.module.css    # Styles for TodoForm
│   │   ├── EditDialog.tsx         # Dialog for editing todos
│   │   └── EditDialog.module.css  # Styles for EditDialog
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

## Usage

1. **Adding a Task**: Type your task in the input field and click "Add" or press Enter
2. **Editing a Task**: Click the "Edit" button on any task to open the edit dialog
3. **Deleting a Task**: Click the "Delete" button or click directly on the task title to remove it
4. **Empty State**: When there are no tasks, a helpful message is displayed

## Key Concepts Demonstrated

- **React Hooks**: Uses `useState` for managing application state
- **Component Architecture**: Modular components for better code organization
- **TypeScript**: Type-safe props and state management
- **CSS Modules**: Scoped styling to prevent style conflicts
- **Event Handling**: Form submissions, button clicks, and keyboard events
- **Conditional Rendering**: Empty state display when no tasks exist

## Development

The project uses:
- **Vite** for fast development and building
- **TypeScript** for type checking
- **ESLint** for code linting

## License

This project is created for educational purposes as part of the A2SV curriculum.

## Author

Created as part of the A2SV (Africa to Silicon Valley) program.
