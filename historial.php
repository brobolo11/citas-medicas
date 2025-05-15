<?php
require 'vendor/autoload.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dni = $_POST['dni'] ?? '';

    try {
        $cliente = new MongoDB\Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); // tu URI
        $coleccion = $cliente->selectCollection('citas-medicas', 'citas');

        $citas = $coleccion->find(['pacienteDNI' => $dni]);
        $resultado = [];

        foreach ($citas as $cita) {
            $fecha = $cita['fecha']->toDateTime()->format('Y-m-d H:i');
            $resultado[] = [
                'especialista' => $cita['especialistaNombre'],
                'fecha' => $fecha,
                'asistio' => $cita['asistio'] ? 'Sí' : 'No'
            ];
        }

        echo json_encode(['success' => true, 'citas' => $resultado]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'mensaje' => 'Error en la consulta']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
}
