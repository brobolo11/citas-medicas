$(document).ready(function () {
  const modal = $('#modalPaciente');
  const form = $('#formHistorial');
  const resultado = $('#resultadoHistorial');

  // Mostrar modal
  $('#btnHistorialPaciente').on('click', function () {
      modal.removeClass('d-none').addClass('d-flex');
      resultado.html('');
  });

  // Cerrar con esc
  $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
          modal.removeClass('d-flex').addClass('d-none');
      }
  });

  // Enviar formulario
  form.on('submit', function (e) {
      e.preventDefault();
      const dni = $('#dniInput').val().trim();
      if (!dni) {
          resultado.html('<p class="text-danger">Introduce un DNI válido.</p>');
          return;
      }

      $.ajax({
          url: 'http://localhost/citas-medicas/historial.php',
          method: 'POST',
          data: { dni: dni },
          success: function (data) {
              if (data.success && data.citas.length > 0) {
                  let html = '<h5>Historial de citas:</h5><ul>';
                  data.citas.forEach(cita => {
                      html += `<li>Especialista: ${cita.especialista}, Fecha: ${cita.fecha}, Asistió: ${cita.asistio}</li>`;
                  });
                  html += '</ul>';
                  resultado.html(html);
              } else {
                  resultado.html('<p class="text-warning">No se encontraron citas para este paciente.</p>');
              }
          },
          error: function (xhr) {
              resultado.html('<p class="text-danger">Error al consultar el historial.</p>');
              console.error("Error servidor:", xhr.responseText);
          }
      });
  });
});
