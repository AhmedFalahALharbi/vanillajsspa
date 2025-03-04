const initialState = {
    tasks: [],
    filter: 'all'
  };
  

  function reducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_TASKS':
        return { ...state, tasks: action.tasks };
      case 'ADD_TASK':
        return { ...state, tasks: [...state.tasks, action.task] };
      case 'UPDATE_TASK':
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.id == action.id ? { ...task, ...action.updates } : task
          )
        };
      case 'DELETE_TASK':
        return { ...state, tasks: state.tasks.filter(task => task.id != action.id) };
      case 'REORDER_TASKS':
        return { ...state, tasks: action.tasks };
      case 'SET_FILTER':
        return { ...state, filter: action.filter };
      default:
        return state;
    }
  }
  
  const store = Redux.createStore(reducer);
  
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
    render();
  });
  
  function render() {
    const { tasks, filter } = store.getState();
    let filteredTasks = tasks;
    
    if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
      filteredTasks = tasks.filter(task => !task.completed);
    }
    
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.setAttribute("draggable", true);
      li.setAttribute("data-id", task.id);
      li.className = "p-2 border rounded bg-white flex justify-between items-center";
      li.innerHTML = `
        <span class="${task.completed ? 'line-through' : ''}">${task.title}</span>
        <div>
          <button class="toggle-btn bg-green-500 text-white px-2 py-1 rounded mr-2">
            ${task.completed ? "Undo" : "Complete"}
          </button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      `;
      
      li.querySelector(".toggle-btn").addEventListener("click", () => {
        store.dispatch({
          type: 'UPDATE_TASK',
          id: task.id,
          updates: { completed: !task.completed }
        });
      });
      
      li.querySelector(".delete-btn").addEventListener("click", () => {
        store.dispatch({ type: 'DELETE_TASK', id: task.id });
      });
      
      li.addEventListener("dragstart", handleDragStart);
      li.addEventListener("dragover", handleDragOver);
      li.addEventListener("drop", handleDrop);
      
      taskList.appendChild(li);
    });
  }
  
  let draggedId = null;
  
  function handleDragStart(e) {
    draggedId = e.currentTarget.getAttribute("data-id");
    e.dataTransfer.effectAllowed = "move";
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  
  function handleDrop(e) {
    e.preventDefault();
    const targetLi = e.currentTarget;
    const targetId = targetLi.getAttribute("data-id");
    
    if (draggedId && targetId && draggedId !== targetId) {
      const tasks = store.getState().tasks;
      const newTasks = [...tasks];
      const draggedIndex = newTasks.findIndex(task => task.id == draggedId);
      const targetIndex = newTasks.findIndex(task => task.id == targetId);
      
      if (draggedIndex > -1 && targetIndex > -1) {
        const [draggedTask] = newTasks.splice(draggedIndex, 1);
        newTasks.splice(targetIndex, 0, draggedTask);
        store.dispatch({ type: 'REORDER_TASKS', tasks: newTasks });
      }
    }
    draggedId = null;
  }
  
  document.getElementById("taskForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const title = taskInput.value.trim();
    
    if (title === "" || title.length < 5) {
      alert("Task must not be empty and must have at least 5 characters.");
      return;
    }
    
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false
    };
    
    store.dispatch({ type: 'ADD_TASK', task: newTask });
    taskInput.value = "";
  });
  
  document.getElementById("filter").addEventListener("change", function(e) {
    const filter = e.target.value;
    store.dispatch({ type: 'SET_FILTER', filter: filter });
  });
  
  window.addEventListener("DOMContentLoaded", function() {
    const localTasks = localStorage.getItem("tasks");
    if (localTasks) {
      store.dispatch({ type: 'SET_TASKS', tasks: JSON.parse(localTasks) });
    } else {
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        .then(response => response.json())
        .then(data => {
          const tasks = data.map(task => ({
            id: task.id,
            title: task.title,
            completed: task.completed
          }));
          store.dispatch({ type: 'SET_TASKS', tasks: tasks });
        })
        .catch(err => console.error("Error fetching tasks:", err));
    }
  });
  