let imgTranvia = document.querySelector("#tranvia");
let divParadas = document.querySelector(".paradas");
let botonMarcha = document.querySelector("#marcha");
let paradaActual = 1; // el que se reciba del servidor
let paradaDestino = 1;
let posHome = true;
let direcionDerecha = true;
let interval
let intervalActivo = false

for (let parada of divParadas.children) {
    parada.addEventListener("click", () => {
        // hacer que pare al auto matico cuando se le de a una para ??? 
        moverTranvia(parseInt(parada.id[parada.id.length - 1]));
    });
}
function mostrarLista() {
    lista = document.getElementById("estadisticas");
    if (lista.style.display === "none" || lista.style.display === "") {
        lista.style.display = "block";
    } else lista.style.display = "none";
}

function moverTranvia(parada) {
    let posicion;
    switch (parada) {
        case 1:
            paradaDestino = 1;
            posicion = 42;
            direcionDerecha = true;
            break;
        case 2:
            paradaDestino = 2;
            posicion = 250;
            break;
        case 3:
            paradaDestino = 3;
            posicion = 450;
            break;
        case 4:
            paradaDestino = 4;
            posicion = 650;
            break;
        case 5:
            paradaDestino = 5;
            posicion = 850;
            direcionDerecha = false;
            break;
    }
    let segundos = Math.abs(paradaDestino - paradaActual) / 4;
    if (posHome) {
        segundos = 1 // lo que tarde home -> uno
        posHome = false
    }
    imgTranvia.style.transition = `transform ${segundos}s ease`; // ease
    imgTranvia.style.transform = `translateX(${posicion}%)`;
    paradaActual = paradaDestino;
}

document.getElementById("menu").addEventListener("click", mostrarLista);

document.getElementById("stop").addEventListener("click", pararAnimacion);

async function moverTranviaAuto() {
    if (intervalActivo) {
        return;
    }
    intervalActivo = true
    opcinesMoverTranviaAuto()
    interval = setInterval(opcinesMoverTranviaAuto,2000) 
}

function opcinesMoverTranviaAuto() {
    if (posHome) {
         moverTranvia(1);
     } else if (direcionDerecha) {
         moverTranvia(paradaActual + 1);
     } else {
         moverTranvia(paradaActual - 1);
     }
}

document.getElementById("menu").addEventListener("click", mostrarLista);
botonMarcha.addEventListener("click", moverTranviaAuto);

function pararAnimacion() {
    let posi = imgTranvia.getBoundingClientRect().left - imgTranvia.offsetWidth;
    imgTranvia.style.transition = `transform 0s linear`; // ease
    imgTranvia.style.transform = `translate(${posi}px, 0)`;
    clearInterval(interval)
    intervalActivo = false
}

// primero hace falta la comunicacion con el servidor
/* 
botonMarcha.addEventListener("click", () => {
    divParadas.children[paradaActual == 5 ?]
    imgTranvia.style.transform = `translate(${posicion}px, 0)`
})
*/

let href = window.location.href;
botonMarcha.addEventListener("click", async () => {
    await postVariable("RESET", 1, true);
    postVariable("RESET", 0, false);
    await postVariable("MARTXA", 1, true);
    postVariable("MARTXA", 0, false);
    let interval = setInterval(async () => {
        let ET0 = await (await fetch("ET0.html")).text();
        if (ET0 === 1) {
            await postVariable("INICIO", 1, true);
            postVariable("INICIO", 0, false);
            clearInterval(interval);
        }
    }, 100);
});

async function postVariable(variable, valor, espera) {
    if (espera) {
        await fetch(href, {
            method: "post",
            body: `%22Tabla+de+variables+est%C3%A1ndar%22.${variable}=${valor}`,
        });
    } else {
        fetch(href, {
            method: "post",
            body: `%22Tabla+de+variables+est%C3%A1ndar%22.${variable}=${valor}`,
        });
    }
}
