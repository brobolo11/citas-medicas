<?php
require 'vendor/autoload.php';
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

$cliente = new Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority");
$coleccion = $cliente->selectCollection('citas-medicas', 'citas');

$citaId = $_POST['citaId'] ?? '';
$asistencia = $_POST['asistencia'] ?? '';

if ($citaId && ($asistencia === 's' || $asistencia === 'n')) {
    $asistio = $asistencia === 's';

    try {
        $resultado = $coleccion->updateOne(
            ['_id' => new ObjectId($citaId)],
            ['$set' => ['asistio' => $asistio]]
        );

        if ($resultado->getModifiedCount() === 1) {
            echo "Asistencia actualizada.";
        } elseif ($resultado->getMatchedCount() === 1) {
            echo "No hubo cambios, la asistencia ya estaba actualizada.";
        } else {
            echo "No se encontró la cita para actualizar.";
        }
    } catch (Exception $e) {
        echo "Error al actualizar: " . $e->getMessage();
    }
} else {
    echo "Datos inválidos. Debes enviar citaId y asistencia 's' o 'n'.";
}