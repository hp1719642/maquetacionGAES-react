// Mapa principal de Leaflet
let map;
let vehicleMarkers = [];

// Inicializar el mapa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (window.L && document.getElementById('realMap')) {
        initMap();
    }
    initEventListeners();
});

// Función para inicializar el mapa
function initMap() {
    // Crear el mapa centrado en una ubicación específica
    // Coordenadas de ejemplo: Buenos Aires, Argentina
    map = L.map('realMap').setView([-34.6037, -58.3816], 12);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Agregar vehículos de ejemplo
    addSampleVehicles();
}

// Función para agregar vehículos de ejemplo
function addSampleVehicles() {
    const vehicles = [
        {
            id: 'VV-001',
            coords: [-34.6037, -58.3816],
            status: 'normal',
            driver: 'Carlos Mendoza',
            route: 'Ruta Centro',
            lastUpdate: '2 minutos'
        },
        {
            id: 'VV-002',
            coords: [-34.6118, -58.4173],
            status: 'warning',
            driver: 'Ana López',
            route: 'Ruta Norte',
            lastUpdate: '5 minutos'
        },
        {
            id: 'VV-003',
            coords: [-34.5950, -58.3950],
            status: 'alert',
            driver: 'Roberto Díaz',
            route: 'Ruta Sur',
            lastUpdate: '1 minuto'
        },
        {
            id: 'VV-004',
            coords: [-34.5890, -58.4300],
            status: 'normal',
            driver: 'María González',
            route: 'Ruta Este',
            lastUpdate: '3 minutos'
        },
        {
            id: 'VV-005',
            coords: [-34.6200, -58.3700],
            status: 'warning',
            driver: 'Pedro Sánchez',
            route: 'Ruta Oeste',
            lastUpdate: '7 minutos'
        }
    ];

    vehicles.forEach(vehicle => {
        addVehicleToMap(vehicle);
    });
}

// Función para agregar un vehículo al mapa
function addVehicleToMap(vehicle) {
    // Crear icono personalizado según el estado
    const icon = L.divIcon({
        className: `vehicle-marker marker-${vehicle.status}`,
        html: `<div>${vehicle.id.split('-')[1]}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    // Crear marcador
    const marker = L.marker(vehicle.coords, { icon: icon })
        .addTo(map)
        .bindPopup(createVehiclePopup(vehicle));

    // Guardar referencia al marcador
    vehicleMarkers.push({
        id: vehicle.id,
        marker: marker,
        data: vehicle
    });
}

// Función para crear el contenido del popup
function createVehiclePopup(vehicle) {
    const statusText = {
        normal: 'Normal',
        warning: 'En Alerta',
        alert: 'Emergencia'
    }[vehicle.status] || 'Desconocido';

    const statusColor = {
        normal: 'var(--success)',
        warning: 'var(--warning)',
        alert: 'var(--accent)'
    }[vehicle.status] || 'var(--gray)';

    return `
        <div class="vehicle-popup">
            <h3>${vehicle.id}</h3>
            <p><strong>Estado:</strong> <span style="color: ${statusColor}">${statusText}</span></p>
            <p><strong>Chofer:</strong> ${vehicle.driver}</p>
            <p><strong>Ruta:</strong> ${vehicle.route}</p>
            <p><strong>Última actualización:</strong> ${vehicle.lastUpdate}</p>
            <div class="actions">
                <button class="btn-track" onclick="trackVehicle('${vehicle.id}')">Seguir</button>
                <button class="btn-alert" onclick="sendAlert('${vehicle.id}')">Alerta</button>
                <button onclick="showVehicleDetails('${vehicle.id}')">Detalles</button>
            </div>
        </div>
    `;
}

// Función para inicializar event listeners
function initEventListeners() {
    // Botón de actualizar mapa
    const refreshBtn = document.getElementById('refreshMap');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshMap);
    }

    // Botón de protocolo de emergencia
    const emergencyBtn = document.getElementById('emergencyProtocol');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', activateEmergencyProtocol);
    }

    // Botón de menú móvil
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const sidebarEl = document.getElementById('sidebar');
            if (sidebarEl) sidebarEl.classList.toggle('active');
        });
    }

    // Navegación del sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Simular actualización de alertas
    if (document.querySelector('.alert-badge')) {
        setInterval(updateAlertBadge, 30000);
    }
}

// Función para actualizar el mapa
function refreshMap() {
    const refreshBtn = document.getElementById('refreshMap');
    if (!refreshBtn) return;
    const icon = refreshBtn.querySelector('i');
    if (!icon) return;
    
    // Mostrar loading
    icon.className = 'fas fa-spinner fa-spin';
    refreshBtn.disabled = true;

    // Simular actualización
    setTimeout(() => {
        // Mover vehículos aleatoriamente (simulación)
        vehicleMarkers.forEach(vehicle => {
            if (Math.random() > 0.7) {
                const newLat = vehicle.data.coords[0] + (Math.random() - 0.5) * 0.01;
                const newLng = vehicle.data.coords[1] + (Math.random() - 0.5) * 0.01;
                vehicle.marker.setLatLng([newLat, newLng]);
                vehicle.data.coords = [newLat, newLng];
            }
        });

        // Restaurar botón
        icon.className = 'fas fa-sync-alt';
        refreshBtn.disabled = false;

        // Mostrar notificación
        showNotification('Mapa actualizado correctamente', 'success');
    }, 1500);
}

// Función para activar protocolo de emergencia
function activateEmergencyProtocol() {
    if (confirm('¿Está seguro de activar el protocolo de emergencia? Esto notificará a todas las unidades.')) {
        showNotification('Protocolo de emergencia activado', 'danger');
        // Aquí iría la lógica real para notificar a las unidades
    }
}

// Función para seguir un vehículo
function trackVehicle(vehicleId) {
    const vehicle = vehicleMarkers.find(v => v.id === vehicleId);
    if (vehicle) {
        map.setView(vehicle.data.coords, 15);
        vehicle.marker.openPopup();
        showNotification(`Siguiendo vehículo: ${vehicleId}`, 'info');
    }
}

// Función para enviar alerta a un vehículo
function sendAlert(vehicleId) {
    showNotification(`Alerta enviada a: ${vehicleId}`, 'warning');
}

// Función para mostrar detalles del vehículo
function showVehicleDetails(vehicleId) {
    const vehicle = vehicleMarkers.find(v => v.id === vehicleId);
    if (vehicle) {
        alert(`Detalles de ${vehicleId}:\nChofer: ${vehicle.data.driver}\nRuta: ${vehicle.data.route}\nEstado: ${vehicle.data.status}`);
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'danger' ? 'var(--accent)' : 'var(--info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para actualizar badge de alertas
function updateAlertBadge() {
    const alertBadge = document.querySelector('.alert-badge');
    if (!alertBadge) return;
    const currentCount = parseInt(alertBadge.textContent);
    const newCount = Math.max(1, currentCount + Math.floor(Math.random() * 3 - 1));
    alertBadge.textContent = newCount;
    
    // Efecto de notificación
    if (newCount > currentCount) {
        alertBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            alertBadge.style.transform = 'scale(1)';
        }, 300);
    }
}

// CSS animation para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);