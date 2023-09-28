let imgTranvia = document.querySelector("#tranvia")
let divParadas = document.querySelector(".paradas")
let botonMarcha = document.querySelector("#marcha")
let paradaActual = 1 // el que se reciba del servidor
let paradaDestino = 1
//let direcionDerecha = true;
for (let parada of divParadas.children) {
    parada.addEventListener("click", () => {
        switch (parada.id) {
            case "parada1":
                paradaDestino = 1
                break
            case "parada2":
                paradaDestino = 2
                break
            case "parada3":
                paradaDestino = 3
                break
            case "parada4":
                paradaDestino = 4
                break
            case "parada5":
                paradaDestino = 5
                break
        }
        let segundos = Math.abs(paradaDestino - paradaActual)
        let posicion = parada.getBoundingClientRect().left - (imgTranvia.offsetWidth)
        imgTranvia.style.transition = `transform ${segundos}s linear` // ease
        imgTranvia.style.transform = `translate(${posicion}px, 0)`
        paradaActual = paradaDestino;
    })
}
function mostrarLista() {
    lista=document.getElementById("estadisticas");
    if(lista.style.display==="none"||lista.style.display === ""){
        lista.style.display = "block";
    }else lista.style.display = "none";
}
document.getElementById("menu").addEventListener("click", mostrarLista)




// primero hace falta la comunicacion con el servidor
/* 
botonMarcha.addEventListener("click", () => {
    divParadas.children[paradaActual == 5 ?]
    imgTranvia.style.transform = `translate(${posicion}px, 0)`
})
*/
