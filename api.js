const url_api = "https://rickandmortyapi.com/api/character";

// 1. VARIABLES GLOBALES: Para guardar datos y bloquear clics dobles
let datosEnMemoria = []; 
let cargando = false; 

async function requestData(url_api, page = 1) {
    if (cargando) return; // Bloquea si ya se está cargando una página
    cargando = true;

    try {
        const response = await axios.get(url_api);
        let data = response.data;
        
        // Guardamos los personajes en memoria
        datosEnMemoria = data.results;

        // Limpiamos el selector de filtro al cambiar de página
        document.getElementById("gender-filter").value = "";

        getElementButton(document, 'set', data.info, page, data.info.pages);
        renderHtml(datosEnMemoria); 

    } finally {
        cargando = false; // Liberamos el bloqueo
    }
}

// 2. FILTRO: Usando función tradicional
document.getElementById("gender-filter").addEventListener("change", function(e) {
    const generoSeleccionado = e.target.value;

    if (generoSeleccionado === "") {
        renderHtml(datosEnMemoria);
    } else {
        // Creamos una lista nueva con los que coinciden
        const filtrados = datosEnMemoria.filter(function(personaje) {
            return personaje.gender === generoSeleccionado;
        });
        renderHtml(filtrados);
    }
});

function loadMore(direction) {
    let pageText = document.getElementById("pageId").innerText;
    let partes = pageText.split(" "); 
    let currentPage = parseInt(partes[1]); 

    if (direction === 'next') {
        getElementButton(document, 'next', null, currentPage + 1);
    } else {
        getElementButton(document, 'prev', null, currentPage - 1);
    }
}

function getElementButton(elementButton, operation = 'next', info = null, page = 1, totalPages = 42) {
    const nextBtn = elementButton.getElementById("loadMore");
    const prevBtn = elementButton.getElementById("loadLess");
    const pageIndicator = elementButton.getElementById("pageId");

    if (operation == 'set') {
        nextBtn.setAttribute("data-next", (info.next == null) ? '' : info.next);
        prevBtn.setAttribute("data-prev", (info.prev == null) ? '' : info.prev);
        nextBtn.disabled = (info.next == null);
        prevBtn.disabled = (info.prev == null);
        pageIndicator.innerText = `Página ${page} de ${totalPages}`;

    } else if (operation == 'next') {
        const next = nextBtn.getAttribute("data-next");
        if (next !== "") requestData(next, page);

    } else if (operation == 'prev') {
        const prev = prevBtn.getAttribute("data-prev");
        if (prev !== "") requestData(prev, page);
    }
}

// 3. RENDER: Recibe la lista de personajes
function renderHtml(personajes) {
    let element = document.getElementById("character");
    let htmlContent = ""; 
    
    // Usamos un for tradicional para recorrer la lista
    for (let i = 0; i < personajes.length; i++) {
        let character = personajes[i];
        htmlContent += "<li>" +
            "<img src='" + character.image + "' alt='" + character.name + "'>" +
            "<h2>" + character.name + "</h2>" +
            "<span>" + character.gender + "</span>" +
            "</li>";
    }
    element.innerHTML = htmlContent;
}

requestData(url_api, 1);
