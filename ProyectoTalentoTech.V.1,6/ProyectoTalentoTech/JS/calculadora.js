//Funcion para calcular el porcentaje
async function calcularPorcentaje() {
    const consumoTotalKwhMes = parseFloat(document.getElementById('consumption').value);
    const tipoEnergia = document.getElementById('renewableType').value;

    if (isNaN(consumoTotalKwhMes) || consumoTotalKwhMes <= 0 || !tipoEnergia) {
        alert("Por favor, ingresa un consumo válido y selecciona un tipo de energía.");
        return;
    }

    //Declaración de los archivos excel para buscar el dato correcto
    const valorUsuariosTwhAño = (consumoTotalKwhMes / 1000) * 12;
    const archivos = {
        solar: '12_solar_energy_consumption.csv',
        hidroelectrica: '05_hydropower_consumption.csv',
        eolica: '11_share_electricity_wind.csv'
    };

    const rutaBase = '../archive2/';
    const archivoSeleccionado = archivos[tipoEnergia];

    try {
        const response = await fetch(rutaBase + archivoSeleccionado);
        const csvText = await response.text();
        const data = Papa.parse(csvText, { header: true }).data;

        const registroColombia2021 = data.find(row => row.Entity === 'Colombia' && row.Year === '2021');
        if (!registroColombia2021) {
            throw new Error("Datos para Colombia en 2021 no encontrados.");
        }

        const energiaTwh = parseFloat(Object.values(registroColombia2021)[2]);
        if (isNaN(energiaTwh) || energiaTwh <= 0) {
            throw new Error("El valor de energía es inválido.");
        }

        const porcentajeUsuario = (valorUsuariosTwhAño / energiaTwh) * 100;
        mostrarResultado(porcentajeUsuario, energiaTwh, tipoEnergia, valorUsuariosTwhAño, consumoTotalKwhMes);

    } catch (error) {
        console.error("Error al procesar los datos:", error);
        alert("Hubo un error al calcular el porcentaje.");
    }
}

//Funcion para el manejo del modal
function mostrarResultado(porcentaje, energiaTwh, tipoEnergia, consumoAnual, consumoUsuario) {
    const resultModal = document.getElementById('resultModal');
    const resultText = document.getElementById('resultText');
    const evaluacionConsumo = porcentaje < 1 ? 'bajo' : 'adecuado';

    resultText.innerText = `Has ingresado un consumo de ${consumoUsuario} kWh/mes. 
Tu consumo anual corresponde al ${porcentaje.toFixed(2)}% de la producción ${tipoEnergia} de Colombia en 2021. 
Tu consumo es considerado ${evaluacionConsumo}.`;

    const ctx = document.getElementById('energyChart').getContext('2d');
    
    if (window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Consumo Usuario (TWh)', 'Producción Total (TWh)', 'Porcentaje (%)'],
            datasets: [{
                label: `Comparación de ${tipoEnergia}`,
                data: [consumoAnual, energiaTwh, porcentaje],
                backgroundColor: ['#3498db', '#2ecc71', '#f1c40f']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true
                },
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    type: 'logarithmic', 
                }
            }
        }
    });

    resultModal.classList.remove('hidden');
    document.getElementById('energyForm').classList.add('hidden'); // Esconde el formulario al abrir el modal

    document.getElementById('downloadData').onclick = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Consumo Ingresado (kWh/mes)', 'Tipo de Energía', 'Consumo Anual (TWh)', 'Producción Total (TWh)', 'Porcentaje (%)'],
            [consumoUsuario, tipoEnergia, consumoAnual, energiaTwh, porcentaje.toFixed(2)]
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');
        XLSX.writeFile(wb, 'datos_energia.xlsx');
    };

    document.getElementById('closeModal').onclick = () => {
        resultModal.classList.add('hidden');
        document.getElementById('energyForm').classList.remove('hidden'); // Muestra de nuevo el formulario
        document.getElementById('energyForm').reset(); // Limpia los campos del formulario
    };
}

document.getElementById('energyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    calcularPorcentaje();
});
const resultModal = document.getElementById("resultModal");
const closeModalButton = document.getElementById("closeModal");
const body = document.body;

// Muestra el modal y ajusta la clase del body
function showModal() {
    resultModal.classList.remove("hidden");
    body.classList.add("modal-active");
}

// Oculta el modal y restaura la clase del body
closeModalButton.addEventListener("click", () => {
    resultModal.classList.add("hidden");
    body.classList.remove("modal-active");
});

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links'); // Asegúrate de que sea .nav-links
    navLinks.classList.toggle('active');
}

// Cierra el menú al hacer clic en cualquier enlace de la navegación
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active'); // Remueve la clase 'active' para ocultar el menú
    });
});

