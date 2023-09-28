var graficaSesion = document.getElementById("sesion").getContext("2d");
        var chart = new Chart(graficaSesion, {
            type: "bar",
            data: {
                labels: ["parada 1", "parada 2", "parada 3", "parada 4", "parada 5"],
                datasets: [
                    {
                        label: "Paradas de esta sesión",
                        backgroundColor: "#007f3b",
                        borderColor: "#007f3b",
                        data: [232, 234, 230, 228, 226],
                    }
                ]
            }
        });

        var graficaGlobal = document.getElementById("Global").getContext("2d");
        var grafico = new Chart(graficaGlobal, {
            type: "line",
            data: {
                labels: ["parada 1", "parada 2", "parada 3", "parada 4", "parada 5"],
                datasets: [
                    {
                        label: "Paradas totales",
                        backgroundColor: "#c2d345",
                        borderColor: "#007f3b",
                        data: [734, 730, 726, 724, 720],
                    }
                ]
            },
        });

function mostrarLista() {
    lista=document.getElementById("estadisticas");
    if(lista.style.display==="none"||lista.style.display === ""){
        lista.style.display = "block";
    }else lista.style.display = "none";
}
document.getElementById("menu").addEventListener("click", mostrarLista)