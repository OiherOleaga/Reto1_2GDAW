let imgTranvia = document.querySelector("#tranvia");
let divParadas = document.querySelector(".paradas");
let botonMarcha = document.querySelector("#marcha");
let paradaActual = 0; // el que se reciba del servidor
let paradaDestino = 1;
let posHome = true;
let direcionDerecha = true;
let interval
let intervalActivo = false

function calcularPorcentajeTranviaEnVia() {
    const via = document.querySelector('.vias');
    const viaRect = via.getBoundingClientRect();
    const tranviaRect = imgTranvia.getBoundingClientRect();

    // Calcular la posición relativa del tranvía dentro de la vía en píxeles
    const posicionRelativaEnPixeles = tranviaRect.left - viaRect.left;

    // Calcular el ancho total de la vía en píxeles
    const anchoTotalVia = viaRect.width;

    // Calcular el porcentaje en el que se encuentra el tranvía en la vía
    const porcentaje = (posicionRelativaEnPixeles / anchoTotalVia) * 1000;

    return porcentaje
}

// Ejemplo de uso



let contParadasSesion = JSON.parse(sessionStorage.getItem("contParadas")) ?? [0, 0, 0, 0, 0]
sessionStorage.setItem("contParadas", JSON.stringify(contParadasSesion))

let contParadas = JSON.parse(localStorage.getItem("contParadas")) ?? [0, 0, 0, 0, 0]
localStorage.setItem("contParadas", JSON.stringify(contParadas))

for (let parada of divParadas.children) {
    parada.addEventListener("click", () => {
        let numParada = parseInt(parada.id[parada.id.length - 1])
        postVariable("MANUAL", 0, false)
        postVariable("ELEGIR_PARADA", 1, true)
            .then(async () => {
                await postVariable(`B${numParada}`, 1, true)
                postVariable(`B${numParada}`, 0, false)
            })
        moverTranvia(numParada);
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
    if (paradaActual == parada) {
        return;
    }
    switch (parada) {
        case 1:
            paradaDestino = 1;
            posicion = 50;
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
    mover(posicion, segundos, parada)
}

function mover(posicion, segundos, parada) {
    posHome = false
    contParadas[parada - 1]++
    contParadasSesion[parada - 1]++
    sessionStorage.setItem("contParadas", JSON.stringify(contParadasSesion))
    localStorage.setItem("contParadas", JSON.stringify(contParadas))
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
    interval = setInterval(opcinesMoverTranviaAuto, 2000)
}

function opcinesMoverTranviaAuto() {
    if (posHome) {
        mover(50, 1, 1)
    } else if (direcionDerecha) {
        moverTranvia(paradaActual + 1);
    } else {
        moverTranvia(paradaActual - 1);
    }
}

document.getElementById("menu").addEventListener("click", mostrarLista);
botonMarcha.addEventListener("click", moverTranviaAuto);

function pararAnimacion() {
    postVariable("STOP", 1, false)
    let posi = calcularPorcentajeTranviaEnVia();
    console.log(posi);
    //imgTranvia.style.transition = 'none';
    imgTranvia.style.transform = `translateX(${posi}%   )`;
    clearInterval(interval);
    intervalActivo = false;
}
document.getElementById("menu").addEventListener("click", mostrarLista)
document.getElementById("stop").addEventListener("click", pararAnimacion)
document.getElementById("menu").addEventListener("click", mostrarLista)
document.getElementById("marcha").addEventListener("click", moverTranviaAuto)
let toogle = document.getElementById("switch")
function mostrarManual() {
    manual = document.getElementById("manual")
    automatico = document.getElementById("automatico")
    if (toogle.checked) {
        automatico.style.display = "none"
        manual.style.display = "flex"
    } else {
        automatico.style.display = "flex"
        manual.style.display = "none"
    }
    postVariable("MANUAL", (toogle.checked)? 1 : 0, false)
}
toogle.addEventListener("change", mostrarManual)

const nombreBD = '"WEB"'
let href = window.location.href;
ponerEnHome()
async function ponerEnHome() {
    await postVariable("RESET", 1, true);
    postVariable("RESET", 0, false);
    await postVariable("MARTXA", 1, true);
    postVariable("MARTXA", 0, false);
    await postVariable("MANUAL", (toogle.checked)? 1 : 0, true)
    postVariable("ELEGIR_PARADA", 0, false)
}

botonMarcha.addEventListener("click", async () => {
    if (toggle.checked) {
        // modo automaticao
    } else {
        postVariable("ELEGIR_PARADA", 0, false)
        let interval = setInterval(async () => {
            let ET0 = await (await fetch("ET0.html")).text();
            if (ET0 === 1) {
                await postVariable("INICIO", 1, true);
                postVariable("INICIO", 0, false);
                clearInterval(interval);
            }
        }, 100);
    }
});

async function postVariable(variable, valor, espera) {
    if (espera) {
        await fetch(href, {
            method: "post",
            body: `${nombreBD}.${variable}=${valor}`,
        });
    } else {
        fetch(href, {
            method: "post",
            body: `${nombreBD}.${variable}=${valor}`,
        });
    }
}

