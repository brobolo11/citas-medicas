$(document).ready(function () {
    // Mostrar modal dar cita
    $('.tarjeta:contains("DAR CITA") .btn').on('click', function () {
      $('#modalCita').removeClass('d-none').addClass('mostrar');
      $('#formCita')[0].reset();
      $('#resultadoCita').empty();
      cargarEspecialistas();
    });
  
    // Cerrar con esc
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        $('#modalCita').addClass('d-none').removeClass('mostrar');
      }
    });
  
    // Cargar especialistas desde PHP
    function cargarEspecialistas() {
      $.get('especialistas.php', function (data) {
        const especialistas = JSON.parse(data);
        const $select = $('#selectEspecialista');
        $select.empty();
        if (especialistas.length === 0) {
          $select.append('<option value="">No hay especialistas disponibles</option>');
          return;
        }
        $select.append('<option value="">Selecciona un especialista</option>');
        especialistas.forEach(esp => {
            $select.append(
              `<option value="${esp.id}">${esp.nombre} - ${esp.especialidad}</option>`
            );
          });
      });
    }
  
    // Enviar formulario
    $('#formCita').on('submit', function (e) {
      e.preventDefault();
  
      const dni = $('#dniCita').val().trim();
      const especialista = $('#selectEspecialista').val();
      const fechaHora = $('#fechaHoraCita').val();
  
      if (!dni || !especialista || !fechaHora) {
        $('#resultadoCita').text("Todos los campos son obligatorios.");
        return;
      }
  
      $.post('crearCita.php', { dni, especialista, fechaHora }, function (respuesta) {
        $('#resultadoCita').text(respuesta);
      });
    });
  });
  