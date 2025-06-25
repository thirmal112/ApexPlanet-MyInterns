document.addEventListener("DOMContentLoaded", function () {
  // Contact form submission with inline validation messages and success message
  const form = document.getElementById("form");
  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formMessage = document.getElementById("form-message");
    const resetBtn = document.getElementById("reset-btn");

    // Create error message elements
    function createErrorElement(id) {
      let errorElem = document.createElement("div");
      errorElem.id = id;
      errorElem.style.color = "red";
      errorElem.style.fontSize = "0.9rem";
      errorElem.style.marginTop = "-0.5rem";
      errorElem.style.marginBottom = "0.5rem";
      return errorElem;
    }

    // Remove existing error messages
    function clearErrors() {
      const errors = document.querySelectorAll(".error-message");
      errors.forEach(error => error.remove());
    }

    // Clear success message
    function clearSuccessMessage() {
      formMessage.textContent = "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      clearSuccessMessage();

      let hasError = false;

      if (nameInput.value.trim() === "") {
        const error = createErrorElement("name-error");
        error.classList.add("error-message");
        error.textContent = "Name is required.";
        nameInput.insertAdjacentElement("afterend", error);
        hasError = true;
      }

      if (emailInput.value.trim() === "") {
        const error = createErrorElement("email-error");
        error.classList.add("error-message");
        error.textContent = "Email is required.";
        emailInput.insertAdjacentElement("afterend", error);
        hasError = true;
      } else {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailInput.value.match(emailPattern)) {
          const error = createErrorElement("email-error");
          error.classList.add("error-message");
          error.textContent = "Please enter a valid email address.";
          emailInput.insertAdjacentElement("afterend", error);
          hasError = true;
        }
      }

      if (messageInput.value.trim() === "") {
        const error = createErrorElement("message-error");
        error.classList.add("error-message");
        error.textContent = "Message is required.";
        messageInput.insertAdjacentElement("afterend", error);
        hasError = true;
      }

      if (!hasError) {
        formMessage.textContent = "Form submitted successfully!";
        formMessage.style.color = "green";
        form.reset();
      }
    });

    resetBtn.addEventListener("click", function () {
      clearErrors();
      clearSuccessMessage();
    });
  }

  // To-Do List code
  const todoForm = document.getElementById("todo-form");
  if (todoForm) {
    const todoInput = document.getElementById("todo-input");
    const todoItems = document.getElementById("todo-items");

    // Load saved tasks from localStorage
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTaskToDOM(task));

    // Add new task
    todoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const taskText = todoInput.value.trim();
      if (taskText === "") return;

      const taskObj = { text: taskText, completed: false };
      addTaskToDOM(taskObj);
      saveTask(taskObj);
      todoInput.value = "";
    });

    // Add task item to DOM
    function addTaskToDOM(taskObj) {
      const li = document.createElement("li");
      li.className = taskObj.completed ? "completed" : "";
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.padding = "0.5rem";
      li.style.borderBottom = "1px solid #ccc";

      // Checkbox for completion toggle
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = taskObj.completed;
      checkbox.setAttribute("aria-label", "Mark task as completed");
      checkbox.addEventListener("change", function () {
        li.classList.toggle("completed");
        taskObj.completed = checkbox.checked;
        updateTask(taskObj);
      });

      // Task text span (editable)
      const taskSpan = document.createElement("span");
      taskSpan.textContent = taskObj.text;
      taskSpan.style.flex = "1";
      taskSpan.style.marginLeft = "0.5rem";
      taskSpan.style.cursor = "pointer";
      taskSpan.setAttribute("tabindex", "0");
      taskSpan.setAttribute("role", "textbox");
      taskSpan.setAttribute("aria-label", "Edit task");
      taskSpan.addEventListener("dblclick", () => {
        editTask(taskSpan, taskObj);
      });
      taskSpan.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          editTask(taskSpan, taskObj);
        }
      });

      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "remove-btn";
      removeBtn.setAttribute("aria-label", "Remove task");
      removeBtn.addEventListener("click", function () {
        todoItems.removeChild(li);
        removeTask(taskObj);
      });

      li.appendChild(checkbox);
      li.appendChild(taskSpan);
      li.appendChild(removeBtn);
      todoItems.appendChild(li);
    }

    // Edit task function
    function editTask(taskSpan, taskObj) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskObj.text;
      input.style.flex = "1";
      input.style.marginLeft = "0.5rem";

      function saveEdit() {
        const newText = input.value.trim();
        if (newText) {
          taskObj.text = newText;
          taskSpan.textContent = newText;
          updateTask(taskObj);
        }
        taskSpan.style.display = "";
        input.remove();
      }

      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        } else if (e.key === "Escape") {
          taskSpan.style.display = "";
          input.remove();
        }
      });

      taskSpan.style.display = "none";
      taskSpan.parentNode.insertBefore(input, taskSpan);
      input.focus();
    }

    // Save task to localStorage
    function saveTask(taskObj) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(taskObj);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Update task in localStorage
    function updateTask(taskObj) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.map(t => (t.text === taskObj.text || t.text === taskObj.oldText ? taskObj : t));
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Remove task from localStorage
    function removeTask(taskObj) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter(t => t.text !== taskObj.text);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Clear completed tasks button
    const clearCompletedBtn = document.createElement("button");
    clearCompletedBtn.textContent = "Clear Completed Tasks";
    clearCompletedBtn.style.marginTop = "1rem";
    clearCompletedBtn.style.padding = "0.5rem 1rem";
    clearCompletedBtn.style.border = "none";
    clearCompletedBtn.style.borderRadius = "4px";
    clearCompletedBtn.style.backgroundColor = "#dc3545";
    clearCompletedBtn.style.color = "white";
    clearCompletedBtn.style.cursor = "pointer";
    clearCompletedBtn.style.fontWeight = "600";
    clearCompletedBtn.addEventListener("mouseenter", () => {
      clearCompletedBtn.style.backgroundColor = "#a71d2a";
    });
    clearCompletedBtn.addEventListener("mouseleave", () => {
      clearCompletedBtn.style.backgroundColor = "#dc3545";
    });
    clearCompletedBtn.addEventListener("click", () => {
      const items = Array.from(todoItems.children);
      items.forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
          todoItems.removeChild(li);
        }
      });
      // Update localStorage
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter(t => !t.completed);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    todoForm.parentNode.appendChild(clearCompletedBtn);
  }
});
