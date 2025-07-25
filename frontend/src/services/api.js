// Simple service to connect with the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

// Helper function to make HTTP requests
async function makeApiRequest(endpoint, options = {}) {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🌐 Making API request to: ${fullUrl}`);
  console.log(`📤 Request options:`, options);

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response ok: ${response.ok}`);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    
    // 🔍 LOG DETALLADO: Mostrar exactamente qué devuelve la API
    console.log(`📊 PREDICTION API RESPONSE:`, JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error("❌ API Request Error:", error);
    console.error("🔗 Failed URL:", fullUrl);
    throw error;
  }
}

// API service functions for each endpoint
export const apiService = {
  // Get all machines from backend
  getAllMachines: () => makeApiRequest("/machines"),

  // Get specific machine by ID
  getMachineById: (machineId) => makeApiRequest(`/machines/${encodeURIComponent(machineId)}`),

  // Create a new machine
  createMachine: (machineData) =>
    makeApiRequest("/machines", {
      method: "POST",
      body: JSON.stringify(machineData),
    }),

  // Update existing machine by ID
  updateMachine: (machineId, machineData) =>
    makeApiRequest(`/machines/${encodeURIComponent(machineId)}`, {
      method: "PUT",
      body: JSON.stringify(machineData),
    }),

  // Delete machine by ID
  deleteMachine: (machineId) =>
    makeApiRequest(`/machines/${encodeURIComponent(machineId)}`, {
      method: "DELETE",
    }),

  // Make failure prediction for a machine
  makePrediction: (predictionData) => {
    console.log(`🤖 PREDICTION REQUEST DATA (formatted):`, JSON.stringify(predictionData, null, 2));
    console.log(`📅 Date format check:`, {
      last_maintenance: predictionData.last_maintenance,
      type: typeof predictionData.last_maintenance,
      isValidFormat: /^\d{4}-\d{2}-\d{2}$/.test(predictionData.last_maintenance)
    });
  
    return makeApiRequest("/predict", {
      method: "POST",
      body: JSON.stringify(predictionData),
    });
  },
}