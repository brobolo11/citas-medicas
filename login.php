<?php
require 'vendor/autoload.php'; // Solo si usas Composer (recomendado)

header('Content-Type: application/json');

// Verifica que llegaron datos POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    try {
        $cliente = new MongoDB\Client("mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        $coleccion = $cliente->selectCollection('citas-medicas', 'login');

        $usuario = $coleccion->findOne([
            'nombre' => $nombre,
            'contrasena' => $contrasena
        ]);

        if ($usuario) {
            echo json_encode(['success' => true, 'mensaje' => 'Login exitoso']);
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'Credenciales incorrectas']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'mensaje' => 'Error al conectar con MongoDB']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
}
