const url_api = "https://rickandmortyapi.com/api/character";

// VARIABLES Para guardar datos y bloquear clics dobles
let datosEnMemoria = [];  
let cargando = false;  // Un interruptor para saber si estamos esperando una respuesta

async function requestData(url_api, page = 1) {
    if (cargando) return;
    cargando = true;

    // Mostramos la señal cargando y ponemos la lista borrosa
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";
    document.getElementById("character").style.opacity = "0.5";

    try {
        // Le pedimos a axios que vaya a la API por la información
        const response = await axios.get(url_api);
        let data = response.data;

        // Usamos temporizador 
        setTimeout(function() {
            // Todo lo que pongas aquí adentro pasará después de 1 segundo
            datosEnMemoria = data.results; // Guardamos los personajes 
            document.getElementById("gender-filter").value = "";
            // Actualizamos los botones de siguiente y la lista de personajes
            getElementButton(document, 'set', data.info, page, data.info.pages);
            renderHtml(datosEnMemoria);

            //Apagamos el loading y regresamos la opacidad
            loadingElement.style.display = "none";
            document.getElementById("character").style.opacity = "1";
            cargando = false; 

        }, 1000); // 1000 milisegundos
        
    } catch (error) {
        console.error("Error:", error);
        loadingElement.style.display = "none";
        cargando = false;
    } // Si algo sale mal, mostramos el error y se limpia todo
}

// FILTRO  por genero
document.getElementById("gender-filter").addEventListener("change", function(e) {
    const generoSeleccionado = e.target.value;

    if (generoSeleccionado === "") {
        renderHtml(datosEnMemoria); // Cuando el filtro es ALL se muestran todos
    } else {
        // Creamos una variable nueva con los que coinciden de cada genero del numero de pagina a mostrar 
        const filtrados = datosEnMemoria.filter(function(personaje) {
            return personaje.gender === generoSeleccionado;
        });
        renderHtml(filtrados); // Mostramos solo esos
    }
});
// FUNCION para cambiar de pagina 
function loadMore(direction) {
    // Leemos el texto que y sacamos solo el número
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
// Funcion para manejar los botones y el indicador de pagina 
function getElementButton(elementButton, operation = 'next', info = null, page = 1, totalPages = 42) {
    const nextBtn = elementButton.getElementById("loadMore");
    const prevBtn = elementButton.getElementById("loadLess");
    const pageIndicator = elementButton.getElementById("pageId");
    
    if (operation == 'set') {
        nextBtn.setAttribute("data-next", (info.next == null) ? '' : info.next);
        prevBtn.setAttribute("data-prev", (info.prev == null) ? '' : info.prev);
         // si estamos en la primera pagina o en la ultima, apagamos el botón que se coloque null para que no se pueda clickear
        nextBtn.disabled = (info.next == null);
        prevBtn.disabled = (info.prev == null);
        pageIndicator.innerText = `Página ${page} de ${totalPages}`;
        
    } else if (operation == 'next') {
        // Si pedimos la siguiente, buscamos la URL guardada y llamamos a requestData
        const nextUrl = nextBtn.getAttribute("data-next");
        if (nextUrl !== "") requestData(nextUrl, page);

    } else if (operation == 'prev') {
        // Lo mismo para la anterior
        const prevUrl = prevBtn.getAttribute("data-prev");
        if (prevUrl !== "") requestData(prevUrl, page);
    }
}

// Convierte los datos en etiquetas de html
function renderHtml(personajes) {
    let element = document.getElementById("character");
    let htmlContent = ""; 
    
    //Recorremos la lista uno por uno
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
