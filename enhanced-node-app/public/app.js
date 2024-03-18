document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
    document.getElementById('email').addEventListener('input', validateField);
    document.getElementById('username').addEventListener('input', validateField);
    document.getElementById('password').addEventListener('input', validateField);
});

function validateField(event) {
    const field = event.target;
    const { id, value } = field;
    const errors = validateInput({
        [id]: value
    });
    displayErrors({ [id]: errors[id] });
}

function validateInput({ email, username, password }) {
    let errors = {};

    if (email !== undefined && (!email || !/\S+@\S+\.\S+/.test(email))) {
        errors.email = 'Please enter a valid email address.';
    }
    if (username !== undefined) {
        if (!username) {
            errors.username = 'Please enter a username.';
        } else if (username.length < 4) {
            errors.username = 'Username must be at least 4 characters long.';
        }
    }
    if (password !== undefined) {
        if (!password) {
            errors.password = 'Please enter a password.';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.';
        }
    }

    return errors;
}

function displayErrors(errors) {
    for (let field in errors) {
        const errorElement = document.getElementById(field + 'Error');
        if (errorElement) {
            errorElement.textContent = errors[field] || '';
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    const errors = validateInput(formData);
    if (Object.keys(errors).length === 0) {
        submitForm(formData);
    } else {
        displayErrors(errors);
    }
}

function submitForm({ email, username, password }) {
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed. Please try again.');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('result').innerHTML = 'Registration successful! Welcome, ' + data.username + '.';
        clearForm();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = error.message;
    });
}

function clearForm() {
    document.getElementById('registrationForm').reset();
    ['email', 'username', 'password'].forEach(fieldId => {
        document.getElementById(fieldId + 'Error').textContent = '';
    });
}
