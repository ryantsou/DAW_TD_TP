
interface Task {
  id: number;
  content: string;
  done: number;
}

const API_URL = "http://localhost:8080/tasks"; 

const taskListElement = document.getElementById("task-list") as HTMLUListElement;
const taskInputElement = document.getElementById("task-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

async function fetchTasks(): Promise<void> {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const tasks: Task[] = await response.json();
      renderTasks(tasks);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
  }
}

async function addTask(content: string): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });

    if (response.status === 201) {
      fetchTasks(); 
      taskInputElement.value = ""; 
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
  }
}


async function updateTask(id: number, content: string, done: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, done })
    });

    if (response.ok) {
      fetchTasks();
    }
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
  }
}

async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      fetchTasks();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

function renderTasks(tasks: Task[]): void {
  taskListElement.innerHTML = ""; 

  tasks.forEach((task) => {
    const li = document.createElement("li");
    

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done === 1;
    checkbox.addEventListener("change", () => {
      updateTask(task.id, task.content, checkbox.checked ? 1 : 0);
    });

  
    const span = document.createElement("span");
    span.textContent = task.content;
    span.style.textDecoration = task.done === 1 ? "line-through" : "none";


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskListElement.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const content = taskInputElement.value.trim();
  if (content) {
    addTask(content);
  }
});

fetchTasks();