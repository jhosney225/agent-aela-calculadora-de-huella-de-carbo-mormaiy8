
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Initialize readline for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main carbon footprint calculator
async function calculateCarbonFootprint() {
  console.log("\n=== CALCULADORA DE HUELLA DE CARBONO PERSONAL ===\n");
  console.log(
    "Responde las siguientes preguntas sobre tu estilo de vida para calcular tu huella de carbono.\n"
  );

  // Collect user data
  const userData = {};

  // Transport questions
  userData.transportType = await prompt(
    "¿Cuál es tu principal medio de transporte? (auto/transporte_publico/bicicleta/viaje_aereo): "
  );
  userData.transportDistance = await prompt(
    "¿Cuántos km recorres por semana en transporte? (número): "
  );

  // Energy questions
  userData.homeEnergy = await prompt(
    "¿Cuál es tu fuente de energía del hogar? (electricidad/gas/renovable): "
  );
  userData.energyMonthly = await prompt(
    "¿Cuántos kWh usas mensualmente? (número aproximado): "
  );

  // Diet questions
  userData.diet = await prompt(
    "¿Cuál es tu tipo de dieta? (omnivora/vegetariana/vegana): "
  );
  userData.meatServingsPerWeek = await prompt(
    "¿Cuántas porciones de carne comes por semana? (número): "
  );

  // Waste questions
  userData.recycling = await prompt(
    "¿Reciclas regularmente? (si/no/parcialmente): "
  );
  userData.wastePerWeek = await prompt(
    "¿Cuántos kg de residuos generas por semana? (número aproximado): "
  );

  // Additional factors
  userData.newClothing = await prompt(
    "¿Cuántas prendas de ropa nuevas compras por mes? (número): "
  );
  userData.waterUsage = await prompt(
    "¿Cuál es tu consumo de agua diario? (bajo/medio/alto): "
  );

  // Prepare the data for Claude analysis
  const userDataSummary = `
Usuario ha proporcionado los siguientes datos:
- Transporte: Tipo=${userData.transportType}, Distancia semanal=${userData.transportDistance}km
- Energía del hogar: Fuente=${userData.homeEnergy}, Consumo mensual=${userData.energyMonthly}kWh
- Dieta: Tipo=${userData.diet}, Porciones de carne por semana=${userData.meatServingsPerWeek}
- Residuos: Reciclaje=${userData.recycling}, Generación semanal=${userData.wastePerWeek}kg
- Consumo: Prendas nuevas por mes=${userData.newClothing}, Uso de agua=${userData.waterUsage}
`;

  // Use Claude to analyze and calculate the carbon footprint
  console.log(
    "\n\nAnalizando tu huella de carbono con IA (Claude)...\n"
  );

  const conversationHistory = [];

  // First turn: Initial analysis
  conversationHistory.push({
    role: "user",
    content: `${userDataSummary}

Por favor, calcula la huella de carbono estimada para esta persona basándote en los datos proporcionados. 
Proporciona:
1. Cálculo detallado por categoría (transporte, energía, dieta, residuos, consumo)
2. Total anual en kg CO2e
3. Comparación con el promedio mundial (aproximadamente 4 toneladas por persona)
4. Una breve evaluación del impacto`,
  });

  try {
    const response1 = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: conversationHistory,
    });

    const assistantMessage = response1.content[0].text;
    conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    console.log("=== ANÁLISIS DE HUELLA DE CARBONO ===\n");
    console.log(assistantMessage);

    // Second turn: Ask for recommendations
    conversationHistory.push({
      role: "user",
      content: `Basándote en el análisis anterior, proporciona 5 recomendaciones específicas y prácticas 
para que esta persona reduzca su huella de carbono. Incluye el impacto potencial de cada recomendación 
en términos de reducción de CO2e anual.`,
    });

    const response2 = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: conversationHistory,
    });

    const recommendations = response2.content[0].text;
    conversationHistory.push({
      role: "assistant",
      content: recommendations,
    });

    console.log("\n=== RECOMENDACIONES PARA REDUCIR TU HUELLA DE CARBONO ===\n");
    console.log(recommendations);

    // Third turn: Ask for implementation plan
    conversationHistory.push({
      role: "user",
      content: `Crea un plan de acción de 90 días para implementar estas recomendaciones. 
Organiza el plan en:
1. Semanas 1-4: Cambios