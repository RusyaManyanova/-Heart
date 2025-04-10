// Проверка доступности localStorage
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

if (!isLocalStorageAvailable()) {
    alert('Ваш браузер не поддерживает localStorage.');
}

// Основные функции
function saveAd(title, description, imageUrl = '') {
    try {
        const currentUserPhone = localStorage.getItem('currentUserPhone');

        const finalImageUrl = uploadedImageUrl || imageUrl;
        const ad = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            imageUrl: finalImageUrl || './public/external/default-image.png',
            date: new Date().toLocaleDateString('ru-RU'),
            createdAt: new Date().getTime(),
            authorPhone: currentUserPhone,
            responses: [] // Инициализируем пустой массив для откликов
        };

        const ads = JSON.parse(localStorage.getItem('ads')) || [];
        ads.unshift(ad); // Добавляем в начало массива
        localStorage.setItem('ads', JSON.stringify(ads));

        console.log('Объявление сохранено:', ad);
        window.location.href = "../untitled-html (2)/index (2).html"; 
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка при сохранении объявления: ' + error.message);
    }
}

function displayAds() {
    const adsContainer = document.getElementById('ads-container');
    if (!adsContainer) return;

    const dynamicAds = adsContainer.querySelectorAll('.dynamic-ad');
    dynamicAds.forEach(ad => ad.remove());

    const ads = JSON.parse(localStorage.getItem('ads')) || [];
    console.log('Загружено объявлений:', ads.length);

    if (ads.length === 0) {
        const noAds = document.createElement('div');
        noAds.className = 'no-ads-message';
        noAds.textContent = 'Объявлений пока нет. Будьте первым!';
        adsContainer.insertBefore(noAds, adsContainer.querySelector('.desktop3-container2'));
        return;
    }

    const tempContainer = document.createElement('div');

    ads.forEach(ad => {
        const adElement = document.createElement('div');
        adElement.className = 'desktop3-component8 dynamic-ad';
        adElement.dataset.adId = ad.id;
        adElement.innerHTML = `
            <img src="public/external/rectangle4i327-6vw-800w.png" alt="Фон" class="desktop3-rectangle43">
            <img src="${ad.imageUrl || './public/external/default-image.png'}" 
                 alt="Иконка" 
                 class="desktop3-image3">
            <span class="desktop3-text18">${ad.title}</span>
            <span class="desktop3-text-date">${ad.date}</span>
            <button class="desktop3-component35" onclick="goToAdDetails(${ad.id})">
                <img src="./public/external/pod.png" alt="Подробнее" class="desktop3-rectangle35">
            </button>
            <button class="desktop3-component36" onclick="respondToAd(${ad.id})">
                <img src="./public/external/otk.png" alt="Отклик" class="desktop3-rectangle36">
            </button>
            <button class="delete-ad-btn" onclick="deleteAd(${ad.id})" title="Удалить объявление">
                ×
            </button>
            <button onclick="showAdResponses(${ad.id})" class="view-responses-btn">
            Показать отклики(${ ad.responses?.length || 0 })
            </button>
        `;
        tempContainer.appendChild(adElement);
    });

    const addButton = adsContainer.querySelector('.desktop3-container2');
    adsContainer.insertBefore(tempContainer, addButton);
}

function updateContainerHeight() {
    const adsContainer = document.getElementById('ads-container');
    if (!adsContainer) return;
    adsContainer.style.minHeight = 'auto';
}

// Новая функция для удаления объявлений
window.deleteAd = function (adId) {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
        try {
            let ads = JSON.parse(localStorage.getItem('ads')) || [];
            ads = ads.filter(ad => ad.id !== adId);
            localStorage.setItem('ads', JSON.stringify(ads));
            displayAds();
            console.log('Объявление удалено:', adId);
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Не удалось удалить объявление');
        }
    }
};

function setupEventListeners() {
    const adForm = document.getElementById('ad-form');
    if (adForm) {
        adForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = document.getElementById('ad-title').value;
            const description = document.getElementById('ad-description').value;

            if (title && description) {
                saveAd(title, description);
            } else {
                alert('Заполните все обязательные поля!');
            }
        });
    }
}

function saveResponse(adId, responderPhone) {
    try {
        const ads = JSON.parse(localStorage.getItem('ads')) || [];

        const ad = ads.find(a => a.id === adId);

        if (ad) {
            if (!ad.responses) ad.responses = [];

            ad.responses.push(responderPhone);

            localStorage.setItem('ads', JSON.stringify(ads));
            console.log('Отклик сохранен:', { adId, responderPhone });
        } else {
            console.error('Объявление не найдено');
        }
    } catch (error) {
        console.error('Ошибка сохранения отклика:', error);
    }
}

function showAdResponses(adId) {
    const ads = JSON.parse(localStorage.getItem('ads')) || [];
    const ad = ads.find(a => a.id === adId);

    if (!ad) return;

    if (ad.responses?.length > 0) {
        const responsesList = ad.responses.map(phone => `• ${phone}`).join('\n');
        alert(`Отклики на "${ad.title}":\n${responsesList}`);
    } else {
        alert('На это объявление пока нет откликов');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('ads-container')) {
        displayAds();
    }

    setupEventListeners();
});

window.goToAdDetails = function (adId) {
    const ads = JSON.parse(localStorage.getItem('ads')) || [];
    const ad = ads.find(item => item.id === adId);

    if (!ad) {
        alert('Объявление не найдено');
        return;
    }

    sessionStorage.setItem('currentAd', JSON.stringify(ad));
    window.location.href = '../untitled-html (3)/ad-details.html';
};

window.respondToAd = async function (adId) {
    try {
        const currentUserPhone = localStorage.getItem('currentUserPhone');

        if (!currentUserPhone) {
            alert('Вы не авторизованы! Пожалуйста, войдите.');
            return;
        }

        saveResponse(adId, currentUserPhone);

        alert(`Ваш отклик успешно отправлен!\nНомер: ${currentUserPhone} будет передан автору.`);

    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при отправке отклика');
    }
};

let uploadedImageUrl = '';

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert('Пожалуйста, выберите файл изображения (JPEG, PNG и т.д.)');
        return;
    }

    // Проверяем размер файла (например, не более 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        uploadedImageUrl = e.target.result;
        const defaultImage = document.querySelector('.frame11-image2svginput');
        if (defaultImage) {
            defaultImage.src = uploadedImageUrl;
        }
    };

    reader.onerror = function () {
        alert('Ошибка при загрузке изображения');
    };

    reader.readAsDataURL(file);
}