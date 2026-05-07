// URL endpoint
const url_api = "https://rickandmortyapi.com/api/character";

/**
requestData
@param {string} url_api
@param {number} page  <-- Nuevo parámetro **/
async function requestData(url_api, page = 1) {
    const response = await axios.get(url_api);
    let data = response.data;
    
    // Le pasamos el número de página a la siguiente función
    getElementButton(document, 'set', data.info, page);
    renderHtml(data);
}

/**
loadMore
@param {string} direction **/
function loadMore(direction) {
    // Obtenemos el número actual que está escrito en el HTML
    let pageText = document.getElementById("pageId").innerText;
    let currentPage = parseInt(pageText.replace("Página: ", ""));

    if (direction === 'next') {
        getElementButton(document, 'next', null, currentPage + 1);
    } else {
        getElementButton(document, 'prev', null, currentPage - 1);
    }
}

/**
getElementButton
@param {object} elementButton
@param {string} operation
@param {object} info
@param {number} page <-- Recibe el número **/
function getElementButton(elementButton, operation = 'next', info = null, page = 1) {
    const nextBtn = elementButton.getElementById("loadMore");
    const prevBtn = elementButton.getElementById("loadLess");
    const pageIndicator = elementButton.getElementById("pageId");

    if (operation == 'set') {
        nextBtn.setAttribute("data-next", (info.next == null) ? '' : info.next);
        prevBtn.setAttribute("data-prev", (info.prev == null) ? '' : info.prev);

        nextBtn.disabled = (info.next == null);
        prevBtn.disabled = (info.prev == null);
        
        // Escribimos el número de página actual en el SPAN
        pageIndicator.innerText = `Página: ${page}`;

    } else if (operation == 'next') {
        const next = nextBtn.getAttribute("data-next");
        if (next !== "") requestData(next, page);

    } else if (operation == 'prev') {
        const prev = prevBtn.getAttribute("data-prev");
        if (prev !== "") requestData(prev, page);
    }
}

/**
renderHtml
@param {object} data**/
function renderHtml(data) {
    let element = document.getElementById("character");
    let htmlContent = ""; 
    
    for (let index = 0; index < data.results.length; index++) {
        let character = data.results[index];
        htmlContent += `<li>
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <span>${character.gender}</span>
            </li>`;
    }
    element.innerHTML = htmlContent;
}

// Empezamos en la página 1
requestData(url_api, 1);