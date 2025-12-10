const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/users/${id}`)
    .then(response => response.json())
    .then(res => {
        console.log('json settings: ', res);
        displayValues(res);
    })
    .catch(error => console.error(error));


async function displayValues(data) {
    const container = document.getElementById('data');
    Object.values(data).forEach((item) => {
        const floatValue = parseFloat(item.value);
        const fixedValue = floatValue.toFixed(1);

        const template = document.createElement('h2');
        template.textContent = `${item.displayName} : ${fixedValue}${item.symbol}`;
        container.appendChild(template);
    })
}