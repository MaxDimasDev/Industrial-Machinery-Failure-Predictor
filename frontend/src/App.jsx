import { useState, useEffect, useCallback } from "react"
import { apiService } from "./services/api"
import MachineCard from "./components/MachineCard"
import MachineForm from "./components/MachineForm"
import PredictionForm from "./components/PredictionForm"
import PredictionResult from "./components/PredictionResult"
import AlertPanel from "./components/AlertPanel"
import "./styles/App.css"

function App() {
  // State management
  const [machineList, setMachineList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoChecking, setIsAutoChecking] = useState(false)
  const [showMachineForm, setShowMachineForm] = useState(false)
  const [showPredictionForm, setShowPredictionForm] = useState(false)
  const [machineBeingEdited, setMachineBeingEdited] = useState(null)
  const [selectedMachineForPrediction, setSelectedMachineForPrediction] = useState(null)
  const [predictionData, setPredictionData] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Estado para predicciones automáticas
  const [machinePredictions, setMachinePredictions] = useState({})
  const [failedMachines, setFailedMachines] = useState([])
  const [lastAutoCheck, setLastAutoCheck] = useState(null)

  // Display temporary notification message
  const displayNotification = (messageText, isErrorMessage = false) => {
    setNotificationMessage({ text: messageText, isError: isErrorMessage })
    setTimeout(() => setNotificationMessage(""), 5000)
  }

  // Fetch all machines from the API
  const fetchAllMachines = async () => {
    try {
      setIsLoading(true)
      const machinesData = await apiService.getAllMachines()
      setMachineList(machinesData)
    } catch (error) {
      displayNotification("Failed to load machines", true)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para hacer predicción automática de una máquina
  const makeSingleAutoPrediction = async (machine) => {
    try {
      console.log("🤖 Prediction data BEFORE sending:", machine);
      
      // Verificar que tenemos todos los datos necesarios
      const requiredFields = ['machine_id', 'temperature', 'vibration', 'pressure', 'oil_level'];
      const missingFields = requiredFields.filter(field => 
        machine[field] === undefined || machine[field] === null || machine[field] === ''
      );
                                
    if (missingFields.length > 0) {
      console.warn(`⚠️ Missing fields for machine ${machine.machine_id}:`, missingFields);
      return null;
    }

    // Formatear la fecha correctamente
    let formattedDate = machine.last_maintenance;
    if (formattedDate && formattedDate.includes('T')) {
      // Convertir de ISO string a YYYY-MM-DD
      formattedDate = new Date(formattedDate).toISOString().split('T')[0];
    }
    
    console.log("📅 Date format verification:", {
      original: machine.last_maintenance,
      formatted: formattedDate,
      isCorrectFormat: /^\d{4}-\d{2}-\d{2}$/.test(formattedDate)
    });

    const predictionData = {
      machine_id: machine.machine_id,
      temperature: parseFloat(machine.temperature),
      vibration: parseFloat(machine.vibration),
      pressure: parseFloat(machine.pressure),
      oil_level: parseFloat(machine.oil_level),
      error_code: machine.error_code || "NONE",
      last_maintenance: formattedDate || new Date().toISOString().split('T')[0],
      running_hours: Math.floor(Math.random() * 1000) + 100, // Este campo parece ser calculado
    };

    console.log("🔍 Final prediction data:", predictionData);

    const result = await apiService.makePrediction(predictionData);
    
    console.log("📊 Prediction result for", machine.machine_id, ":", result);
    
    return {
      machine_id: machine.machine_id,
      machine_name: machine.name,
      prediction: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Error predicting for machine ${machine.machine_id}:`, error);
    return null;
  }
};
    // Función para hacer predicciones automáticas de todas las máquinas
  const runAutomaticPredictions = useCallback(async () => {
    if (machineList.length === 0) return

    setIsAutoChecking(true)
    console.log("🤖 Running automatic predictions for all machines...")

    try {
      const predictions = {}
      const failed = []

      // Hacer predicciones para todas las máquinas
      for (const machine of machineList) {
        const predictionResult = await makeSingleAutoPrediction(machine)

        if (predictionResult) {
          predictions[machine.machine_id] = predictionResult

          // ✅ CORREGIDO: Verificar si la máquina está en falla
          // prediction = 1 significa FALLA, prediction = 0 significa NORMAL
          const isFailure = predictionResult.prediction.prediction === 1

          console.log(`🔍 Machine ${machine.machine_id}:`, {
            prediction: predictionResult.prediction.prediction,
            probability: predictionResult.prediction.probability,
            isFailure: isFailure
          })

          if (isFailure) {
            failed.push({
              machine_id: machine.machine_id,
              machine_name: machine.name,
              failure_probability: predictionResult.prediction.probability,
              prediction_value: predictionResult.prediction.prediction,
              estimated_hours: "Unknown", // Tu API no devuelve este campo
            })
          }
        }
      }

      setMachinePredictions(predictions)
      setFailedMachines(failed)
      setLastAutoCheck(new Date())

      // Mostrar notificación si hay máquinas en falla
      if (failed.length > 0) {
        displayNotification(`⚠️ ALERT: ${failed.length} machine(s) require immediate attention!`, true)
      } else {
        displayNotification("✅ All machines are operating normally")
      }
    } catch (error) {
      displayNotification("Error during automatic predictions", true)
    } finally {
      setIsAutoChecking(false)
    }
  }, [machineList])

  // Configurar polling automático cada 10 minutos
  useEffect(() => {
    if (machineList.length === 0) return

    // Ejecutar inmediatamente al cargar
    runAutomaticPredictions()

    // Configurar intervalo de 10 minutos (600,000 ms)
    const interval = setInterval(
      () => {
        runAutomaticPredictions()
      },
      10 * 60 * 1000,
    ) // 10 minutos

    return () => clearInterval(interval)
  }, [machineList, runAutomaticPredictions])

  // Save machine (create new or update existing)
  const handleSaveMachine = async (machineFormData) => {
    try {
      if (machineBeingEdited) {
        await apiService.updateMachine(machineBeingEdited.machine_id, machineFormData)
        displayNotification("Machine updated successfully")
      } else {
        await apiService.createMachine(machineFormData)
        displayNotification("Machine created successfully")
      }
      setShowMachineForm(false)
      setMachineBeingEdited(null)
      fetchAllMachines()
    } catch (error) {
      displayNotification("Failed to save machine", true)
    }
  }

  // Delete machine with confirmation
  const handleDeleteMachine = async (machineId, machineName) => {
    if (!confirm(`Are you sure you want to delete machine "${machineName}"?`)) return

    try {
      await apiService.deleteMachine(machineId)
      displayNotification("Machine deleted successfully")

      // Limpiar predicciones de la máquina eliminada
      const newPredictions = { ...machinePredictions }
      delete newPredictions[machineId]
      setMachinePredictions(newPredictions)

      fetchAllMachines()
    } catch (error) {
      displayNotification("Failed to delete machine", true)
    }
  }

  // Open prediction form for a specific machine
  const handleOpenPredictionForm = (machine) => {
    setSelectedMachineForPrediction(machine)
    setShowPredictionForm(true)
  }

  // Execute failure prediction
  const handleMakePrediction = async (predictionFormData) => {
    try {
      const predictionResult = await apiService.makePrediction(predictionFormData)
      setPredictionData(predictionResult)
      setShowPredictionForm(false)
      setSelectedMachineForPrediction(null)
      displayNotification("Prediction completed successfully")
    } catch (error) {
      displayNotification("Failed to make prediction", true)
    }
  }

  // Función para refrescar manualmente
  const handleManualRefresh = () => {
    fetchAllMachines()
    if (machineList.length > 0) {
      runAutomaticPredictions()
    }
  }

  // Load machines when component mounts
  useEffect(() => {
    fetchAllMachines()
  }, [])

  // Función para obtener el estado de una máquina
  const getMachineStatus = (machineId) => {
    const prediction = machinePredictions[machineId]
    if (!prediction) return "unknown"

    // Prediction = 1 means Failure
    const isFailure = prediction.prediction.prediction === 1

    return isFailure ? "failure" : "normal"
  }
  
  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>🔧 Industrial Machinery Failure Predictor</h1>
          <div className="status-info">
            {lastAutoCheck && <span className="last-check">Last check: {lastAutoCheck.toLocaleTimeString()}</span>}
            {isAutoChecking && <span className="checking-status">🔄 Checking all machines...</span>}
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-refresh" onClick={handleManualRefresh} disabled={isAutoChecking}>
            🔄 {isAutoChecking ? "Checking..." : "Refresh All"}
          </button>
          <button className="btn btn-primary" onClick={() => setShowMachineForm(true)}>
            + Add Machine
          </button>
        </div>
      </header>

      {/* Panel de alertas para máquinas en falla */}
      {failedMachines.length > 0 && (
        <AlertPanel failedMachines={failedMachines} onDismiss={() => setFailedMachines([])} />
      )}

      {/* Notification message */}
      {notificationMessage && (
        <div className={`message ${notificationMessage.isError ? "error" : "success"}`}>{notificationMessage.text}</div>
      )}

      {/* Loading indicator */}
      {isLoading && <div className="loading">Loading machines...</div>}

      {/* Machines grid or empty state */}
      {!isLoading && (
        <div className="machines-grid">
          {machineList.length === 0 ? (
            <div className="empty-state">
              <p>No machines registered in the system</p>
              <button className="btn btn-primary" onClick={() => setShowMachineForm(true)}>
                Add First Machine
              </button>
            </div>
          ) : (
            machineList.map((machine, index) => (
              <MachineCard
                key={index}
                machineData={machine}
                predictionStatus={getMachineStatus(machine.machine_id)}
                lastPrediction={machinePredictions[machine.machine_id]}
                onEditClick={() => {
                  setMachineBeingEdited(machine)
                  setShowMachineForm(true)
                }}
                onDeleteClick={() => handleDeleteMachine(machine.machine_id, machine.name)}
                onPredictClick={() => handleOpenPredictionForm(machine)}
              />
            ))
          )}
        </div>
      )}

      {/* Machine form modal */}
      {showMachineForm && (
        <MachineForm
          existingMachine={machineBeingEdited}
          onSaveClick={handleSaveMachine}
          onCancelClick={() => {
            setShowMachineForm(false)
            setMachineBeingEdited(null)
          }}
        />
      )}

      {/* Prediction form modal */}
      {showPredictionForm && (
        <PredictionForm
          selectedMachine={selectedMachineForPrediction}
          onPredictClick={handleMakePrediction}
          onCancelClick={() => {
            setShowPredictionForm(false)
            setSelectedMachineForPrediction(null)
          }}
        />
      )}

      {/* Prediction result modal */}
      {predictionData && (
        <PredictionResult predictionResult={predictionData} onCloseClick={() => setPredictionData(null)} />
      )}
    </div>
  )
}

export default App