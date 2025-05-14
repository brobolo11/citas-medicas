const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const puerto = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const cliente = new MongoClient(uri);

// Ruta POST para dar de alta a un especialista
app.post("/alta-especialista", async (req, res) => {
    const { nombre, fechaNacimiento, especialidad } = req.body;

    // Validación básica
    if (!nombre || !fechaNacimiento || !especialidad) {
        return res.status(400).json({ message: "Faltan datos del formulario." });
    }

    try {
        await cliente.connect();
        const db = cliente.db("citas-medicas");
        const especialistas = db.collection("especialistas");

        // Guardamos el nuevo especialista en la colección
        await especialistas.insertOne({
            nombre,
            fechaNacimiento: new Date(fechaNacimiento),
            especialidad
        });

        res.status(200).json({ message: "Especialista guardado correctamente." });
    } catch (error) {
        console.error("Error al guardar especialista:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

// Inicia el servidor
app.listen(puerto, () => {
    console.log(`Servidor Express en http://localhost:${puerto}`);
});
