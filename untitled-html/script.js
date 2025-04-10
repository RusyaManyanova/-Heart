document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Получаем данные из формы
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password }),
        });

        // Проверяем статус ответа
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка входа');
        }

        // Получаем данные только если ответ успешный
        const data = await response.json();

        // Проверяем, что data содержит phone (на всякий случай)
        if (!data.phone) {
            throw new Error('Сервер не вернул номер телефона');
        }

        // Сохраняем номер телефона в localStorage
        localStorage.setItem('currentUserPhone', data.phone);
        console.log('Текущий пользователь сохранен:', data.phone); // Для отладки

        // Перенаправляем на целевую страницу
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            throw new Error('Не указан redirectUrl');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        alert('Ошибка: ' + error.message);
    }
});