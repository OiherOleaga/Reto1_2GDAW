let imgTranvia = document.querySelector("#tranvia")
let divParadas = document.querySelector(".paradas")
let botonMarcha = document.querySelector("#marcha")
let toggle = document.getElementById("switchManual");
let toggleCiclo = document.getElementById("switchCiclo");
const via = document.querySelector(".vias");
let paradaActual = 0; // el que se reciba del servidor
let paradaDestino = 1;
let posHome = true;
let direcionDerecha = true;
let interval;
let intervalActivo = false;
let posi;
let modoAutomatico = false;
let modoClick = false;
let posicion;
let espacioPresionado = false;


function calcularPorcentajeTranviaEnVia() {
    const viaRect = via.getBoundingClientRect();
    const tranviaRect = imgTranvia.getBoundingClientRect();
    const posicionRelativaEnPixeles = tranviaRect.left - viaRect.left;
    console.log("posicion pixelees" + posicionRelativaEnPixeles);
    const anchoTotalVia = viaRect.width;
    const porcentaje = (posicionRelativaEnPixeles / anchoTotalVia) * 1000;
    return porcentaje;
}

function calcularWidthTranviaPorcentaje() {
    return (imgTranvia.getBoundingClientRect().width / via.getBoundingClientRect().width) * 1000
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
    modoClick = true
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


async function moverTranviaAuto() {
    modoAutomatico = true;
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

document.getElementById("stop").addEventListener("mousedown", () => {
    postVariable("B_PAUSA", 1);
    if (direcionDerecha) {
        paradaActual--;
    } else {
        paradaActual++;
    }
    pararTranvia();
    clearInterval(interval);
    intervalActivo = false;
});

document.getElementById("stop").addEventListener("mouseup", () => {
    postVariable("B_PAUSA", 0);
    if (modoAutomatico) {
        moverTranviaAuto();
    } else if (modoClick) {
        imgTranvia.style.transform = `translateX(${posicion}%)`;
    }
    intervalActivo = false;
});

document.addEventListener("keydown", (event) => {
    if (event.key === "s" && !espacioPresionado) {
        postVariable("B_PAUSA", 1);
        if (direcionDerecha) {
            paradaActual--;
        } else {
            paradaActual++;
        }
        pararTranvia();
        clearInterval(interval);
        intervalActivo = false;
        espacioPresionado = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "s") {
        espacioPresionado = false
        postVariable("B_PAUSA", 0);
        if (modoAutomatico) {
            moverTranviaAuto();
        } else if (modoClick) {
            imgTranvia.style.transform = `translateX(${posicion}%)`;
        }
        intervalActivo = false;
    }
});


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        let segundos = segundosManual * (calcularPorcentajeTranviaEnVia() / 1000)
        postVariable("BOTON_PALANTE", 0)
        postVariable("BOTON_PATRAS", 1)
        imgTranvia.style.transition = `transform ${segundos}s linear`;
        imgTranvia.style.transform = `translateX(0%)`;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        postVariable("BOTON_PATRAS", 0)
        pararTranvia()
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        let segundos = (segundosManual - (segundosManual * (calcularPorcentajeTranviaEnVia() / 1000)))
        postVariable("BOTON_PATRAS", 0)
        postVariable("BOTON_PALANTE", 1)

        imgTranvia.style.transition = `transform ${segundos}s linear`;
        imgTranvia.style.transform = `translateX(${1000 - calcularWidthTranviaPorcentaje()}%)`;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
        postVariable("BOTON_PALANTE", 0)
        pararTranvia()
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRigth") {
        postVariableWait("RESET", 1);
        postVariable("RESET", 0);
        postVariableWait("MARTXA", 1);
        postVariable("MARTXA", 0)
        postVariableWait("MANU_AUTO", toggle.checked ? 1 : 0)
        postVariable("B_A_R", 0)
        location.reload();
    }
});


document.getElementById("menu").addEventListener("click", mostrarLista);
document.getElementById("menu").addEventListener("click", mostrarLista);
document.getElementById("marcha").addEventListener("click", moverTranviaAuto);
function mostrarManual() {
    localStorage.setItem("manual", "true")
    manual = document.getElementById("manual");
    automatico = document.getElementById("automatico");
    switchAuto = document.getElementById("switchAuto");
    if (toggle.checked) {
        automatico.style.display = "none";
        manual.style.display = "flex";
        switchAuto.style.display = "none"
    } else {
        automatico.style.display = "flex";
        manual.style.display = "none";
        switchAuto.style.display = "flex"

    }
    postVariable("MANU_AUTO", toggle.checked ? 1 : 0)
}
toggle.addEventListener("change", mostrarManual);

