$(document).ready(function () {
    const btnAlta = $(".tarjeta button:contains('DAR DE ALTA A ESPECIALISTA')");
    const modal = $(".modalAdmin");
    const form = $(".modalAdmin form");

    btnAlta.on("click", function () {
        modal.removeClass("d-none").addClass("d-flex");
    });

    // Dar a la tecla esc cierra el formulario
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            modal.removeClass("d-flex").addClass("d-none");
        }
    });

    form.find("button").on("click", function () {
        const nombre = form.find("input").eq(0).val();
        const fechaNacimiento = form.find("input").eq(1).val();
        const especialidad = form.find("input").eq(2).val();

        if (!nombre || !fechaNacimiento || !especialidad) {
            alert("Rellena todos los campos.");
            return;
        }

        $.ajax({
            url: "http://localhost:3000/alta-especialista",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                nombre,
                fechaNacimiento,
                especialidad
            }),
            success: function (response) {
                alert(response.message);
                modal.removeClass("d-flex").addClass("d-none");
                form.trigger("reset");
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || "Error al guardar el especialista.";
                alert(msg);
            }
        });
    });
});
