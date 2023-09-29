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
        imgTranvia.style.transition = `transform ${segundos}s ease` // ease
        imgTranvia.style.transform = `translate(${posicion}px, 0)`
        paradaActual = paradaDestino;
    })
}
function mostrarLista() {
    lista = document.getElementById("estadisticas");
    if (lista.style.display === "none" || lista.style.display === "") {
        lista.style.display = "block";
    } else lista.style.display = "none";
}

document.getElementById("menu").addEventListener("click", mostrarLista)

document.getElementById("stop").addEventListener("click", pararAnimacion)

function moverTranviaAuto() {
    tranvia = document.getElementById("tranvia")
    tranvia.style.animation = "mover 10s ease"
}


document.getElementById("menu").addEventListener("click", mostrarLista)
document.getElementById("marcha").addEventListener("click", moverTranviaAuto)


function pararAnimacion() {
    let posi = imgTranvia.getBoundingClientRect().left - (imgTranvia.offsetWidth)
    imgTranvia.style.transition = `transform 0s linear` // ease
    imgTranvia.style.transform = `translate(${posi}px, 0)`;
    imgTranvia.style.animationPlayState = "paused";
}

// primero hace falta la comunicacion con el servidor
/* 
botonMarcha.addEventListener("click", () => {
    divParadas.children[paradaActual == 5 ?]
    imgTranvia.style.transform = `translate(${posicion}px, 0)`
})
*/

let href = window.location.href
botonMarcha.addEventListener("click", async () => {
    await postVariable("RESET", 1, true)
    postVariable("RESET", 0, false)
    await postVariable("MARTXA", 1, true)
    postVariable("MARTXA", 0, false)
    let interval = setInterval(async () => {
        let ET0 = await (await fetch('ET0.html')).text()
        if (ET0 === 1) {
            await postVariable("INICIO", 1, true)
            postVariable("INICIO", 0, false)
            clearInterval(interval)
        }
    }, 100)
})

async function postVariable(variable, valor, espera) {
    if (espera) {
        await fetch(href, {
            method: "post",
            body: `%22Tabla+de+variables+est%C3%A1ndar%22.${variable}=${valor}`
        })
    } else {
        fetch(href, {
            method: "post",
            body: `%22Tabla+de+variables+est%C3%A1ndar%22.${variable}=${valor}`
        })
    }
}

