
const client = window.supabaseClient;

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const todoMessage = document.getElementById("todoMessage");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");

let currentUser = null;
let todos = [];

// Check login before showing the dashboard
async function initApp() {
    const { data, error } = await client.auth.getSession();

    if (error || !data.session) {
        window.location.replace("signin.html");
        return;
    }

    currentUser = data.session.user;
    userEmail.textContent = currentUser.email || "";

    await getTodos();
}

function showMessage(message, isError = false) {
    todoMessage.textContent = message;
    todoMessage.style.color = isError ? "red" : "green";
}

// Fetch only the logged-in user's tasks
async function getTodos() {
    const { data, error } = await client
        .from("todoss")
        .select("*")
        .eq("user_id", currentUser.id);

    if (error) {
        showMessage(error.message, true);
        return;
    }

    todos = data || [];
    renderTodos();
}

// Add a task
todoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const task = taskInput.value.trim();

    if (!task) {
        showMessage("Please enter a task.", true);
        return;
    }

    addBtn.disabled = true;

    const { error } = await client
        .from("todoss")
        .insert({
            text: task,
            iscompleted: false,
            user_id: currentUser.id
        });

    addBtn.disabled = false;

    if (error) {
        showMessage(error.message, true);
        return;
    }

    taskInput.value = "";
    showMessage("Task added successfully!");
    await getTodos();
});

// Display tasks safely
function renderTodos() {
    todoList.replaceChildren();

    todos.forEach(function (todo) {
        const todoDiv = document.createElement("div");
        todoDiv.className = "todo";

        const textDiv = document.createElement("div");
        textDiv.className = "todo-text";

        if (todo.iscompleted) {
            textDiv.classList.add("completed");
        }

        textDiv.textContent = todo.text;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function () {
            editTodo(todo.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteTodo(todo.id);
        });

        actions.append(editBtn, deleteBtn);
        todoDiv.append(textDiv, actions);
        todoList.appendChild(todoDiv);
    });
}

// Edit a task
async function editTodo(id) {
    const todo = todos.find(item => item.id === id);

    if (!todo) return;

    const newTask = prompt("Edit your task:", todo.text);

    if (newTask === null || !newTask.trim()) return;

    const { error } = await client
        .from("todoss")
        .update({ text: newTask.trim() })
        .eq("id", id)
        .eq("user_id", currentUser.id);

    if (error) {
        showMessage(error.message, true);
        return;
    }

    showMessage("Task updated successfully!");
    await getTodos();
}

// Delete a task
async function deleteTodo(id) {
    const confirmed = confirm("Do you want to delete this task?");

    if (!confirmed) return;

    const { error } = await client
        .from("todoss")
        .delete()
        .eq("id", id)
        .eq("user_id", currentUser.id);

    if (error) {
        showMessage(error.message, true);
        return;
    }

    showMessage("Task deleted successfully!");
    await getTodos();
}

// Logout
logoutBtn.addEventListener("click", async function () {
    logoutBtn.disabled = true;

    const { error } = await client.auth.signOut();

    if (error) {
        showMessage(error.message, true);
        logoutBtn.disabled = false;
        return;
    }

    window.location.replace("signin.html");
});

// Start the app
initApp();