$(document).ready(function () {
    $('#loginBtn').on('click', function () {
      const nombre = $('#nombre').val();
      const contrasena = $('#contrasena').val();
  
      $.ajax({
        url: 'http://localhost/citas-medicas/login.php',
        method: 'POST',
        data: {
          nombre: nombre,
          contrasena: contrasena
        },
        success: function (data) {
          alert(data.mensaje);
          if (data.success) {
            if (nombre === 'admin') {
              window.location.href = 'inicioAdmin.html';
            } else {
              window.location.href = 'inicioAdministrativo.html';
            }
          }
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
          alert("Ocurrió un error al intentar iniciar sesión.");
        }
      });
      
    });
  });
  