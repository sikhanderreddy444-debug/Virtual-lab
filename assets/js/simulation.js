// Initialize variables
let voltageData = [];
let currentData = [];
let readingCount = 0;

// DOM Elements
const voltageSlider = document.getElementById('voltageSlider');
const voltValDisplay = document.getElementById('voltVal');
const recordBtn = document.getElementById('recordBtn');
const resetBtn = document.getElementById('resetBtn');
const tableBody = document.querySelector('#obsTable tbody');

// Chart Setup
const ctx = document.getElementById('diodeChart').getContext('2d');
const diodeChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: voltageData,
        datasets: [{
            label: 'Forward Current (mA)',
            data: currentData,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Voltage (V)' } },
            y: { title: { display: true, text: 'Current (mA)' }, beginAtZero: true }
        }
    }
});

// Update slider value display
voltageSlider.addEventListener('input', function() {
    voltValDisplay.innerText = parseFloat(this.value).toFixed(2);
});

// Calculate Current (Simulated Diode Math)
function calculateCurrent(v) {
    // Simplified Shockley diode equation curve for simulation visual purposes
    // I = Is * (e^(V/(n*Vt)) - 1)
    if (v < 0.6) {
        return (v * 0.1); // Leakage/very low current
    } else {
        return Math.pow((v - 0.5), 2) * 50; // Exponential rise after knee voltage (~0.6V)
    }
}

// Record Reading Action
recordBtn.addEventListener('click', function() {
    let currentV = parseFloat(voltageSlider.value);
    
    // Prevent duplicate entries for the same voltage
    if(voltageData.includes(currentV)) {
        alert("Reading for this voltage already recorded!");
        return;
    }

    let currentI = calculateCurrent(currentV).toFixed(2);
    
    // Add to data arrays
    voltageData.push(currentV);
    currentData.push(currentI);
    
    // Sort arrays so the graph draws left to right regardless of the order recorded
    let combined = voltageData.map((v, i) => ({v, i: currentData[i]}));
    combined.sort((a, b) => a.v - b.v);
    voltageData.length = 0; currentData.length = 0;
    combined.forEach(obj => { voltageData.push(obj.v); currentData.push(obj.i); });

    readingCount++;

    // Add to Table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${readingCount}</td><td>${currentV.toFixed(2)}</td><td>${currentI}</td>`;
    tableBody.appendChild(newRow);

    // Update Chart
    diodeChart.update();
});

// Reset Experiment Action
resetBtn.addEventListener('click', function() {
    voltageData.length = 0;
    currentData.length = 0;
    readingCount = 0;
    voltageSlider.value = 0;
    voltValDisplay.innerText = "0.0";
    tableBody.innerHTML = '';
    diodeChart.update();
});
