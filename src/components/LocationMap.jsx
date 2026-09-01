import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap
} from "react-leaflet";

import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";

const iconePadrao = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconePadrao;

function AjustarMapa({
  posicaoAtual,
  posicaoDestino
}) {
  const map = useMap();

  useEffect(() => {
    if (posicaoDestino) {
      map.fitBounds(
        [
          posicaoAtual,
          posicaoDestino
        ],
        {
          padding: [50, 50]
        }
      );
    } else {
      map.setView(
        posicaoAtual,
        16
      );
    }
  }, [
    map,
    posicaoAtual,
    posicaoDestino
  ]);

  return null;
}

function LocationMap({
  latitude,
  longitude,
  destino,
  rota
}) {
  const posicaoAtual = [
    latitude,
    longitude
  ];

  const posicaoDestino = destino
    ? [
        destino.latitude,
        destino.longitude
      ]
    : null;

  return (
    <MapContainer
      center={posicaoAtual}
      zoom={16}
      scrollWheelZoom={true}
      className="real-map"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarMapa
        posicaoAtual={posicaoAtual}
        posicaoDestino={posicaoDestino}
      />

      <Circle
        center={posicaoAtual}
        radius={35}
        pathOptions={{
          color: "#285c7a",
          fillColor: "#285c7a",
          fillOpacity: 0.15
        }}
      />

      <Marker position={posicaoAtual}>
        <Popup>
          Sua localização atual.
        </Popup>
      </Marker>

      {posicaoDestino && (
        <Marker position={posicaoDestino}>
          <Popup>
            {destino.nome}
          </Popup>
        </Marker>
      )}

      {rota && rota.length > 0 && (
        <Polyline
          positions={rota}
          pathOptions={{
            color: "#173b57",
            weight: 6,
            opacity: 0.9
          }}
        />
      )}
    </MapContainer>
  );
}

export default LocationMap;