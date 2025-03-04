# Dynamic Task Manager App

A single-page application (SPA) built with JavaScript, Redux, Tailwind CSS, and AJAX. The app lets users manage tasks by fetching, adding, filtering, and persisting tasks.

## Features

- **Fetch Tasks:**  
  Fetch tasks from an API (`https://jsonplaceholder.typicode.com/todos?_limit=10`) and display them.

- **State Management:**  
  Manage tasks globally using Redux (add, update, delete).

- **Add New Task:**  
  Add tasks with validation (task cannot be empty and must be at least 5 characters long).

- **Filter Tasks:**  
  Filter tasks by status (completed or pending).

- **Persist Data:**  
  Save tasks to `localStorage` so they remain after a page refresh.

- **Drag & Drop Sorting (Bonus):**  
  Reorder tasks using drag & drop.

## Technologies Used

- **JavaScript:** Core logic and DOM manipulation.
- **Redux:** State management.
- **Tailwind CSS:** Styling.
- **AJAX/Fetch API:** Fetch tasks from the API.
- **localStorage:** Persist tasks across sessions.

## File Structure


. ├── index.html # HTML structure with CDNs └── src └── app.js # JavaScript with state management and logic


## Getting Started

1. **Clone or Download the Project.**
2. **Open the `index.html` file in a browser.**
3. **Interact with the app:**
   - View tasks fetched from the API.
   - Add new tasks (must pass validation).
   - Filter tasks by their status.
   - Reorder tasks using drag & drop.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for the test API.
- [Redux](https://redux.js.org/) for state management.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
