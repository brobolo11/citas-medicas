<?php
require 'vendor/autoload.php';
use MongoDB\Client;

try {
    $cliente = new Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    $coleccion = $cliente->selectCollection('citas-medicas', 'pacientes');

    $nombre = $_POST['nombre'] ?? '';
    $dni = $_POST['dni'] ?? '';

    if ($nombre && $dni) {
        $existe = $coleccion->findOne(['dni' => $dni]);
        if ($existe) {
            echo "El paciente ya existe.";
        } else {
            // Verificar si se conecta correctamente
            $insertResult = $coleccion->insertOne(['nombre' => $nombre, 'dni' => $dni]);

            if ($insertResult->getInsertedCount() === 1) {
                echo "Paciente dado de alta correctamente con ID: " . $insertResult->getInsertedId();
            } else {
                echo "Error: No se insertó ningún documento.";
            }
        }
    } else {
        echo "Faltan datos.";
    }
} catch (Exception $e) {
    echo "Error del servidor: " . $e->getMessage();
}
?>
