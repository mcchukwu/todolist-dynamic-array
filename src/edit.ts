import { handleKeyEvent } from "./main.ts";

document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.querySelector<HTMLFormElement>(".update-form");
    const editTitleField = document.querySelector<HTMLInputElement>(
        ".update-form .title-field"
    );
    const editDescriptionField = document.querySelector<HTMLInputElement>(
        ".update-form .description-field"
    );

    const urlParams: URLSearchParams = new URLSearchParams(
        window.location.search
    );

    const todoID: string | null = urlParams.get("id");

    if (todoID && editTitleField && editDescriptionField) {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("GET", `http://localhost:3000/todos/${todoID}`, true);

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const todo: Todo = JSON.parse(xhr.responseText);

                    if (editTitleField && editDescriptionField) {
                        editTitleField.value = todo.title;
                        editDescriptionField.value = todo.description || "";
                    }
                } catch (error) {
                    console.error("Error parsing JSON", error);
                    console.log("Actual response", xhr.responseText);
                }
            } else {
                console.error("Failed to load todo:", xhr.status);
            }
        };

        xhr.onerror = () => {
            console.log("Failed to access todo database");
        };

        xhr.send();

        if (updateForm) {
            updateForm.addEventListener("keydown", handleKeyEvent);

            updateForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const updatedTodo = {
                    title: editTitleField.value,
                    description: editDescriptionField.value,
                };

                const xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.open(
                    "PATCH",
                    `http://localhost:3000/todos/${todoID}`,
                    true
                );
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        window.location.href = "index.html";
                    } else {
                        console.error("Failed to update todo:", xhr.statusText);
                    }
                };

                xhr.onerror = () => {
                    console.error("Network error while updating todo");
                };

                xhr.send(JSON.stringify(updatedTodo));
            });
        }
    }
});
