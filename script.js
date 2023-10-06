let imgTranvia = document.querySelector("#tranvia")
let divParadas = document.querySelector(".paradas")
let botonMarcha = document.querySelector("#marcha")
let toggle = document.getElementById("switchManual");
let toggleCiclo = document.getElementById("switchCiclo");
const via = document.querySelector(".vias");
let paginaCargada = false
let paradaActual = 0;
let paradaDestino = 1;
let keyAnterior
let direcionDerecha = true;
let interval;
let intervalActivo = false;
let posi;
const href = window.location.href
let modoAutomatico = false;
let modoClick = false;
let posicion;
let cargadoHome = false


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
        moverEligiendo(parseInt(parada.id[parada.id.length - 1]))
    });
}

function moverEligiendo(numParada) {
    if (!toggleCiclo.checked && !toggle.checked) {
        postVariableWait(`B${numParada}`, 1)
            .then(() => postVariable(`B${numParada}`, 0));
        moverTranvia(numParada);
    }
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
        case 0:
            paradaDestino = 0
            posicion = 0
            direcionDerecha = true;
            break
        case 1:
            paradaDestino = 1;
            posicion = 50;
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

    let segundos = Math.abs(paradaDestino - paradaActual) / 2.8;
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


function moverTranviaAuto() {
    if (toggle.checked || !toggleCiclo.checked) {
        return
    }
    modoAutomatico = true;
    if (intervalActivo) {
        return;
    }
    postVariableWait("INICIO", 1)
        .then(() => postVariable("INICIO", 0))
    intervalActivo = true;
    opcionesMoverTranviaAuto();
    interval = setInterval(opcionesMoverTranviaAuto, 2500);
}

function opcionesMoverTranviaAuto() {
    if (direcionDerecha) {
        moverTranvia(paradaActual + 1);
    } else {
        moverTranvia(paradaActual - 1);
    }
}

document.getElementById("switchCiclo").addEventListener("change", cambiarPointer)
function cambiarPointer() {
    let paradas = document.getElementsByClassName("parada")
    let marcha = document.getElementById("marcha")
    if (document.getElementById("switchCiclo").checked) {
        marcha.style.cursor = "pointer"
        for (let parada = 0; parada < paradas.length; parada++) {
            paradas[parada].style.backgroundColor = "red"
        }
    } else {
        marcha.style.cursor = "not-allowed"
        for (let parada = 0; parada < paradas.length; parada++) {
            paradas[parada].style.backgroundColor = " "
        }
    }
}

document.getElementById("menu").addEventListener("click", mostrarLista);
botonMarcha.addEventListener("click", moverTranviaAuto);

document.getElementById("stop").addEventListener("mousedown", parar);
function parar() {
    postVariable("B_PAUSA", 1);
    if (direcionDerecha) {
        paradaActual--;
    } else {
        paradaActual++;
    }
    pararTranvia();
    clearInterval(interval);
    intervalActivo = false;
}

document.getElementById("stop").addEventListener("touchstart", (event) => {
    parar()
});

document.getElementById("stop").addEventListener("touchend", () => {
    dejarDeParar()
});
document.getElementById("stop").addEventListener("touchmove", () => {
    dejarDeParar()
});
document.getElementById("stop").addEventListener("mousemove", dejarDeParar);

document.getElementById("stop").addEventListener("mouseup", dejarDeParar);

function dejarDeParar() {
    postVariable("B_PAUSA", 0);
    if (modoAutomatico) {
        moverTranviaAuto();
    } else if (modoClick) {
        imgTranvia.style.transform = `translateX(${posicion}%)`;
    }
    intervalActivo = false;
}

document.addEventListener("keydown", (event) => {
    if (!cargadoHome) {
        return
    }
    switch (event.key) {
        case "ArrowLeft":
            moverimagenIzq();
            break
        case "ArrowRight":
            moverimagenDer();
            break
        case keyAnterior:
            break
        case "s":
            parar()
            break
        case "r":
            location.reload();
            break
        case "1":
            moverEligiendo(1)
            break
        case "2":
            moverEligiendo(2)

            break
        case "3":
            moverEligiendo(3)
            break
        case "4":
            moverEligiendo(4)
            break
        case "5":
            moverEligiendo(5)
            break
    }
    keyAnterior = event.key
});

document.addEventListener("keyup", (event) => {
    if (!cargadoHome) {
        return
    }
    if (keyAnterior === event.key)
        keyAnterior = "patata"
    switch (event.key) {
        case "s":
            dejarDeParar()
            break
        case "ArrowLeft":
            pararTranvia()
            postVariable("BOTON_PATRAS", 0)
            break;
        case "ArrowRight":
            pararTranvia()
            postVariable("BOTON_PALANTE", 0)
            break;
    }
});

document.getElementById("menu").addEventListener("click", mostrarLista);
document.getElementById("menu").addEventListener("click", mostrarLista);
document.getElementById("marcha").addEventListener("click", moverTranviaAuto);

async function mostrarManual() {
    let paradas = document.getElementsByClassName("parada")
    manual = document.getElementById("manual");
    automatico = document.getElementById("automatico");
    switchAuto = document.getElementById("switchAuto");
    if (toggle.checked) {
        automatico.style.display = "none";
        manual.style.display = "flex";
        switchAuto.style.display = "none"
        for (let parada = 0; parada < paradas.length; parada++) {
            paradas[parada].style.backgroundColor = "red"
        }
    } else {
        automatico.style.display = "flex";
        manual.style.display = "none";
        switchAuto.style.display = "flex"
        for (let parada = 0; parada < paradas.length; parada++) {
            paradas[parada].style.backgroundColor = "";
        }
    }
    localStorage.setItem("manual", toggle.checked)
    postVariable("MANU_AUTO", toggle.checked ? 1 : 0)
    if (paginaCargada)
        location.reload();

}
toggle.addEventListener("change", mostrarManual);

async function irHome() {
    let segundos = segundosManual * (calcularPorcentajeTranviaEnVia() / 1000);
    imgTranvia.style.transition = `transform ${segundos}s linear`;
    imgTranvia.style.transform = `translateX(0%)`;
}

toggleCiclo.addEventListener("change", async () => {
    localStorage.setItem("ciclo", toggleCiclo.checked)
    postVariable("B_A_R", toggleCiclo.checked ? 0 : 1)
    if (paginaCargada)
        location.reload();
})

ponerEnHome()
async function ponerEnHome() {
    //esperarHome()
    await postVariableWait("RESET", 1);
    postVariable("RESET", 0);
    await postVariableWait("MARTXA", 1);
    postVariable("MARTXA", 0)

    if (localStorage.getItem("manual") === "true") {
        toggle.click()
    } else if (localStorage.getItem("ciclo") === "true" || !localStorage.getItem("ciclo")) {
        toggleCiclo.click()
    }
    paginaCargada = true
}

document.getElementById("reset").addEventListener("click", async () => {
    location.reload();
});

async function esperarHome() {
    let divEspera = document.querySelector("#espera")
    divEspera.setAttribute("style", "display: flex;")
    let main = document.querySelector("main")
    main.setAttribute("style", "visibility: hidden")
    let home
    do {
        home = parseInt(await (await fetch("HOME.html")).text());
    } while (!home)
    cargadoHome = true
    divEspera.setAttribute("style", "display: none;")
    main.setAttribute("style", "visibility: visible")
}


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
    touchId = event.touches[0].identifier;
    moverimagenIzq();
});

