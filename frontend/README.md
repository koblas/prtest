# React Frontend

A modern React application for the Todo app with TypeScript and Material-UI.

## Features

- **TypeScript** for type safety
- **Material-UI** for consistent design
- **OpenAPI-based** API client
- **Responsive design** for mobile and desktop
- **Real-time updates** with optimistic UI
- **Pagination and filtering** for large todo lists

## Project Structure

```
src/
├── components/          # React components
│   ├── TodoList.tsx    # Main todo list component
│   ├── TodoItem.tsx    # Individual todo item
│   └── AddTodoDialog.tsx # Dialog for adding new todos
├── services/           # API services
│   └── TodoService.ts  # Todo API client
├── types/              # TypeScript type definitions
│   └── api.ts         # API types from OpenAPI spec
├── App.tsx            # Main app component
└── index.tsx          # Application entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8080
```

## Development

1. Install dependencies: `npm install`
2. Start the backend server (see backend README)
3. Start the frontend: `npm start`
4. Open http://localhost:3000

## Features

### Todo Management
- Create new todos with title and description
- Mark todos as completed/pending
- Delete todos
- Filter by completion status
- Pagination for large lists

### UI/UX
- Material Design components
- Responsive layout
- Loading states
- Error handling
- Optimistic updates