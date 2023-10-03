let imgTranvia = document.querySelector("#tranvia")
let divParadas = document.querySelector(".paradas")
let botonMarcha = document.querySelector("#marcha")
let toggle = document.getElementById("switch");
let paradaActual = 0; // el que se reciba del servidor
let paradaDestino = 1;
let posHome = true;
let direcionDerecha = true;
let interval;
let intervalActivo = false;
let posi;

function calcularPorcentajeTranviaEnVia() {
    const via = document.querySelector(".vias");
    const viaRect = via.getBoundingClientRect();
    const tranviaRect = imgTranvia.getBoundingClientRect();
    const posicionRelativaEnPixeles = tranviaRect.left - viaRect.left;
    console.log("posicion pixelees" + posicionRelativaEnPixeles);
    const anchoTotalVia = viaRect.width;
    const porcentaje = (posicionRelativaEnPixeles / anchoTotalVia) * 1000;
    return porcentaje;
}

// Ejemplo de uso

let contParadasSesion = JSON.parse(sessionStorage.getItem("contParadas")) ?? [
    0, 0, 0, 0, 0,
];
sessionStorage.setItem("contParadas", JSON.stringify(contParadasSesion));

let contParadas = JSON.parse(localStorage.getItem("contParadas")) ?? [
    0, 0, 0, 0, 0,
];
localStorage.setItem("contParadas", JSON.stringify(contParadas));

