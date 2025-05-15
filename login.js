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
          console.log("DATA RECIBIDA:", data);
          alert(data.mensaje);
          if (data.success) {
            if (nombre === 'admin') {
              window.location.href = 'admin.html';
            } else {
              window.location.href = 'administrativo.html';
            }
          }
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
          console.log("Respuesta completa:", xhr.responseText);
          alert("Ocurrió un error al intentar iniciar sesión.");
        }
      });
      
    });
  });
  