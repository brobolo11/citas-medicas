$(document).ready(function () {
    // Mostrar el modal al clicar en el botón "CONSULTAR CITA"
    $('.tarjeta:contains("CONSULTAR CITA") .btn').on('click', function () {
      $('#modalConsultar').removeClass('d-none').addClass('mostrar');
      $('#resultadoConsulta').empty();
      $('#formAsistencia button').show();
    });
  
    // Cerrar modal con ESC
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        $('#modalConsultar').addClass('d-none').removeClass('mostrar');
      }
    });
  
    // Buscar citas al enviar DNI (formulario principal)
    $('#formAsistencia').on('submit', function (e) {
      e.preventDefault();
  
      const dni = $('#dniConsulta').val().trim();
      if (!dni) return;
  
      $.post('consultarCita.php', { dni }, function (respuesta) {
        $('#resultadoConsulta').html(respuesta);
        $('#btnAceptarDNI').hide();
      });
    });
  
    
    $('#resultadoConsulta').on('submit', '#formActualizarAsistencia', function (e) {
      e.preventDefault();
      console.log("Formulario de asistencia enviado");
  
      const $form = $(this);
      const citaId = $form.find('#citaId').val().trim();
      const asistencia = $form.find('#asistio').val().trim().toLowerCase();
  
      if (!citaId || (asistencia !== 's' && asistencia !== 'n')) {
        $('#resultadoConsulta').append("<p>Introduce 's' o 'n' correctamente.</p>");
        return;
      }
  
      $.post('actualizarAsistencia.php', { citaId, asistencia }, function (respuesta) {
        console.log("Respuesta de consultarCita.php:", respuesta);
        $('#resultadoConsulta').append(`<p>${respuesta}</p>`);
      });
    });
});