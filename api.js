const url_api = "https://rickandmortyapi.com/api/character";

// 1. VARIABLES GLOBALES: Para guardar datos y bloquear clics dobles
let datosEnMemoria = []; 
let cargando = false; 

async function requestData(url_api, page = 1) {
    if (cargando) return;
    cargando = true;

    // 1. Prendemos el Loading
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";
    document.getElementById("character").style.opacity = "0.5";

    try {
        const response = await axios.get(url_api);
        let data = response.data;

        // 2. Usamos el temporizador sencillo
        setTimeout(function() {
            // Todo lo que pongas aquí adentro pasará después de 1 segundo
            datosEnMemoria = data.results;
            document.getElementById("gender-filter").value = "";

            getElementButton(document, 'set', data.info, page, data.info.pages);
            renderHtml(datosEnMemoria);

            // 3. Apagamos el Loading y regresamos la opacidad
            loadingElement.style.display = "none";
            document.getElementById("character").style.opacity = "1";
            cargando = false; 

        }, 1000); // 1000 milisegundos = 1 segundo

    } catch (error) {
        console.error("Error:", error);
        loadingElement.style.display = "none";
        cargando = false;
    }
    // Nota: Quitamos el 'finally' para que el 'cargando = false' ocurra 
    // solo cuando pase el segundo del temporizador.
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

    // Aquí llamamos a getElementButton pasándole el nuevo número de página
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
        const nextUrl = nextBtn.getAttribute("data-next");
        // IMPORTANTE: Aquí llamamos a requestData, que es quien activa el Loading
        if (nextUrl !== "") requestData(nextUrl, page);

    } else if (operation == 'prev') {
        const prevUrl = prevBtn.getAttribute("data-prev");
        // IMPORTANTE: Aquí llamamos a requestData, que es quien activa el Loading
        if (prevUrl !== "") requestData(prevUrl, page);
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
