let contParadas = JSON.parse(localStorage.getItem("contParadas")) ?? [
    0, 0, 0, 0, 0,
];
let contParadasSesion = JSON.parse(sessionStorage.getItem("contParadas")) ?? [
    0, 0, 0, 0, 0,
];

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

<<<<<<< HEAD
var graficaSesion = document.getElementById("Global").getContext("2d");
var grafico = new Chart(graficaSesion, {
    type: "bar",
=======
let grafica2 = document.getElementById("Global").getContext("2d");
let graficaGlobal = new Chart(grafica2, {
    type: "line",
>>>>>>> ab28064677d8a413ff32b10e223b8d0f12b91cf5
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

function mostrarLista() {
    lista = document.getElementById("estadisticas");
    if (lista.style.display === "none" || lista.style.display === "") {
        lista.style.display = "block";
    } else lista.style.display = "none";
}
document.getElementById("menu").addEventListener("click", mostrarLista);

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
