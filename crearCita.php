<?php
require 'vendor/autoload.php';

use MongoDB\Client;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

$cliente = new Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority");
$baseDatos = $cliente->selectDatabase('citas-medicas');
$coleccionPacientes = $baseDatos->selectCollection('pacientes');
$coleccionEspecialistas = $baseDatos->selectCollection('especialistas');
$coleccionCitas = $baseDatos->selectCollection('citas');

$dni = $_POST['dni'] ?? '';
$espId = $_POST['especialista'] ?? '';
$fechaHora = $_POST['fechaHora'] ?? '';

// Validación de datos incompletos
if (empty($dni) || empty($espId) || empty($fechaHora)) {
    echo "Datos incompletos. Debes completar DNI, especialista y fecha/hora.";
    exit;
}

try {
    // Verificar si el paciente existe
    $paciente = $coleccionPacientes->findOne(['dni' => $dni]);

    if (!$paciente) {
        echo "El paciente con DNI $dni no existe.";
        exit;
    }

    // Verificar si el especialista existe
    $espDoc = $coleccionEspecialistas->findOne([
        '_id' => new ObjectId($espId)
    ]);

    if (!$espDoc) {
        echo "Especialista no encontrado.";
        exit;
    }

    // Validar y convertir fecha y hora
    try {
        $fecha = new DateTime($fechaHora);
        $fechaMongo = new UTCDateTime($fecha->getTimestamp() * 1000);
    } catch (Exception $e) {
        echo "Formato de fecha/hora inválido.";
        exit;
    }

    // Insertar la cita
    $cita = [
        'pacienteDNI' => $dni,
        'especialistaNombre' => $espDoc['nombre'],
        'especialidad' => $espDoc['especialidad'],
        'fecha' => $fechaMongo,
        'asistio' => null
    ];

    $coleccionCitas->insertOne($cita);

    echo "Cita creada con éxito.";

} catch (Exception $e) {
    echo "Error al crear la cita: " . $e->getMessage();
}