let href = window.location.href;
document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        postVariableWait("RESET", 1);
        postVariable("RESET", 0);
        postVariableWait("MARTXA", 1);
        postVariable("MARTXA", 0)
        postVariableWait("MANU_AUTO", toggle.checked ? 1 : 0)
        postVariable("B_A_R", 0)
        location.reload();
    }
});

async function ponerEnHome() {
    await postVariableWait("RESET", 1);
    postVariable("RESET", 0);
    await postVariableWait("MARTXA", 1);
    postVariable("MARTXA", 0)
    if (localStorage.getItem("manual") === "true") {
        toggle.click()
    } else if (localStorage.getItem("ciclo") === "true") {
        toggleCiclo.click()
    }
}
document.getElementById("reset").addEventListener("click", ponerEnHome);
document.getElementById("reset").addEventListener("click", reload);


function reload() {
    location.reload();
}


botonMarcha.addEventListener("click", async () => {
    // saber cuando tiene que dejar de buscar 
    /*postVariable("B_A_R", 0)
    let interval = setInterval(async () => { 
        let ET3 = parseInt(await (await fetch("ET3.html")).text());
        //let numParada = parseInt(await (await fetch("numParada.html")).text());
        console.log(ET3)
        if (ET3 === 0) { // saber si esta en el home o si esta en alguna otra parada
            await postVariableWait("INICIO", 1)
            postVariable("INICIO", 0);
            clearInterval(interval);
        }
    }, 100);
    */
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

document.getElementById("switchManual").addEventListener("change", mostrarManual);

const botonIzq = document.getElementById("izquierda");
const botonDer = document.getElementById("derecha");
const viaRect = via.getBoundingClientRect();
const anchoTotalVia = viaRect.width;

botonIzq.addEventListener("touchstart", (event) => {
    postVariable("BOTON_PATRAS", 1)
    touchId = event.touches[0].identifier;
    moverimagenIzq();
});

botonIzq.addEventListener("touchend", () => {
    postVariable("BOTON_PATRAS", 0)
    pararTranvia()
    touchId = null;
});

botonDer.addEventListener("touchstart", (event) => {
    postVariable("BOTON_PALANTE", 1)
    pararTranvia()
    touchId = event.touches[0].identifier;
    moverimagenDer();
});

botonDer.addEventListener("touchend", () => {
    postVariable("BOTON_PALANTE", 0)
    pararTranvia()
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
    pararTranvia()
    touchId = null;
});
let segundosManual = 3
botonIzq.addEventListener("mousedown", () => {
    postVariable("BOTON_PATRAS", 1)
    moverimagenIzq();
});
botonIzq.addEventListener("mousemove", () => {
    postVariable("BOTON_PATRAS", 0)
    pararTranvia()
});

botonDer.addEventListener("mousedown", () => {
    postVariable("BOTON_PALANTE", 1)
    moverimagenDer();
});
botonDer.addEventListener("mousemove", () => {
    postVariable("BOTON_PALANTE", 0)
    pararTranvia()
});

document.addEventListener("mouseup", () => {
    postVariable("BOTON_PATRAS", 0)
    postVariable("BOTON_PALANTE", 0)
    pararTranvia()
});

function pararTranvia() {
    let posi = calcularPorcentajeTranviaEnVia();
    imgTranvia.style.transform = `translateX(${posi}%)`;
}

function moverimagenIzq() {
    let segundos = segundosManual * (calcularPorcentajeTranviaEnVia() / 1000)
    imgTranvia.style.transition = `transform ${segundos}s linear`;
    imgTranvia.style.transform = `translateX(0%)`;
}

function moverimagenDer() {
    let segundos = (segundosManual - (segundosManual * (calcularPorcentajeTranviaEnVia() / 1000)))
    imgTranvia.style.transition = `transform ${segundos}s linear`;
    imgTranvia.style.transform = `translateX(${1000 - calcularWidthTranviaPorcentaje()}%)`;
}

