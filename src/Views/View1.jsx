import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Flex from "../Componente/FlexBox/page.js";

const App = () => {
  const [tareas, setTareas] = useState([]);
  const [tituloTarea, setTituloTarea] = useState("");
  const [descripcionTarea, setDescripcionTarea] = useState("");
  const [fechaTarea, setFechaTarea] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [contador, setContador] = useState(0);

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    const timestamp = date.getTime();
    return !isNaN(timestamp) && timestamp > Date.now();
  };

  const agregarTarea = () => {
    const fechaFormateada = `${fechaTarea.getFullYear()}-${(fechaTarea.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${fechaTarea.getDate().toString().padStart(2, "0")}`;

    if (tituloTarea && descripcionTarea) {
      if (!isValidDate(fechaFormateada)) {
        Alert.alert("Error", "La fecha debe ser una fecha futura.");
        return;
      }
      const nuevoId = contador + 1;
      setContador(nuevoId);
      
      const nuevaTarea = {
        id:nuevoId,
        titulo: tituloTarea,
        descripcion: descripcionTarea,
        vencimiento: fechaFormateada,
        completado: false,
        fechaAgregado: new Date().toISOString(),
        fechaCompletado: null,
      };
      setTareas([...tareas, nuevaTarea]);
      setTituloTarea("");
      setDescripcionTarea("");
      setFechaTarea(new Date());
      setShowPicker(false);
    } else {
      Alert.alert("Error", "Por favor, complete todos los campos.");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaTarea;
    setShowPicker(false);
    setFechaTarea(currentDate);
  };

  const marcarTarea = (index) => {
    const updatedTareas = tareas.map((tarea, i) => {
      if (i === index) {
        return {
          ...tarea, //creamos un nuevo objeto con las propiedades anteriores
          completado: !tarea.completado,
          fechaCompletado: !tarea.completado ? new Date().toISOString() : null,
        };
      }
      return tarea;
    });
    setTareas(updatedTareas);
  };

  const eliminarCard = (id) => {
    const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);
    setTareas(nuevasTareas);
  };

  return (
    <ScrollView style={styles.container}>
      <Flex />
      <View style={styles.formContainer}>
        <Text style={styles.header}>Agregar Tarea</Text>
        <TextInput
          style={styles.input}
          placeholder="Título Tarea"
          value={tituloTarea}
          onChangeText={setTituloTarea}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción Tarea"
          value={descripcionTarea}
          onChangeText={setDescripcionTarea}
        />

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            Fecha Tarea: {fechaTarea.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateButtonText}>Seleccionar Fecha</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={fechaTarea}
            mode="date"
            is24Hour={true}
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={agregarTarea}>
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tasksContainer}>
        <Text style={styles.header}>Tareas</Text>
        {tareas.map((tarea, index) => (
          <View key={tarea.id} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>
              <Text style={styles.bold}>Tarea:</Text> {tarea.titulo}
            </Text>
            <Text style={styles.taskDescription}>
              <Text style={styles.bold}>Descripción:</Text> {tarea.descripcion}
            </Text>
            <Text style={styles.taskDueDate}>
              <Text style={styles.bold}>Vencimiento:</Text> {tarea.vencimiento}
            </Text>
            <Text style={styles.taskDate}>
              Agregado el {new Date(tarea.fechaAgregado).toLocaleString()}
              {tarea.fechaCompletado &&
                ` - Completado el ${new Date(
                  tarea.fechaCompletado
                ).toLocaleString()}`}
            </Text>
            <TouchableOpacity onPress={() => marcarTarea(index)}>
              <Text style={styles.checkButton}>
                {tarea.completado ? "Desmarcar" : "Completar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.eliminarButton}
              onPress={() => eliminarCard(tarea.id)}
            >
              <Text style={styles.eliminarButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ead0a8",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  dateContainer: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  dateButton: {
    backgroundColor: "#b69f66",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#6b5428",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  tasksContainer: {
    marginTop: 20,
  },
  taskContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    color: "#333",
  },
  taskDescription: {
    fontSize: 16,
    color: "#666",
  },
  taskDueDate: {
    fontSize: 16,
    color: "#999",
  },
  taskDate: {
    fontSize: 14,
    color: "#777",
    marginVertical: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  checkButton: {
    color: "#007BFF",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default App;
