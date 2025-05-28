  // Код выполняется, когда весь HTML-документ загружен и разобран браузером.
  document.addEventListener('DOMContentLoaded', function () {
      // Получаем кнопку из секции формы (поиск по селектору "note-section button")
      const formButton = document.querySelector('.note-section button');

      // Получаем модальное окно, которое будет отображаться при успешной отправке
      const modal = document.getElementById('successModal');

      // Получаем кнопку закрытия модального окна (крестик)
      const closeBtn = document.querySelector('.modal-content .close-modal');

      // Добавляем обработчик клика на кнопку формы
      formButton.addEventListener('click', async function () {
          // Считываем значения полей ввода и убираем лишние пробелы
          const name = document.querySelector('.name-container input').value.trim();
          const phone = document.querySelector('.telephone_number-container input').value.trim();
          const email = document.querySelector('.email-container input').value.trim();
          const difficulty = document.getElementById('categories').value;

          // Проверка: если хотя бы одно поле не заполнено — выводим предупреждение
          if (!name || !phone || !email || !difficulty) {
              alert("Пожалуйста, заполните все поля формы.");
              return; // Прерываем выполнение функции
          }

          // Формируем объект с данными формы
          const data = { name, phone, email, difficulty };

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
        const response = await fetch('http://127.0.0.1:8000/api/save-registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
            const modal = document.getElementById('successModal');
            modal.style.display = 'flex'; // Показываем модальное окно
        } else {
            alert("Ошибка при отправке: " + (result.message || 'Неизвестная ошибка'));
        }
    } catch (error) {
        console.error("Ошибка при сохранении:", error);
        alert("Ошибка соединения с сервером.");
    }
}


// Обработчик клика вне модального окна — также скрываем его
window.addEventListener('click', function (event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});







 document.addEventListener('DOMContentLoaded', function() {
      function isMobile() {
        return window.innerWidth <= 950;
      }
      
      const slides = document.querySelectorAll('.difficulty-section .cards-container .slider-track .card');
      let currentIndex = 0;
      const btnLeft = document.querySelector('.difficulty-section .cards-container .slider-btn.left');
      const btnRight = document.querySelector('.difficulty-section .cards-container .slider-btn.right');
      const duration = 300; 
      
      function showSlide(newIndex) {
        if (newIndex === currentIndex) return;
        const currentCard = slides[currentIndex];
        const nextCard = slides[newIndex];
        
        if (isMobile()) {
          currentCard.style.transition = `opacity ${duration}ms ease`;
          currentCard.style.opacity = 0;
          
          setTimeout(() => {
            currentCard.classList.remove('active');
            currentCard.style.display = 'none';

            nextCard.style.display = 'flex';
            nextCard.style.opacity = 0;
            nextCard.style.transition = `opacity ${duration}ms ease`;
              nextCard.style.opacity = 1;
              nextCard.classList.add('active');
              currentIndex = newIndex;
          }, duration);
        } else {
          slides.forEach(slide => slide.classList.remove('active'));
          slides[newIndex].classList.add('active');
          currentIndex = newIndex;
        }
      }
      
      if (btnRight) {
        btnRight.addEventListener('click', function() {
          if (!isMobile()) return;
          let nextIndex = (currentIndex + 1) % slides.length;
          showSlide(nextIndex);
        });
      }
      
      if (btnLeft) {
        btnLeft.addEventListener('click', function() {
          if (!isMobile()) return;
          let nextIndex = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(nextIndex);
        });
      }
    });
    document.addEventListener("DOMContentLoaded", function() {
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => {
        card.addEventListener("click", function() {
          card.classList.toggle("clicked");
        });
      });
    });