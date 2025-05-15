<?php
require 'vendor/autoload.php';
use MongoDB\Client;

$cliente = new Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority");
$coleccion = $cliente->selectCollection('citas-medicas', 'citas');

$dni = $_POST['dni'] ?? '';

if ($dni) {
    $citas = $coleccion->find(['pacienteDNI' => $dni]);

    $texto = "<p>Historial de citas para el paciente con DNI $dni:</p>";
    $formOpciones = '';

    foreach ($citas as $cita) {
        $id = (string) $cita['_id'];
        $especialista = $cita['especialistaNombre'] ?? 'Desconocido';
        $especialidad = $cita['especialidad'] ?? 'Desconocida';
        $fecha = $cita['fecha']->toDateTime()->format('Y-m-d H:i');
        $texto .= "<p>$especialista - $especialidad - $fecha</p>";

        // Menu de opciones de citas
        $formOpciones .= "<option value=\"$id\">$fecha</option>";
    }

    if ($formOpciones) {
        $texto .= '
        <form id="formActualizarAsistencia" class="mt-3">
        <p>Selecciona una cita:</p>
        <select id="citaId" class="form-select mb-2">' . $formOpciones . '</select>
        <p>¿Asistió el paciente? (s/n):</p>
        <input type="text" id="asistio" class="form-control mb-2" required>
        <button type="submit" class="btn btn-secondary mt-2">Actualizar asistencia</button>
        </form>';
    } else {
        $texto .= "<p>No se encontraron citas.</p>";
    }

    echo $texto;
} else {
    echo "DNI no proporcionado.";
}
