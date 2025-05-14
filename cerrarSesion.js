document.addEventListener("DOMContentLoaded", function () {
    const botonCerrarSesion = document.getElementById("cerrarSesion");

    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }
});