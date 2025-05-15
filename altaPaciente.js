$(document).ready(function () {
    // Mostrar modal
    $('.tarjeta:contains("DAR DE ALTA A PACIENTE") .btn').on('click', function () {
      $('#modalAlta').removeClass('d-none').addClass('mostrar');
    });
  
    // Cerrar con ESC
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        $('#modalAlta').addClass('d-none').removeClass('mostrar');
      }
    });
  
    // Enviar datos a PHP
    $('#formAlta').on('submit', function (e) {
      e.preventDefault();
    
      const nombre = $('#nombreAlta').val().trim();
      const dni = $('#dniAlta').val().trim();
    
      console.log("Enviando:", { nombre, dni });
      alert("Nombre: " + nombre + "\nDNI: " + dni);
    
      if (!nombre || !dni) return;
    
      $.post('altaPaciente.php', { nombre, dni }, function (respuesta) {
        $('#resultadoAlta').html(`<p>${respuesta}</p>`);
        console.log("Respuesta:", respuesta);
      });
    });    
  });
  