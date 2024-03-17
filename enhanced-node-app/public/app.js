document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerHTML = 'Registration successful! Welcome, ' + data.username;
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = 'Registration failed. Please try again.';
    });
});
