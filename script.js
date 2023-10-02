let imgTranvia = document.querySelector("#tranvia");
let divParadas = document.querySelector(".paradas");
let botonMarcha = document.querySelector("#marcha");
let paradaActual = 0; // el que se reciba del servidor
let paradaDestino = 1;
let posHome = true;
let direcionDerecha = true;
let interval;
let intervalActivo = false;

function calcularPorcentajeTranviaEnVia() {
    const via = document.querySelector(".vias");
    const viaRect = via.getBoundingClientRect();
    const tranviaRect = imgTranvia.getBoundingClientRect();
    const posicionRelativaEnPixeles = tranviaRect.left - viaRect.left;
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
        postVariable("MANUAL", 0, false);
        postVariable("ELEGIR_PARADA", 1, true).then(async () => {
            await postVariable(`B${numParada}`, 1, true);
            postVariable(`B${numParada}`, 0, false);
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
    postVariable("STOP", 1, false);
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
let toogle = document.getElementById("switch");
function mostrarManual() {
    manual = document.getElementById("manual");
    automatico = document.getElementById("automatico");
    if (toogle.checked) {
        automatico.style.display = "none";
        manual.style.display = "flex";
    } else {
        automatico.style.display = "flex";
        manual.style.display = "none";
    }
    postVariable("MANUAL", toogle.checked ? 1 : 0, false);
}
toogle.addEventListener("change", mostrarManual);

const nombreBD = '"WEB"';
let href = window.location.href;
ponerEnHome();
async function ponerEnHome() {
    await postVariable("RESET", 1, true);
    postVariable("RESET", 0, false);
    await postVariable("MARTXA", 1, true);
    postVariable("MARTXA", 0, false);
    await postVariable("MANUAL", toogle.checked ? 1 : 0, true);
    postVariable("ELEGIR_PARADA", 0, false);
}

botonMarcha.addEventListener("click", async () => {
    if (toggle.checked) {
        // modo automaticao
    } else {
        postVariable("ELEGIR_PARADA", 0, false);
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

document.getElementById("switch").addEventListener("change", mostrarManual);

const botonIzq = document.getElementById("izquierda");
const botonDer = document.getElementById("derecha");
let isMoving = false;
const via = document.querySelector(".vias");
const viaRect = via.getBoundingClientRect();
const anchoTotalVia = viaRect.width;

botonIzq.addEventListener("touchstart", (event) => {
    isMoving = true;
    touchId = event.touches[0].identifier;
    moverimagenIzq();
});

botonIzq.addEventListener("touchend", () => {
    isMoving = false;
    touchId = null;
});

botonDer.addEventListener("touchstart", (event) => {
    isMoving = true;
    touchId = event.touches[0].identifier;
    moverimagenDer();
});

botonDer.addEventListener("touchend", () => {
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
    isMoving = false;
    touchId = null;
});

botonIzq.addEventListener("mousedown", () => {
    isMoving = true;
    moverimagenIzq();
});
botonIzq.addEventListener("mousemove", () => {
    isMoving = false;
});

botonDer.addEventListener("mousedown", () => {
    isMoving = true;
    moverimagenDer();
});
botonDer.addEventListener("mousemove", () => {
    isMoving = false;
});

document.addEventListener("mouseup", () => {
    isMoving = false;
});

function moverimagenIzq() {
    if (isMoving) {
        let posi = calcularPorcentajeTranviaEnVia();
        posi = posi - 4;
        if (posi > 0) {
            imgTranvia.style.transform = `translateX(${posi}%)`;
            requestAnimationFrame(moverimagenIzq);
        }
    }
}

function moverimagenDer() {
    if (isMoving) {
        let posi = calcularPorcentajeTranviaEnVia();
        posi = posi + 4;
        if (posi < 902) {
            imgTranvia.style.transform = `translateX(${posi}%)`;
            requestAnimationFrame(moverimagenDer);
        }
    }
}
