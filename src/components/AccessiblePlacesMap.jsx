import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


/* ========================================
   ÍCONE DO USUÁRIO
======================================== */

const iconeUsuario = L.divIcon({
  className: "accessible-user-marker",

  html: `
    <div class="accessible-user-dot">
      <span></span>
    </div>
  `,

  iconSize: [42, 42],

  iconAnchor: [21, 21],
});


/* ========================================
   ÍCONE DOS LOCAIS
======================================== */

const iconeLocal = L.divIcon({
  className: "accessible-place-marker",

  html: `
    <div class="accessible-place-pin">
      <span></span>
    </div>
  `,

  iconSize: [34, 42],
  iconAnchor: [17, 42],
});


/* ========================================
   AJUSTAR MAPA
======================================== */

function AjustarMapa({
  usuario,
  localSelecionado
}) {
  const map = useMap();

  useEffect(() => {

    /*
      Se a pessoa selecionar um local,
      centralizamos nele.
    */

    if (localSelecionado) {

      map.setView(
        [
          localSelecionado.latitude,
          localSelecionado.longitude
        ],
        17
      );

      return;
    }


    /*
      Se nenhum local foi selecionado,
      mostramos a região do usuário.
    */

    if (usuario) {
      map.setView(
        usuario,
        15
      );
    }

  }, [
    map,
    usuario,
    localSelecionado
  ]);

  return null;
}


/* ========================================
   MAPA ACESSÍVEL
======================================== */

function AccessiblePlacesMap({
  latitude,
  longitude,
  locais,
  localSelecionado,
  onSelecionarLocal
}) {

  /*
    Essa é a posição REAL do usuário,
    recebida pelo GPS.
  */

  const usuario = [
    latitude,
    longitude
  ];


  return (
    <MapContainer
      center={usuario}
      zoom={15}
      className="accessible-real-map"
      scrollWheelZoom={true}
    >

      {/* ========================================
          MAPA DO OPENSTREETMAP
      ======================================== */}

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* ========================================
          CENTRALIZAR MAPA
      ======================================== */}

      <AjustarMapa
        usuario={usuario}
        localSelecionado={
          localSelecionado
        }
      />


      {/* ========================================
          ÁREA APROXIMADA DO USUÁRIO
      ======================================== */}

      <Circle
        center={usuario}
        radius={45}
        pathOptions={{
          color: "#285c7a",
          fillColor: "#285c7a",
          fillOpacity: 0.12
        }}
      />


      {/* ========================================
          MARCADOR DO USUÁRIO
      ======================================== */}

      <Marker
        position={usuario}
        icon={iconeUsuario}
      >

        <Popup>
          Você está aqui.
        </Popup>

      </Marker>


      {/* ========================================
          MARCADORES DOS LOCAIS
      ======================================== */}

      {locais.map((local) => (
  <Marker
    key={local.id}
    position={[
      local.latitude,
      local.longitude
    ]}
    icon={iconeLocal}
    eventHandlers={{
      click: () => {
        onSelecionarLocal(local);
      }
    }}
  />
))}

    </MapContainer>
  );
}


export default AccessiblePlacesMap;