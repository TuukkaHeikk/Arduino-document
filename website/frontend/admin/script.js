function changeSetting(event, user, button) {
    try {
        const settingId = parseInt(button.dataset.id);
        const current = button.textContent === "true";  // muuta buttonin value booleaniksi, ei tule toimimaan jos buttonin teksti ei ole true / false
        const value = !current;

        console.log('user:', user);
        console.log('button:', button);
        fetch(`/api/admin/setting`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                userId: user.id,
                settingId: settingId, // integer
                value: value   // true vai false, boolean
            })
        })
            .then(res => {
                if (res.status === 200) {
                    console.log('VALUEN VALUE: ', value);
                    const newValue = String(value);
                    console.log('newValue: ', newValue);
                    button.textContent = newValue;
                }
            })
            .catch(error => console.error(error))
    } catch (error) {
        console.error(error);
    }

}

function handleClick(event, user) {
    // Poista vanha menu jos on
    const oldMenu = document.getElementById("dynamic-menu");
    if (oldMenu) oldMenu.remove();

    // Luo menu
    const menu = document.createElement("div");
    menu.className = 'menu'
    menu.id = "dynamic-menu";
    menu.style.position = "fixed";
    menu.style.bottom = "20px";
    menu.style.left = "20px";
    menu.style.background = "#6b6b6bff";
    menu.style.border = "1px solid #ccc";
    menu.style.padding = "8px";
    menu.style.borderRadius = "5px";
    menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    menu.style.zIndex = 9999;
    menu.style.minWidth = "200px";
    menu.style.maxWidth = "300px";

    options = Object.entries(user.settings);
    console.log('options!', options);

    options.forEach(setting => {
        const item = document.createElement("h2");
        item.textContent = setting[1].displayName;
        //console.log('item.textcontent', key);

        const val = document.createElement("button");
        val.type = "button"
        val.textContent = setting[1].value;
        val.dataset.id = setting[1].id;
        val.addEventListener('click', (e) => {
            changeSetting(e, user, val);
        })
        menu.appendChild(item);
        menu.appendChild(val);

    });
    document.body.appendChild(menu);

}

// TODO: Nyt kuka vain voi hakea http://localhost:3000/api/admin ja nähdä kaikki käyttäjät ja asetukset.
//       Tämä täytyy välttää.
fetch('/api/admin')
    .then(res => res.json())
    .then(users => {
        const ul = document.getElementById('user-list');
        console.log('USERSSIT', users);
        for (const id in users) {
            if (users.hasOwnProperty(id)) {
                const user = users[id];
                const li = document.createElement('li');
                li.textContent = `${user.name}`;

                console.log('user', user);

                li.onclick = (evt) => {
                    document.querySelectorAll(".selected").forEach(el =>
                        el.classList.remove("selected")
                    );
                    li.classList.add("selected");

                    handleClick(evt, user)
                }
                ul.appendChild(li);
            }
        }
    })
    .catch(error => console.error('Error fetching users:', error));
