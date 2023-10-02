let contParadas = JSON.parse(localStorage.getItem("contParadas")) ?? [0,0,0,0,0]
let contParadasSesion = JSON.parse(sessionStorage.getItem("contParadas")) ?? [0,0,0,0,0]

var graficaSesion = document.getElementById("sesion").getContext("2d");
        var chart = new Chart(graficaSesion, {
            type: "bar",
            data: {
                labels: ["Parada 1", "Parada 2", "Parada 3", "Parada 4", "Parada 5"],
                datasets: [
                    {
                        label: "Paradas De Esta Sesión",
                        backgroundColor: "#007f3b",
                        borderColor: "#007f3b",
                        data: [contParadas[0], contParadas[1], contParadas[2], contParadas[3], contParadas[4]],
                    }
                ]
            }
        });

        var graficaGlobal = document.getElementById("Global").getContext("2d");
        var grafico = new Chart(graficaGlobal, {
            type: "line",
            data: {
                labels: ["Parada 1", "Parada 2", "Parada 3", "Parada 4", "Parada 5"],
                datasets: [
                    {
                        label: "Paradas Totales",
                        backgroundColor: "#c2d345",
                        borderColor: "#007f3b",
                        data: [contParadasSesion[0], contParadasSesion[1], contParadasSesion[2], contParadasSesion[3], contParadasSesion[4]],
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
