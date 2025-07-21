// Zürich Mobility Intelligence Dashboard
// Demo für Amt für Mobilität

const { useState, useEffect, useRef } = React;

// Simulierte API Daten (in Produktion würde dies von der echten API kommen)
const PROVIDERS = ['publibike', 'bird', 'tier', 'voi', 'bond'];
const VEHICLE_TYPES = ['bike', 'e-bike', 'scooter', 'e-scooter'];
const ZURICH_CENTER = [47.3769, 8.5417];

// Mock Daten Generator
function generateMockVehicles() {
    return Array.from({ length: 50 }, (_, i) => ({
        id: `vehicle-${i}`,
        provider: PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)],
        type: VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)],
        lat: ZURICH_CENTER[0] + (Math.random() - 0.5) * 0.05,
        lng: ZURICH_CENTER[1] + (Math.random() - 0.5) * 0.08,
        battery: Math.floor(Math.random() * 100),
        available: Math.random() > 0.3,
        lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        predictedDemand: Math.floor(Math.random() * 100)
    }));
}

// Hauptkomponente
function MobilityDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState('all');
    const [showPredictions, setShowPredictions] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        avgBattery: 0,
        highDemandZones: 0,
        lowBatteryVehicles: 0
    });
    
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    // Daten Update Funktion
    const updateData = () => {
        const newVehicles = generateMockVehicles();
        setVehicles(newVehicles);
        
        // Statistiken berechnen
        const availableVehicles = newVehicles.filter(v => v.available);
        const avgBattery = Math.round(
            newVehicles.reduce((sum, v) => sum + v.battery, 0) / newVehicles.length
        );
        const highDemand = newVehicles.filter(v => v.predictedDemand > 70).length;
        const lowBattery = newVehicles.filter(v => v.battery < 20).length;
        
        setStats({
            total: newVehicles.length,
            available: availableVehicles.length,
            avgBattery,
            highDemandZones: highDemand,
            lowBatteryVehicles: lowBattery
        });
    };

    // Initial load und Auto-Update
    useEffect(() => {
        updateData();
        const interval = setInterval(updateData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Karte initialisieren
    useEffect(() => {
        if (!mapRef.current) {
            // Leaflet Map erstellen
            const map = L.map('map').setView(ZURICH_CENTER, 13);
            
            // Tile Layer hinzufügen (Dark Mode oder Light Mode)
            const tileUrl = darkMode 
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            
            L.tileLayer(tileUrl, {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            mapRef.current = map;
        }
        
        // Tile Layer updaten wenn Dark Mode sich ändert
        if (mapRef.current) {
            mapRef.current.eachLayer(layer => {
                if (layer instanceof L.TileLayer) {
                    layer.remove();
                }
            });
            
            const tileUrl = darkMode 
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            
            L.tileLayer(tileUrl, {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }
    }, [darkMode]);

    // Marker updaten
    useEffect(() => {
        if (!mapRef.current) return;
        
        // Alte Marker entfernen
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Gefilterte Fahrzeuge
        const filteredVehicles = selectedProvider === 'all' 
            ? vehicles 
            : vehicles.filter(v => v.provider === selectedProvider);
        
        // Neue Marker hinzufügen
        filteredVehicles.forEach(vehicle => {
            const color = vehicle.available ? '#22c55e' : '#ef4444';
            const size = showPredictions ? 10 + (vehicle.predictedDemand / 10) : 10;
            
            const marker = L.circleMarker([vehicle.lat, vehicle.lng], {
                radius: size,
                fillColor: color,
                color: darkMode ? '#fff' : '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(mapRef.current);
            
            // Popup hinzufügen
            marker.bindPopup(`
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-weight: bold;">${vehicle.provider.toUpperCase()}</h4>
                    <p style="margin: 4px 0;">Type: ${vehicle.type}</p>
                    <p style="margin: 4px 0;">Battery: ${vehicle.battery}%</p>
                    <p style="margin: 4px 0;">Status: ${vehicle.available ? 'Verfügbar' : 'In Benutzung'}</p>
                    ${showPredictions ? `<p style="margin: 4px 0;">Predicted Demand: ${vehicle.predictedDemand}%</p>` : ''}
                </div>
            `);
            
            markersRef.current.push(marker);
        });
    }, [vehicles, selectedProvider, showPredictions, darkMode]);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Zürich Mobility Intelligence
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Echtzeit Shared Mobility Analytics mit KI-Vorhersagen
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot"></span>
                                Live
                            </span>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg transition-colors ${
                                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <StatsCard
                        title="Total Fahrzeuge"
                        value={stats.total}
                        icon="🚲"
                        darkMode={darkMode}
                    />
                    <StatsCard
                        title="Verfügbar"
                        value={stats.available}
                        icon="✅"
                        color="text-green-500"
                        darkMode={darkMode}
                    />
                    <StatsCard
                        title="Ø Batterie"
                        value={`${stats.avgBattery}%`}
                        icon="🔋"
                        darkMode={darkMode}
                    />
                    <StatsCard
                        title="Hotspots"
                        value={stats.highDemandZones}
                        icon="🔥"
                        color="text-red-500"
                        darkMode={darkMode}
                    />
                    <StatsCard
                        title="Low Battery"
                        value={stats.lowBatteryVehicles}
                        icon="⚠️"
                        color="text-yellow-500"
                        darkMode={darkMode}
                    />
                </div>

                {/* Controls */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`}>
                                Provider:
                            </label>
                            <select 
                                value={selectedProvider} 
                                onChange={(e) => setSelectedProvider(e.target.value)}
                                className={`px-4 py-2 rounded-lg ${
                                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                }`}
                            >
                                <option value="all">Alle Provider</option>
                                {PROVIDERS.map(provider => (
                                    <option key={provider} value={provider}>
                                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <button
                            onClick={() => setShowPredictions(!showPredictions)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                showPredictions 
                                    ? 'bg-purple-600 text-white' 
                                    : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
                            }`}
                        >
                            📊 Demand Predictions
                        </button>
                        
                        <button
                            onClick={updateData}
                            className={`px-4 py-2 rounded-lg ${
                                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors`}
                        >
                            🔄 Daten aktualisieren
                        </button>
                    </div>
                </div>

                {/* Map */}
                <div className={`rounded-xl overflow-hidden shadow-2xl mb-6 ${
                    darkMode ? 'border border-gray-700' : ''
                }`}>
                    <div id="map" className="leaflet-container"></div>
                </div>

                {/* AI Insights */}
                <AIInsights darkMode={darkMode} vehicles={vehicles} />
            </main>
        </div>
    );
}

// Stats Card Component
function StatsCard({ title, value, icon, color = '', darkMode }) {
    return (
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {title}
                    </p>
                    <p className={`text-2xl font-bold ${color}`}>
                        {value}
                    </p>
                </div>
                <span className="text-2xl">{icon}</span>
            </div>
        </div>
    );
}

// AI Insights Component
function AIInsights({ darkMode, vehicles }) {
    const insights = [
        {
            icon: '🔥',
            title: 'Hotspot Warnung',
            text: 'Hohe Nachfrage am Hauptbahnhof in 30 Min erwartet',
            priority: 'high'
        },
        {
            icon: '⚡',
            title: 'Batterie-Optimierung',
            text: `${vehicles.filter(v => v.battery < 20).length} Fahrzeuge benötigen Aufladung`,
            priority: 'medium'
        },
        {
            icon: '📊',
            title: 'Nutzungsmuster',
            text: '23% mehr E-Bike Nutzung vs. letzte Woche',
            priority: 'low'
        }
    ];

    return (
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🤖</span> KI-gestützte Einblicke
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                    <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        } ${
                            insight.priority === 'high' ? 'border-red-500' : 
                            insight.priority === 'medium' ? 'border-yellow-500' : ''
                        }`}
                    >
                        <p className="font-semibold flex items-center gap-2">
                            <span>{insight.icon}</span>
                            {insight.title}
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// App rendern
ReactDOM.render(<MobilityDashboard />, document.getElementById('root'));