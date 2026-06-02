import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LaunchMap ({launchpad}){
    if(!launchpad?.latitude || !launchpad?.longitude){
        return <p>No hay coordenadas disponibles</p>
    }

    const position = [ launchpad.latitude, launchpad.longitude ];

    return(
        <div className="map-wrapper">
            <MapContainer center={position} zoom={10} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position}>
                    <Popup>{launchpad.full_name}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default LaunchMap;