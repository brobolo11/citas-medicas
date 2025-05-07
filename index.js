const { MongoClient } = require('mongodb');
const readline = require('readline-sync');
const uri="mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db("citas-medicas");
  const especialistas = db.collection("especialistas");
  const pacientes = db.collection("pacientes");
  const citas = db.collection("citas");

  console.log("SISTEMA DE CITAS MEDICAS");

  const usuario = readline.question("Usuario (admin/administrativo): ");
  const contrasena = readline.question("Contrasena: ", { hideEchoBack: true });

  if (contrasena !== "1234") {
    console.log("Contrasena incorrecta");
    return;
  }

  if (usuario === "admin") {
    while (true) {
      console.log("\n--- Menu Admin ---");
      console.log("1. Dar de alta especialista");
      console.log("0. Salir");
      const opcion = readline.question("Opcion: ");

      if (opcion === "1") {
        const nombre = readline.question("Nombre del especialista: ");
        const fechaNacimiento = readline.question("Fecha (YYYY-MM-DD): ");
        const especialidad = readline.question("Especialidad: ")
        await especialistas.insertOne({ nombre, fechaNacimiento: new Date(fechaNacimiento), especialidad });
        console.log("Especialista guardado");
      } else if (opcion === "0") {
        break;
      }
    }
  }

  else if (usuario === "administrativo") {
    while (true) {
      console.log("\n--- Menu Administrativo ---");
      console.log("1. Dar de alta paciente");
      console.log("2. Ver historial de paciente");
      console.log("3. Crear cita");
      console.log("4. Marcar asistencia a cita");
      console.log("0. Salir");
      const opcion = readline.question("Opcion: ");

      if (opcion === "1") {
        const nombre = readline.question("Nombre del paciente: ");
        const dni = readline.question("DNI: ");
        await pacientes.insertOne({ nombre, dni });
        console.log("Paciente guardado.");
      }

      else if (opcion === "2") {
        const dni = readline.question("DNI del paciente: ");
        const paciente = await pacientes.findOne({ dni });
      
        if (!paciente) {
          console.log("Paciente no encontrado.");
        } else {
          const historial = await citas.find({ pacienteDNI: dni }).toArray();
      
          if (historial.length === 0) {
            console.log("No hay citas registradas para este paciente.");
          } else {
            console.log(`Historial de citas para ${paciente.nombre}:`);
            historial.forEach(cita => {
              console.log(`- Especialista: ${cita.especialistaNombre}, Fecha: ${cita.fecha.toISOString().replace('T', ' ').substring(0, 16)}, Asistió: ${cita.asistio === null ? "Pendiente" : cita.asistio ? "Sí" : "No"}`);
            });
          }
        }
      }

      else if (opcion === "3") {
        const pacienteDNI = readline.question("DNI del paciente: ");
        const listaEspecialistas = await especialistas.find().sort({ nombre: 1 }).toArray();
      
        if (listaEspecialistas.length === 0) {
          console.log("No hay especialistas disponibles. Añade alguno desde el menú admin.");
          return;
        }
      
        console.log("Especialistas disponibles:");
        listaEspecialistas.forEach((especialista, i) => {
          console.log(`${i + 1}. ${especialista.nombre} - Especialidad: ${especialista.especialidad}`);
        });
      
        const especialistaNombre = readline.question("Nombre del especialista: ");
        const existeEspecialista = listaEspecialistas.some(esp => esp.nombre.toLowerCase() === especialistaNombre.toLowerCase());
      
        if (!existeEspecialista) {
          console.log("Especialista no encontrado. Asegúrate de escribirlo tal como aparece en la lista.");
          return;
        }
      
        const especialista = listaEspecialistas.find(esp => esp.nombre.toLowerCase() === especialistaNombre.toLowerCase());
        const especialidad = especialista.especialidad;
        const fechaString = readline.question("Fecha y hora (YYYY-MM-DD HH:mm): ");
        const [fechaParte, horaParte] = fechaString.split(' ');
        const [ano, mes, dia] = fechaParte.split('-').map(Number);
        const [hora, minuto] = horaParte.split(':').map(Number);
        const fecha = new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
      
        await citas.insertOne({
          pacienteDNI,
          especialistaNombre,
          especialidad,
          fecha,
          asistio: null
        });
      
        console.log("Cita creada con éxito.");
      }
      

      else if (opcion === "4") {
        const dni = readline.question("DNI del paciente: ");
        
        const citasPaciente = await citas.find({ pacienteDNI: dni }).sort({ fecha: 1 }).toArray();
      
        if (citasPaciente.length === 0) {
          console.log("No hay citas registradas para este paciente.");
        } else {
          console.log(`Historial de citas para el paciente con DNI ${dni}:`);
      
          for (let cita of citasPaciente) {
            const especialista = await especialistas.findOne({ nombre: cita.especialistaNombre });
      
            if (especialista) {
              const fechaHora = cita.fecha.toISOString().replace('T', ' ').substring(0, 16);
              console.log(`${cita.especialistaNombre} - ${especialista.especialidad} - ${fechaHora}`);
            }
          }
      
          const fechaString = readline.question("Fecha de la cita (YYYY-MM-DD HH:mm): ");
          const [fechaParte, horaParte] = fechaString.split(' ');
          const [ano, mes, dia] = fechaParte.split('-').map(Number);
          const [hora, minuto] = horaParte.split(':').map(Number);
          
          const fecha = new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
          
          const cita = await citas.findOne({ pacienteDNI: dni, fecha });
      
          if (!cita) {
            console.log("Cita no encontrada.");
          } else {
            const asistencia = readline.question("Asistio el paciente? (s/n): ");
            const asistio = asistencia.toLowerCase() === "s";
            await citas.updateOne({ _id: cita._id }, { $set: { asistio } });
            console.log("Asistencia actualizada.");
          }
        }
      }

      else if (opcion === "0") {
        break;
      }
    }
  }

  await client.close();
}

main();