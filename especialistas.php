<?php
require 'vendor/autoload.php';
use MongoDB\Client;

$cliente = new Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority");
$coleccion = $cliente->selectCollection('citas-medicas', 'especialistas');

$cursor = $coleccion->find();
$especialistas = [];

foreach ($cursor as $doc) {
    $especialistas[] = [
        'id' => (string) $doc['_id'],
        'nombre' => $doc['nombre'],
        'especialidad' => $doc['especialidad']
    ];
}

echo json_encode($especialistas);
