// ------------------DeclaracionDeVatiables -------------------------------

// contador de paradas global
let contParadas = JSON.parse(localStorage.getItem("contParadas")) ?? [
    0, 0, 0, 0, 0,
];

// contador de paradas de la sesion 
let contParadasSesion = JSON.parse(sessionStorage.getItem("contParadas")) ?? [
    0, 0, 0, 0, 0,
];

// -------------------DeclaracionDeLosGraficos ---------------------------

// declaracion del grafico de esta sesion
let grafica1 = document.getElementById("sesion").getContext("2d");
let graficaSesion = new Chart(grafica1, {
    type: "bar",
    data: {
        labels: ["parada 1", "parada 2", "parada 3", "parada 4", "parada 5"],
        datasets: [
            {
                label: "Paradas de esta sesión",
                backgroundColor: "#007f3b",
                borderColor: "#007f3b",
                data: contParadasSesion,
            },
        ],
    },
});

// Declaracion del grafico global
let grafica2 = document.getElementById("Global").getContext("2d");
let graficaGlobal = new Chart(grafica2, {
    type: "line",
    data: {
        labels: ["parada 1", "parada 2", "parada 3", "parada 4", "parada 5"],
        datasets: [
            {
                label: "Paradas totales",
                backgroundColor: "#c2d345",
                borderColor: "#007f3b",
                data: contParadas,
            },
        ],
    },
});

// ----------------------EventListeners --------------------------------

// Listener para mostrar el menu para cambiar de pagina
document.getElementById("menu").addEventListener("click", mostrarLista);

// Listener para actualizar los graficos a tiempo real
window.addEventListener("storage", () => {
    contParadas = JSON.parse(localStorage.getItem("contParadas")) ?? [
        0, 0, 0, 0, 0,
    ];
    contParadasSesion = JSON.parse(sessionStorage.getItem("contParadas")) ?? [
        0, 0, 0, 0, 0,
    ];
    graficaGlobal.data.datasets[0].data = contParadas;
    graficaSesion.data.datasets[0].data = contParadasSesion;
    graficaGlobal.update();
    graficaSesion.update();
});

// ----------------------- Funciones ---------------------------------
function mostrarLista() {
    lista = document.getElementById("estadisticas");
    if (lista.style.display === "none" || lista.style.display === "") {
        lista.style.display = "block";
    } else lista.style.display = "none";
}

