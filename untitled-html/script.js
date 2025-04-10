document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // �������� ������ �� �����
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

        // ��������� ������ ������
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '������ �����');
        }

        // �������� ������ ������ ���� ����� ��������
        const data = await response.json();

        // ���������, ��� data �������� phone (�� ������ ������)
        if (!data.phone) {
            throw new Error('������ �� ������ ����� ��������');
        }

        // ��������� ����� �������� � localStorage
        localStorage.setItem('currentUserPhone', data.phone);
        console.log('������� ������������ ��������:', data.phone); // ��� �������

        // �������������� �� ������� ��������
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            throw new Error('�� ������ redirectUrl');
        }
    } catch (error) {
        console.error('������ �����:', error);
        alert('������: ' + error.message);
    }
});