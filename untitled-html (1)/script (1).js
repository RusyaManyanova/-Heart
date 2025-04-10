document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    console.log('������������ ������:', { username, phone, password });

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, phone, password }),
        });

        const result = await response.json();

        // ��������������� �� ������ �������� ����� �������� �����������
        if (response.ok) {
            window.location.href = '../untitled-html (2)/index (2).html';
        }
    } catch (error) {
        console.error('������ ��� �������� �������:', error);
        alert('��������� ������ ��� �����������');
    }
});