botonIzq.addEventListener("touchend", () => {
    postVariable("BOTON_PATRAS", 0)
    pararTranvia()
    touchId = null;
});

botonDer.addEventListener("touchstart", (event) => {
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

botonIzq.addEventListener("touchend", () => {
    postVariable("BOTON_PATRAS", 0)
    pararTranvia()
    touchId = null;
});

botonDer.addEventListener("touchend", () => {
    postVariable("BOTON_PALANTE", 0)
    pararTranvia()
    touchId = null;
});
let segundosManual = 4.34
botonIzq.addEventListener("mousedown", moverimagenIzq);
botonIzq.addEventListener("mousemove", () => {
    postVariable("BOTON_PATRAS", 0)
    pararTranvia()
});

botonDer.addEventListener("mousedown", moverimagenDer);
botonDer.addEventListener("mousemove", () => {
    postVariable("BOTON_PALANTE", 0)
    pararTranvia()
});

botonDer.addEventListener("mouseup", () => {
    postVariable("BOTON_PALANTE", 0)
    pararTranvia()
});

botonIzq.addEventListener("mouseup", () => {
    postVariable("BOTON_PATRAS", 0)
    pararTranvia()
});

function pararTranvia() {
    let posi = calcularPorcentajeTranviaEnVia();
    imgTranvia.style.transform = `translateX(${posi}%)`;
}

function moverimagenIzq() {
    if (toggle.checked) {
        postVariable("BOTON_PATRAS", 1)
        postVariable("BOTON_PALANTE", 0)
        let segundos = segundosManual * (calcularPorcentajeTranviaEnVia() / 1000)
        imgTranvia.style.transition = `transform ${segundos}s linear`;
        imgTranvia.style.transform = `translateX(0%)`;
    }
}

function moverimagenDer() {
    if (toggle.checked) {
        postVariable("BOTON_PALANTE", 1)
        postVariable("BOTON_PATRAS", 0)
        let segundos = (segundosManual - (segundosManual * (calcularPorcentajeTranviaEnVia() / 1000)))
        imgTranvia.style.transition = `transform ${segundos}s linear`;
        imgTranvia.style.transform = `translateX(${1000 - calcularWidthTranviaPorcentaje()}%)`;
    }
}

