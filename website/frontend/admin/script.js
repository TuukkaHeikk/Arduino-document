fetch('/api/admin')
    .then(res => res.json())
    .then(users => {
        const ul = document.getElementById('user-list');

        for (const uid in users) {
            if (users.hasOwnProperty(uid)) {
                const user = users[uid];
                const li = document.createElement('li');
                li.textContent = `${user.name}`;
                ul.appendChild(li);
            }
        }
    })
    .catch (error => console.error('Error fetching users:', error));
