//Declaración de los archivos que manejara cada grafica
document.addEventListener('DOMContentLoaded', () => {
    const chartData = {
        bar: {
            elementId: 'bar-chart',
            title: 'Producción de Energía Renovable por Fuente (Colombia, 2021)',
            csvFiles: [
                '08_wind_generation.csv',
                '12_solar_energy_consumption.csv',
                '05_hydropower_consumption.csv',
                '16_biofuel_production.csv',
                '17_installed_geothermal_capacity.csv'
            ]
        },
        pie: {
            elementId: 'pie-chart',
            title: 'Participación de Energías Renovables (Colombia, 2021)',
            csvFiles: [
                '04_share_electricity_renewables.csv',
                '11_share_electricity_wind.csv',
                '15_share_electricity_solar.csv',
                '07_share-electricity-hydro.csv'
            ]
        },
        line: {
            elementId: 'line-chart',
            title: 'Tendencia en la Capacidad Instalada (Colombia)',
            csvFiles: [
                '09_cumulative_installed_wind_energy_capacity_gigawatts.csv',
                '13_installed_solar_PV_capacity.csv',
                '17_installed_geothermal_capacity.csv'
            ]
        },
        area: {
            elementId: 'area-chart',
            title: 'Comparación entre Consumo de Energía Renovable y Convencional (Colombia)',
            csvFiles: [
                '02_modern_renewable_energy_consumption.csv',
                '03_modern_renewable_prod.csv'
            ]
        }
    };

    //los busca en la carpeta archive2
    async function fetchCSV(filePath) {
        try {
            const response = await fetch(`../archive2/${filePath}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`Error loading file ${filePath}:`, error);
            return null;
        }
    }

    //filtra por los datos necesario en este caso por colombia año 2021
    function parseCSV(csvText, filterByCountry = false, year = null) {
        const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        const labels = rows[0];
        let dataRows = rows.slice(1);
        
        if (filterByCountry) {
            dataRows = dataRows.filter(row => row.includes('Colombia') && (!year || row.includes(year.toString())));
        } else {
            dataRows = dataRows.filter(row => row.includes('Colombia'));
        }

        if (dataRows.length === 0) {
            dataRows = [[labels[0], 'Colombia', year || 'N/A', 0]];
        }

        const data = dataRows.map(row => row.map((value, index) => index > 1 ? parseFloat(value) || 0 : value));
        return { labels, data };
    }

    //dos graficas necesitan todos los datos de colombia se aplica lo siguiente:
    async function createChart(config, type) {
        const datasets = await Promise.all(config.csvFiles.map(fetchCSV));
        const parsedDatasets = datasets.filter(csv => csv).map(csv => parseCSV(csv, type !== 'line' && type !== 'area', 2021));

        const labels = parsedDatasets[0].labels.slice(2);
        const data = parsedDatasets.map(({ data }) => data.map(row => row.slice(2)).flat());

        const ctx = document.getElementById(config.elementId).getContext('2d');
        new Chart(ctx, {
            type,
            data: {
                labels,
                datasets: data.map((values, index) => ({
                    label: config.csvFiles[index].replace('.csv', ''),
                    data: values,
                    backgroundColor: type === 'pie'
                        ? values.map((_, i) => `hsl(${i * 360 / values.length}, 70%, 50%)`)
                        : `rgba(${50 + index * 50}, ${100 + index * 20}, 200, 0.5)`,
                    fill: type === 'line' && config.elementId === 'area-chart'
                }))
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: config.title
                    }
                },
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    Object.entries(chartData).forEach(([type, config]) => {
        createChart(config, type === 'area' ? 'line' : type);
    });
});

//menu desplegable cuando la pagina se encuentra en responsive
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links'); 
    navLinks.classList.toggle('active');
}

// Cierra el menú al hacer clic en cualquier enlace de la navegación
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active'); // Remueve la clase 'active' para ocultar el menú
    });
});