for (let parada of divParadas.children) {
    parada.addEventListener("click", () => {
        let numParada = parseInt(parada.id[parada.id.length - 1]);
        if (toggle.checked) toggle.click()

        postVariableWait("B_A_R", 1).then(async () => {
            await postVariableWait(`B${numParada}`, 1);
            postVariable(`B${numParada}`, 0);
        });
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
    mover(posicion, segundos, parada);
}

function mover(posicion, segundos, parada) {
    posHome = false;
    contParadas[parada - 1]++;
    contParadasSesion[parada - 1]++;
    sessionStorage.setItem("contParadas", JSON.stringify(contParadasSesion));
    localStorage.setItem("contParadas", JSON.stringify(contParadas));
    imgTranvia.style.transition = `transform ${segundos}s ease`; // ease
    imgTranvia.style.transform = `translateX(${posicion}%)`;
    console.log(posicion);
    paradaActual = paradaDestino;
}

document.getElementById("menu").addEventListener("click", mostrarLista);

document.getElementById("stop").addEventListener("click", pararAnimacion);

async function moverTranviaAuto() {
    if (intervalActivo) {
        return;
    }
    intervalActivo = true;
    opcinesMoverTranviaAuto();
    interval = setInterval(opcinesMoverTranviaAuto, 2000);
}

function opcinesMoverTranviaAuto() {
    if (posHome) {
        mover(50, 1, 1);
    } else if (direcionDerecha) {
        moverTranvia(paradaActual + 1);
    } else {
        moverTranvia(paradaActual - 1);
    }
}

document.getElementById("menu").addEventListener("click", mostrarLista);
botonMarcha.addEventListener("click", moverTranviaAuto);

function pararAnimacion() {
    postVariableWait("B_PAUSA", 1).then(() => {
        postVariable("B_PAUSA", 0);
    })
    let posi = calcularPorcentajeTranviaEnVia();
    console.log(posi);
    //imgTranvia.style.transition = 'none';
    imgTranvia.style.transform = `translateX(${posi}%   )`;
    clearInterval(interval);
    intervalActivo = false;
}
document.getElementById("menu").addEventListener("click", mostrarLista);
document.getElementById("stop").addEventListener("click", pararAnimacion);
document.getElementById("menu").addEventListener("click", mostrarLista);
document.getElementById("marcha").addEventListener("click", moverTranviaAuto);
function mostrarManual() {
    manual = document.getElementById("manual");
    automatico = document.getElementById("automatico");
    if (toggle.checked) {
        automatico.style.display = "none";
        manual.style.display = "flex";
    } else {
        automatico.style.display = "flex";
        manual.style.display = "none";
    }
    postVariable("MANU_AUTO", toggle.checked ? 1 : 0)
}
toggle.addEventListener("change", mostrarManual);

let href = window.location.href;
ponerEnHome();
async function ponerEnHome() {
    await postVariableWait("RESET", 1);
    postVariable("RESET", 0);
    await postVariableWait("MARTXA", 1);
    postVariable("MARTXA", 0)
    await postVariableWait("MANU_AUTO", toggle.checked ? 1 : 0)
    postVariable("B_A_R", 0)

}
document.getElementById("reset").addEventListener("click", ponerEnHome)
function reset() {
    paradaActual = 0
    paradaDestino=1
    imgTranvia.style.transform = 'translateX(0%)'
    direcionDerecha = true
    posHome = true
}
document.getElementById("reset").addEventListener("click", reset)


botonMarcha.addEventListener("click", async () => {
    // saber cuando tiene que dejar de buscar 
    postVariable("B_A_R", 0)
    let interval = setInterval(async () => {
        let ET3 = parseInt(await (await fetch("ET3.html")).text());
        //let numParada = parseInt(await (await fetch("numParada.html")).text());
        console.log(ET3)
        if (ET3 === 0 /*|| numParada !== 0*/) { // saber si esta en el home o si esta en alguna otra parada
            await postVariableWait("INICIO", 1)
            postVariable("INICIO", 0);
            clearInterval(interval);
        }
    }, 100);
});

async function postVariableWait(variable, valor) {
    await fetch(href, {
        method: "post",
        body: `"WEB".${variable}=${valor}`,
    });
}

function postVariable(variable, valor) {
    fetch(href, {
        method: "post",
        body: `"WEB".${variable}=${valor}`,
    });
}

document.getElementById("switch").addEventListener("change", mostrarManual);

const botonIzq = document.getElementById("izquierda");
const botonDer = document.getElementById("derecha");
let isMoving = false;
const via = document.querySelector(".vias");
const viaRect = via.getBoundingClientRect();
const anchoTotalVia = viaRect.width;

botonIzq.addEventListener("touchstart", (event) => {
    postVariable("BOTON_PATRAS", 1)
    isMoving = true;
    touchId = event.touches[0].identifier;
    moverimagenIzq();
});

botonIzq.addEventListener("touchend", () => {
    postVariable("BOTON_PATRAS", 0)
    isMoving = false;
    touchId = null;
});

botonDer.addEventListener("touchstart", (event) => {
    postVariable("BOTON_PALANTE", 1)
    isMoving = true;
    touchId = event.touches[0].identifier;
    moverimagenDer();
});

botonDer.addEventListener("touchend", () => {
    postVariable("BOTON_PALANTE", 0)
    isMoving = false;
    touchId = null;
});
document.addEventListener("touchmove", (event) => {
    if (isMoving && touchId !== null) {
        const touch = Array.from(event.touches).find(
            (t) => t.identifier === touchId
        );
        if (touch) {
            event.preventDefault(); // Evita el desplazamiento de la página en dispositivos móviles
            // Calcula la posición del toque y realiza la acción correspondiente
            const posX = touch.clientX;
            const viaRect = via.getBoundingClientRect();
            const viaAncho = viaRect.width;
            const porcentaje = ((posX - viaRect.left) / viaAncho) * 100;
            if (porcentaje >= 0 && porcentaje <= 100) {
                imgTranvia.style.transform = `translateX(${porcentaje}%)`;
            }
        }
    }
});

document.addEventListener("touchend", () => {
    postVariable("BOTON_PATRAS", 0)
    postVariable("BOTON_PALANTE", 0)
    isMoving = false;
    touchId = null;
});

botonIzq.addEventListener("mousedown", () => {
    postVariable("BOTON_PATRAS", 1)
    isMoving = true;
    moverimagenIzq();
});
botonIzq.addEventListener("mousemove", () => {
    postVariable("BOTON_PATRAS", 0)
    isMoving = false;
});

botonDer.addEventListener("mousedown", () => {
    postVariable("BOTON_PALANTE", 1)
    isMoving = true;
    moverimagenDer();
});
botonDer.addEventListener("mousemove", () => {
    postVariable("BOTON_PALANTE", 0)
    isMoving = false;
});

document.addEventListener("mouseup", () => {
    postVariable("BOTON_PATRAS", 0)
    postVariable("BOTON_PALANTE", 0)
    isMoving = false;
});

function moverimagenIzq() {
    if (isMoving) {
        posi = calcularPorcentajeTranviaEnVia();
        console.log(posi);
        posi = posi - 4;
        if (posi > 0) {
            imgTranvia.style.transform = `translateX(${posi}%)`;
            requestAnimationFrame(moverimagenIzq);

        }
    }
}

function moverimagenDer() {
    if (isMoving) {
        posi = calcularPorcentajeTranviaEnVia();
        posi = Math.round(posi);
        console.log("antes de sumar " + posi);
        posi = posi + 4;
        console.log("despues de sumar " + posi);
        if (posi < 902) {
            imgTranvia.style.transform = `translateX(${posi}%)`;
            requestAnimationFrame(moverimagenDer);
        }
    }
}

