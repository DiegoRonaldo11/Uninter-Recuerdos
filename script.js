document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");
    const tasksContainer = document.getElementById("tasks-container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");
    const logoutButton = document.getElementById("logout");
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const viewTasksBtn = document.getElementById("view-tasks");
    const tasksMenu = document.getElementById("tasks-menu");
    const pendingTasks = document.getElementById("pending-tasks");
    const closeMenuBtn = document.getElementById("close-menu");

    let currentUser = localStorage.getItem("currentUser");

    function showSection(section) {
        loginContainer.classList.add("hidden");
        registerContainer.classList.add("hidden");
        tasksContainer.classList.add("hidden");
        tasksMenu.classList.add("hidden");
        section.classList.remove("hidden");
    }

    if (currentUser) {
        showSection(tasksContainer);
        loadTasks();
    } else {
        showSection(loginContainer);
    }

    showRegister.addEventListener("click", () => showSection(registerContainer));
    showLogin.addEventListener("click", () => showSection(loginContainer));

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("login-user").value.trim();
        const pass = btoa(document.getElementById("login-pass").value); // encriptar

        if (!user || !pass) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = users.find(u => u.username === user && u.password === pass);

        if (foundUser) {
            localStorage.setItem("currentUser", user);
            showSection(tasksContainer);
            loadTasks();
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("register-user").value.trim();
        const pass = btoa(document.getElementById("register-pass").value); // encriptar

        if (!user || !pass) {
            alert("Por favor completa todos los campos.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(u => u.username === user)) {
            alert("El usuario ya existe");
            return;
        }

        users.push({ username: user, password: pass });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registro exitoso. Ahora inicia sesión.");
        showSection(loginContainer);
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        location.reload();
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskInput = document.getElementById("task").value.trim();
        const taskTime = document.getElementById("task-time").value;

        if (!taskInput || !taskTime) {
            alert("Por favor completa todos los campos de la tarea.");
            return;
        }

        addTaskToList(taskInput, taskTime, false);
        saveTask(taskInput, taskTime, false);
        taskForm.reset();
        alert("✅ Tarea agregada con éxito.");
    });

    function loadTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        tasks.forEach((task, index) => addTaskToList(task.text, task.time, task.completed, index));
    }

    function addTaskToList(text, time, completed, index) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <span>${text} - ${new Date(time).toLocaleString()}</span>
            <input type='checkbox' class='mark-done' ${completed ? "checked" : ""}>
        `;
        if (completed) {
            taskItem.classList.add("completed");
        }

        const checkbox = taskItem.querySelector(".mark-done");
        checkbox.addEventListener("change", () => {
            updateTaskStatus(index, checkbox.checked);
            taskItem.classList.toggle("completed");
            alert(checkbox.checked ? "✅ Tarea marcada como completada." : "🔁 Tarea marcada como pendiente.");
        });

        taskList.appendChild(taskItem);
    }

    function saveTask(text, time, completed) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        tasks.push({ text, time, completed });
        localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
    }

    function updateTaskStatus(index, completed) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        if (tasks[index]) {
            tasks[index].completed = completed;
            localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
        }
    }

    viewTasksBtn.addEventListener("click", () => {
        showSection(tasksMenu);
        pendingTasks.innerHTML = "";

        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        const pending = tasks.filter(t => !t.completed);

        if (pending.length === 0) {
            pendingTasks.innerHTML = "<li>No tienes tareas pendientes 🎉</li>";
        } else {
            pending.forEach(task => {
                const li = document.createElement("li");
                li.textContent = `${task.text} - ${new Date(task.time).toLocaleString()}`;
                pendingTasks.appendChild(li);
            });
        }
    });

    closeMenuBtn.addEventListener("click", () => {
        showSection(tasksContainer);
    });
});
