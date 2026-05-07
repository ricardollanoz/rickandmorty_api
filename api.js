// URL endpoint
const url_api = "https://rickandmortyapi.com/api/character";

/**
requestData
Send request to Endpoint
@param {string} url_api**/
async function requestData(url_api) {
    const response = await axios.get(url_api);
    let data = response.data; 
    
    getElementButton(document, 'set', data.info);
    renderHtml(data);
}

/**
loadMore
@param {string} direction **/
function loadMore(direction) {
    getElementButton(document, direction);
}

/**
getElementButton
@param {object} elementButton
@param {string} operation
@param {object} info**/
function getElementButton(elementButton, operation = 'next', info = null) {
    const nextBtn = elementButton.getElementById("loadMore");
    const prevBtn = elementButton.getElementById("loadLess"); // ID actualizado aquí

    if (operation == 'set') {
        // Configuración botón Siguiente
        nextBtn.setAttribute("data-next", (info.next == null) ? '' : info.next);
        nextBtn.disabled = (info.next == null);
        
        // Configuración botón Anterior
        prevBtn.setAttribute("data-prev", (info.prev == null) ? '' : info.prev);
        prevBtn.disabled = (info.prev == null);

    } else if (operation == 'next') {
        const next = nextBtn.getAttribute("data-next");
        if (next !== "") {
            requestData(next);
        }
    } else if (operation == 'prev') {
        const prev = prevBtn.getAttribute("data-prev");
        if (prev !== "") {
            requestData(prev);
        }
    }
}

/**
renderHtml
@param {object} data**/
function renderHtml(data) {
    let element = document.getElementById("character");
    element.innerHTML = ""; // Limpiamos para la nueva página
    
    let resultCount = data.results.length;
    for (let index = 0; index < resultCount; index++) {
        let character = data.results[index];
        element.innerHTML += `<li>
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <span>${character.gender}</span>
            </li>`;
    }
}

requestData(url_api);