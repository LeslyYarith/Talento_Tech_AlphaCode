//Javascript necesario para mostrar la tabla
const folderPath = '../archive2'; 
const fileName = '06_Energia_Hidroelectrica.csv'; // Solo un archivo ahora

const chartCanvas = document.getElementById('chart');
const ctx = chartCanvas.getContext('2d');

//carga los datos
async function fetchCSV(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText} para el archivo: ${filePath}`);
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error(`Error al cargar ${filePath}:`, error);
        alert(`Error al cargar ${filePath}: ${error.message}`); // Mostrar alerta de error
        return null; 
    }
}

function parseCSV(csv) {
  if (!csv) return []; 
  const rows = csv.split('\n');
  return rows.map(row => row.split(',').map(cell => cell.trim())); 
}

function renderTable(data, fileName) {
    let tableHTML = `<table class="responsive-table"><caption>${fileName}</caption>`; 

    data.forEach((row, index) => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            const cellElement = index === 0 ? '<th>' : '<td>';
            tableHTML += `${cellElement}${cell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</table>';
    return tableHTML; 
}

async function loadCSV() {
    const csvData = await fetchCSV(`${folderPath}/${fileName}`);
    const parsedData = parseCSV(csvData);
    const tableHTML = renderTable(parsedData, fileName);
    document.getElementById('table-container-wrapper').innerHTML = tableHTML; // Reemplaza el contenido
}

loadCSV();