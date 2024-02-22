import { v4 as uuidv4 } from "uuid";

// Function To read todos from database
function fetchTodos() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/todos", true);

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            const todos: Todo[] = JSON.parse(xhr.responseText);

            handleTodosRender(todos);
        } else {
            console.error("failed to fetch todos");
        }
    };

    xhr.send();
}

fetchTodos();

// Get DOM Elemets
const createForm = document.querySelector<HTMLFormElement>(".create-form");
const titleField = document.querySelector<HTMLInputElement>(".title-field");
const descriptionField =
    document.querySelector<HTMLInputElement>(".description-field");
// const noTodoMsg = document.querySelector<HTMLDivElement>(".no-todos");

// Logic to perform Form actions
if (createForm && titleField) {
    titleField.focus();

    createForm.addEventListener("keydown", handleKeyEvent);
    createForm.addEventListener("submit", handleCreateTodo);
}

// function to Handle key events on form - Enter Key and arrow keys...
export function handleKeyEvent(e: Event): void {
    const keyEvent = e as KeyboardEvent;
    const target = e.target as HTMLInputElement;

    const index: number = parseInt(target.getAttribute("data-index") || "1");

    if (keyEvent.key === "Enter" || keyEvent.key === "ArrowDown") {
        e.preventDefault();

        const nextInput: HTMLInputElement | null = document.querySelector(
            `[data-index="${index + 1}"]`
        );

        if (nextInput) {
            nextInput.focus();
        } else if (keyEvent.key === "Enter") {
            const submitButton =
                document.querySelector<HTMLButtonElement>('[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }

    if (keyEvent.key == "ArrowUp") {
        e.preventDefault();

        const nextInput: HTMLInputElement | null = document.querySelector(
            `[data-index="${index - 1}"]`
        );

        if (nextInput) {
            nextInput.focus();
        }
    }
}

// Function to Create Todo From Input
function handleCreateTodo(e: Event): void {
    e.preventDefault();

    if (titleField && descriptionField) {
        if (titleField.value) {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:3000/todos", true);

            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    fetchTodos();
                } else {
                    console.error("failed to create todo:", xhr.statusText);
                }
            };

            xhr.onerror = () => {
                console.error("Network error while creating todo");
            };

            const newTodo: Todo = {
                title: titleField.value.trim(),
                description: descriptionField.value.trim(),
                id: uuidv4(),
                completed: false,
                important: false,
            };

            xhr.send(JSON.stringify(newTodo));

            // reset form input field
            titleField.value = "";
            descriptionField.value = "";
            titleField.focus();
        } else {
            alert("Must have heading");
        }
    }
}

// Function to Render Todo as HTML
function handleTodosRender(todos: Todo[]): void {
    const renderedTodos: Todo[] = [...todos].reverse();
    const todoList = document.querySelector<HTMLUListElement>(".todos");

    if (todoList) {
        todoList.innerHTML = "";
    }

    renderedTodos.forEach((todo) => {
        const li: HTMLLIElement = document.createElement("li");
        const todoLeft: HTMLDivElement = document.createElement("div");
        const todoCheck: HTMLInputElement = document.createElement("input");
        const todoLabel: HTMLLabelElement = document.createElement("label");
        const checkboxSVG: SVGSVGElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const customSVGCheckBox: SVGPathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        const customSVGCheck: SVGPathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        const todoText: HTMLDivElement = document.createElement("div");
        const todoTitle: HTMLHeadingElement = document.createElement("h2");
        const todoDescription: HTMLParagraphElement =
            document.createElement("p");
        const todoRight: HTMLDivElement = document.createElement("div");
        const starBtn: HTMLButtonElement = document.createElement("button");
        const editBtn: HTMLButtonElement = document.createElement("button");
        const deleteBtn: HTMLButtonElement = document.createElement("button");
        const starSVG: SVGSVGElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const starPathSVG: SVGPathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        const editSVG: SVGSVGElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const editPathSVG: SVGPathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        const deleteSVG: SVGSVGElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const deletePathSVG: SVGPathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        li.append(todoLeft, todoRight);
        todoLeft.append(todoCheck, todoLabel);
        todoLabel.append(checkboxSVG, todoText);
        checkboxSVG.append(customSVGCheckBox, customSVGCheck);
        todoText.append(todoTitle, todoDescription);
        todoRight.append(starBtn, editBtn, deleteBtn);
        starBtn.append(starSVG);
        starSVG.append(starPathSVG);
        editBtn.append(editSVG);
        editSVG.append(editPathSVG);
        deleteBtn.append(deleteSVG);
        deleteSVG.append(deletePathSVG);

        li.setAttribute("class", "todo");
        todoLeft.setAttribute("class", "todo-left");
        todoCheck.setAttribute("type", "checkbox");
        todoCheck.setAttribute("aria-label", "todo");
        todoCheck.setAttribute("id", todo.id);
        todoLabel.setAttribute("for", todo.id);
        checkboxSVG.setAttribute("width", "40");
        checkboxSVG.setAttribute("height", "39");
        checkboxSVG.setAttribute("viewBox", "0 0 56 56");
        checkboxSVG.setAttribute("fill", "none");
        customSVGCheckBox.setAttribute("class", "checkbox");
        customSVGCheckBox.setAttribute(
            "d",
            "M10 1H46C50.9706 1 55 5.02944 55 10V46C55 50.9706 50.9706 55 46 55H10C5.02944 55 1 50.9706 1 46V10C1 5.02944 5.02944 1 10 1Z"
        );
        customSVGCheckBox.setAttribute("stroke", "#181818");
        customSVGCheckBox.setAttribute("stroke-width", "2");
        customSVGCheck.setAttribute("class", "check");
        customSVGCheck.setAttribute("d", "M11.5 28.5L25.5 39L45 14.5");
        customSVGCheck.setAttribute("stroke", "#181818");
        customSVGCheck.setAttribute("stroke-width", "2");
        todoText.setAttribute("class", "todo-text");
        todoTitle.textContent = todo.title;
        todoDescription.textContent = todo.description;
        todoRight.setAttribute("class", "todo-right");
        starBtn.setAttribute("type", "button");
        starBtn.setAttribute("aria-label", "star-icon");
        starBtn.setAttribute("class", "star-icon");
        starSVG.setAttribute("width", "40");
        starSVG.setAttribute("height", "39");
        starSVG.setAttribute("viewBox", "0 0 40 39");
        starSVG.setAttribute("fill", "none");
        starSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        starPathSVG.setAttribute("stroke", "#181818");
        starPathSVG.setAttribute("stroke-width", "2");
        starPathSVG.setAttribute(
            "d",
            "M13.3275 12.7685L13.8509 12.6911L14.0814 12.2149L19.2753 1.48436L19.2755 1.48378C19.3456 1.33881 19.4527 1.21953 19.5822 1.13735C19.7116 1.05529 19.8591 1.01282 20.0081 1.01282C20.1572 1.01282 20.3047 1.05529 20.434 1.13735C20.5636 1.21953 20.6707 1.33881 20.7407 1.48378L20.7409 1.48424L25.933 12.2148L26.1634 12.691L26.6867 12.7684L38.3015 14.4875L38.3018 14.4876C38.4418 14.5083 38.5758 14.5666 38.6897 14.6589C38.8038 14.7513 38.8939 14.8746 38.9488 15.0178C39.0037 15.161 39.0206 15.3175 38.9972 15.4706C38.975 15.6153 38.9179 15.7503 38.8328 15.8637L38.7338 15.9737L30.3359 24.3081L29.9682 24.673L30.0542 25.1839L32.0403 36.9819L32.0404 36.9823C32.0662 37.1355 32.0516 37.2927 31.9984 37.4374C31.9452 37.5819 31.8562 37.707 31.7427 37.8012C31.6294 37.8952 31.4954 37.9553 31.3551 37.9775C31.2223 37.9985 31.0862 37.9852 30.959 37.9382L30.8325 37.8789L20.4924 32.3223L20.0196 32.0682L19.5465 32.3218L9.1588 37.8913L9.15842 37.8915C9.03103 37.9599 8.88955 37.9918 8.74812 37.9855C8.60667 37.9791 8.46801 37.9345 8.34631 37.8545C8.22444 37.7743 8.12326 37.661 8.05525 37.5243C7.99059 37.3943 7.95871 37.2487 7.9634 37.1014L7.98019 36.9564L9.96028 25.1837L10.0462 24.673L9.67862 24.3081L1.26431 15.9558L1.26339 15.9549C1.15797 15.8505 1.07978 15.7176 1.03902 15.5687C0.998237 15.4198 0.996932 15.2621 1.03529 15.1124C1.07362 14.9628 1.14968 14.8284 1.2535 14.7221C1.3514 14.6219 1.47056 14.55 1.5992 14.511L1.74143 14.4815L13.3275 12.7685Z"
        );
        editBtn.setAttribute("type", "button");
        editBtn.setAttribute("aria-label", "edit-icon");
        editSVG.setAttribute("width", "36");
        editSVG.setAttribute("height", "37");
        editSVG.setAttribute("viewBox", "0 0 36 37");
        editSVG.setAttribute("fill", "none");
        editSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        editPathSVG.setAttribute("fill", "#181818");
        editPathSVG.setAttribute(
            "d",
            "M35.4225 8.30843C36.2024 7.50687 36.2024 6.17095 35.4225 5.4105L30.7432 0.601166C30.0033 -0.200389 28.7035 -0.200389 27.9236 0.601166L24.2441 4.36231L31.743 12.0696M0.00744629 29.2927V37H7.50641L29.6233 14.2482L22.1244 6.5409L0.00744629 29.2927Z"
        );

        editBtn.addEventListener("click", () => redirectToEditPage(todo.id));

        deleteBtn.setAttribute("type", "button");
        deleteBtn.setAttribute("aria-label", "delete-icon");
        deleteSVG.setAttribute("width", "32");
        deleteSVG.setAttribute("height", "37");
        deleteSVG.setAttribute("viewBox", "0 0 32 37");
        deleteSVG.setAttribute("fill", "none");
        deleteSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        deletePathSVG.setAttribute("fill", "#181818");
        deletePathSVG.setAttribute(
            "d",
            "M6 37C4.9 37 3.95867 36.5978 3.176 35.7934C2.39333 34.989 2.00133 34.0208 2 32.8889V6.16667H0V2.05556H10V0H22V2.05556H32V6.16667H30V32.8889C30 34.0194 29.6087 34.9876 28.826 35.7934C28.0433 36.5992 27.1013 37.0014 26 37H6ZM10 28.7778H14V10.2778H10V28.7778ZM18 28.7778H22V10.2778H18V28.7778Z"
        );

        deleteBtn.addEventListener("click", () => handleDeleteTodo(todo.id));
        if (todoList) {
            todoList.append(li);
        }
    });
}

function redirectToEditPage(IDToEdit: string): void {
    window.location.href = `edit.html?id=${IDToEdit}`;
}

// function to perform Delete operation
function handleDeleteTodo(todoID: string) {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/todos/${todoID}`, true);

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Todo deleted");

            fetchTodos();
        } else {
            console.error("Failed to delete todo:", xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error("Network error while deleting todo");
    };

    xhr.send();
}
