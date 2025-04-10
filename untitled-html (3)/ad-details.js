// ������� ��� ������������� HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ������� ����������� ����������
function renderAd(ad) {
    const container = document.getElementById('ad-container');

    let imageUrl = ad.imageUrl || 'public/external/default-image.png';

    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = window.location.pathname.replace(/\/[^/]*$/, '/') + imageUrl;
    }

    container.innerHTML = `
        <div class="frame10-frame10">
            <div class="frame10-frame15">
                <div class="frame10-frame14">
                    <div class="frame10-frame11">
                        <span class="frame10-text1">${escapeHtml(ad.title)}</span>
                    </div>
                    <div class="frame10-frame13">
                        <img src="${ad.imageUrl || './public/external/default-image.png'}" 
                             alt="����������� ����������" 
                             class="frame10-image2svg"
                             onerror="this.onerror=null;this.src='public/external/default-image.png'">
                        <div class="frame10-frame12">
                            <span class="frame10-text2">${escapeHtml(ad.description)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="frame10-image3button" onclick="goToNextPage()">
                <img src="public/external/image3i109-w6rm-200h.png"
                     alt="�����"
                     class="frame10-image3"
                     onerror="this.style.display='none'">
            </button>

            <img src="public/external/frame4svg1091-xysi.svg"
                 alt="������������ �������"
                 class="frame10-frame4svg"
                 onerror="this.style.display='none'">
                 
            <button class="frame10-component3button" onclick="respondToAd(${ad.id})">
            <img src="public/external/rectangle.png"
                 alt="������������"
                 class="frame10-rectangle3"
                 onerror="this.style.display='none'">
            <span>������������</span>
        </button>
        </div>
    `;
}

window.respondToAd = async function () {
    try {
        // 1. �������� ������� ���������� �� sessionStorage
        const adData = sessionStorage.getItem('currentAd');
        if (!adData) throw new Error('���������� �� �������');

        const ad = JSON.parse(adData);

        // 2. �������� ������� �������� ������������
        const currentUserPhone = localStorage.getItem('currentUserPhone');
        if (!currentUserPhone) {
            alert('�� �� ������������! ����������, ������� � �������.');
            return;
        }

        // 3. ��������� ������ (���������� script_ad.js)
        const ads = JSON.parse(localStorage.getItem('ads')) || [];
        const targetAd = ads.find(a => a.id === ad.id);

        if (targetAd) {
            if (!targetAd.responses) targetAd.responses = [];
            targetAd.responses.push(currentUserPhone);
            localStorage.setItem('ads', JSON.stringify(ads));

            // 4. ���������� �����������
            alert('\u0412\u0430\u0448 \u043E\u0442\u043A\u043B\u0438\u043A \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D!\n\u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440: ' + currentUserPhone);
        } else {
            throw new Error('���������� �� ������� � ����');
        }
    } catch (error) {
        console.error('������ ��� �������:', error);
        alert('������: ' + error.message);
    }
};
function goToNextPage() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        try {
            const adData = sessionStorage.getItem('currentAd');
            if (!adData) throw new Error('������ ���������� �� �������');

            const ad = JSON.parse(adData);
            if (!ad.title || !ad.description) {
                throw new Error('������������ ������ ����������');
            }

            renderAd(ad);
        } catch (error) {
            console.error('������:', error);
            showError(error.message);
        }
    }, 100);
});

window.onbeforeunload = function (e) {
    if (!sessionStorage.getItem('adLoaded')) {
        e.preventDefault();
        return e.returnValue = '�� �������, ��� ������ ����? ������ ����� ���� ��������.';
    }
};

sessionStorage.setItem('adLoaded', 'true');