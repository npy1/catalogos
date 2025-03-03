document.addEventListener("DOMContentLoaded", function () {
    const catalogos = [
        { titulo: "Catálogo 1", archivo: "catalogos/CATÁLOGO XBRI TBR 2025 - VIETNAM.pdf", imagen: "img/PORTADA VIETNAM.png" },
        { titulo: "Catálogo 2", archivo: "catalogos/catalogo2.pdf", imagen: "img/preview2.jpg" },
        { titulo: "Catálogo 3", archivo: "catalogos/catalogo3.pdf", imagen: "img/preview3.jpg" }
    ];

    const contenedor = document.getElementById("catalogo-container");
    const visorContainer = document.getElementById("visor-pdf-container");
    const cerrarPDF = document.getElementById("cerrar-pdf");
    const pdfCanvas = document.getElementById("pdf-canvas");

    let pdfDoc = null,
        pageNum = 1,
        scale = 1.2, // Zoom inicial
        isZoomed = false,
        isDragging = false,
        startX, startY, canvasOffsetX = 0, canvasOffsetY = 0;

    const pageNumEl = document.getElementById("page-num");
    const pageCountEl = document.getElementById("page-count");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");

    // Generar la lista de catálogos
    catalogos.forEach(catalogo => {
        const catalogoHTML = `
            <div class="catalogo">
                <img src="${catalogo.imagen}" alt="${catalogo.titulo}">
                <h3>${catalogo.titulo}</h3>
                <button onclick="verPDF('${catalogo.archivo}')">Ver</button>
                <button class="descargar" onclick="descargarPDF('${catalogo.archivo}')">Descargar</button>
            </div>
        `;
        contenedor.innerHTML += catalogoHTML;
    });

    // Función para mostrar el PDF en el visor
    window.verPDF = function (archivo) {
        pdfjsLib.getDocument(archivo).promise.then(pdf => {
            pdfDoc = pdf;
            pageCountEl.textContent = pdf.numPages;
            renderPage(1);
        });
        visorContainer.style.display = "flex";
    };

    // Renderizar una página del PDF en el canvas
    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: scale });
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;

            const ctx = pdfCanvas.getContext("2d");
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).promise.then(() => {});
            pageNumEl.textContent = num;
        });
    }

    // Cambiar a la página anterior
    prevPageBtn.addEventListener("click", () => {
        if (pageNum <= 1) return;
        pageNum--;
        renderPage(pageNum);
    });

    // Cambiar a la página siguiente
    nextPageBtn.addEventListener("click", () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        renderPage(pageNum);
    });

    // Hacer zoom con un solo clic en el canvas
    pdfCanvas.addEventListener("click", () => {
        isZoomed = !isZoomed; // Alternar entre zoom in y zoom out
        if (isZoomed) {
            scale = 2.0;
        } else {
            scale = 1.2;
            pdfCanvas.style.transform = `translate(0px, 0px)`;
            canvasOffsetX = 0;
            canvasOffsetY = 0;
        }
        renderPage(pageNum);
    });

    // Cerrar visor de PDF
    cerrarPDF.addEventListener("click", function () {
        visorContainer.style.display = "none";
        pdfCanvas.getContext("2d").clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    });
});
