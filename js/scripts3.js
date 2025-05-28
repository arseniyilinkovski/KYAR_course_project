// Код выполняется, когда весь HTML-документ загружен и разобран браузером.
document.addEventListener('DOMContentLoaded', function () {
    // Получаем кнопку из секции формы (поиск по селектору "note-section button")
    const formButton = document.querySelector('.support-section button');

    // Получаем модальное окно, которое будет отображаться при успешной отправке
    const modal = document.getElementById('successModal');

    // Получаем кнопку закрытия модального окна (крестик)
    const closeBtn = document.querySelector('.modal-content .close-modal');

    // Добавляем обработчик клика на кнопку формы
    formButton.addEventListener('click', async function () {
        // Считываем значения полей ввода и убираем лишние пробелы
        const rec = document.querySelector('.form input').value.trim();
        

        // Проверка: если хотя бы одно поле не заполнено — выводим предупреждение
        if (!rec) {
            alert("Пожалуйста, заполните все поля формы.");
            return; // Прерываем выполнение функции
        }

        // Формируем объект с данными формы
        const data = { rec };

        // Отправляем данные на сервер
        await saveRegistrationToServer(data);
    });

    // Обработчик нажатия на крестик — скрываем модальное окно
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Обработчик клика вне модального окна — также скрываем его
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});


// Асинхронная функция для отправки данных формы на сервер
async function saveRegistrationToServer(data) {
    try {
        // Отправляем POST-запрос с JSON-данными
        const response = await fetch('http://127.0.0.1:8000/api/save-recomendations', {
            method: 'POST', // Метод запроса
            headers: {
                'Content-Type': 'application/json' // Указываем тип данных
            },
            body: JSON.stringify(data) // Преобразуем объект в строку JSON
        });

        // Преобразуем ответ сервера в объект
        const result = await response.json();

        // Проверяем: если ответ успешный и статус "success" — показываем модалку
        if (response.ok && result.status === "success") {

            const modal = document.getElementById('successModal');
            modal.style.display = 'flex'; // Показываем модальное окно
        } else {
            // Если ошибка на сервере — выводим сообщение
            alert("Ошибка при отправке: " + (result.message || 'Неизвестная ошибка'));
        }
    } catch (error) {
        // Если не удалось установить соединение с сервером — выводим ошибку
        console.error("Ошибка при сохранении:", error);
        alert("Ошибка соединения с сервером.");
    }
}
