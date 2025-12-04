const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/users/${id}`)
    .then(res => {
        console.log('json settings: ', res);
        return res.json();
    })
    .then(settings => {
            console.log('settings: ', settings);
        })
    .catch(error => console.error(error));
