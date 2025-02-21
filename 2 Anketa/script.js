document.addEventListener("DOMContentLoaded", () => {
    // Проверяем, что мы на second_page.html
    if (window.location.pathname.includes("second_page.html")) {
        const params = new URLSearchParams(window.location.search);

        // Заполняем текстовые поля
        document.getElementById("surname").textContent = params.get("surname") || "";
        document.getElementById("fullName").textContent = params.get("fullName") || "";
        document.getElementById("dob").textContent = params.get("dob") || "";
        document.getElementById("birthPlace").textContent = params.get("birthPlace") || "";
        document.getElementById("nationality").textContent = params.get("nationality") || "";
        document.getElementById("passport").textContent = params.get("passport") || "";
        document.getElementById("passportIssue").textContent = params.get("passportIssue") || "";
        document.getElementById("passportExpiry").textContent = params.get("passportExpiry") || "";
        document.getElementById("email").textContent = params.get("email") || "";
        document.getElementById("phone").textContent = params.get("phone") || "";
        document.getElementById("purpose").textContent = params.get("purpose") || "";

        // Поля "Адрес" и "Доп. информация" разбиваем на строки
        fillMultiLineField("address", params.get("address") || "", 2);
        fillMultiLineField("additionalInfo", params.get("additionalInfo") || "", 4);

        // Получаем фото из localStorage и вставляем в блок #photo
        const photoData = localStorage.getItem("photoData");
        if (photoData) {
            // ВАЖНО: используем id="photo" (со второй страницы), а не "photoBox"
            document.getElementById("photo").innerHTML =
                `<img src="${photoData}" width="110" height="140" style="object-fit: cover;">`;
        }
    }
});

// Функция для проверки заполнения формы и загрузки фото
function submitForm() {
    const form = document.getElementById("visaForm");
    const inputs = form.querySelectorAll("input[required], select[required]");
    let isValid = true;

    // Проверяем все поля на первой странице
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.border = "2px solid red";
        } else {
            input.style.border = "1px solid #ccc";
        }
    });

    if (!isValid) {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
    }

    // Проверка загрузки фото (файл-инпут теперь #photoFile)
    const fileInput = document.getElementById("photoFile");
    if (!fileInput || fileInput.files.length === 0) {
        alert("Пожалуйста, загрузите фотографию.");
        return;
    }

    // Читаем файл через FileReader, сохраняем в localStorage и переходим на вторую страницу
    const reader = new FileReader();
    reader.onload = function(event) {
        localStorage.setItem("photoData", event.target.result);
        const formData = new FormData(form);
        let queryString = new URLSearchParams(formData).toString();
        window.location.href = "second_page.html?" + queryString;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// Функция для распределения длинного текста по строкам (если нужно)
function fillMultiLineField(fieldId, text, maxLines) {
    const words = text.split(" ");
    const field = document.getElementById(fieldId);
    const lineElements = field.parentElement.querySelectorAll(".line");

    let currentLine = "";
    let lineIndex = 0;

    // Очищаем строки перед заполнением
    lineElements.forEach(line => (line.textContent = ""));

    words.forEach(word => {
        // Если длина строки с добавленным словом > 30 символов — переносим на новую
        if ((currentLine + " " + word).length > 30 && lineIndex < maxLines - 1) {
            lineElements[lineIndex].textContent = currentLine.trim();
            currentLine = word;
            lineIndex++;
        } else {
            currentLine += " " + word;
        }
    });

    // Заполняем последнюю строку
    if (lineIndex < maxLines) {
        lineElements[lineIndex].textContent = currentLine.trim();
    }
}
