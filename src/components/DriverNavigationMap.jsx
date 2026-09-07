import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


/* ========================================
   ÍCONE DO MOTORISTA
======================================== */

const iconeMotorista = L.divIcon({
  className: "driver-navigation-car-marker",

  html: `
    <div class="driver-navigation-car">
      🚙
    </div>
  `,

  iconSize: [48, 48],

  iconAnchor: [24, 24]
});


/* ========================================
   ÍCONE DO PASSAGEIRO
======================================== */

const iconePassageiro = L.divIcon({
  className: "driver-navigation-passenger-marker",

  html: `
    <div class="driver-navigation-passenger">
      👤
    </div>
  `,

  iconSize: [46, 46],

  iconAnchor: [23, 40]
});


/* ========================================
   ÍCONE DO DESTINO
======================================== */

const iconeDestino = L.divIcon({
  className: "driver-navigation-destination-marker",

  html: `
    <div class="driver-navigation-destination">
      📍
    </div>
  `,

  iconSize: [46, 46],

  iconAnchor: [23, 40]
});


/* ========================================
   AJUSTAR MAPA
======================================== */

function AjustarMapa({
  veiculo,
  destino
}) {
  const map =
    useMap();

  useEffect(() => {
    if (
      !veiculo ||
      !destino
    ) {
      return;
    }

    map.fitBounds(
      [
        veiculo,
        destino
      ],
      {
        padding: [50, 50],
        maxZoom: 16
      }
    );
  }, [
    map,
    veiculo,
    destino
  ]);

  return null;
}


/* ========================================
   MAPA DO MOTORISTA
======================================== */

function DriverNavigationMap({
  corrida,
  etapa,
  onProgress,
  onChegouPassageiro,
  onChegouDestino
}) {
  const [
    rota,
    setRota
  ] = useState([]);

  const [
    indiceVeiculo,
    setIndiceVeiculo
  ] = useState(0);

  const [
    destinoAjustado,
    setDestinoAjustado
  ] = useState(null);

  const rotaCarregada =
    useRef(false);


  // ========================================
  // POSIÇÕES
  // ========================================

  const posicaoMotorista =
    useMemo(
      () => [
        corrida.motoristaPosicao.latitude,
        corrida.motoristaPosicao.longitude
      ],
      [
        corrida.motoristaPosicao.latitude,
        corrida.motoristaPosicao.longitude
      ]
    );

  const posicaoPassageiro =
    useMemo(
      () => [
        corrida.passageiroPosicao.latitude,
        corrida.passageiroPosicao.longitude
      ],
      [
        corrida.passageiroPosicao.latitude,
        corrida.passageiroPosicao.longitude
      ]
    );

  const posicaoDestino =
    useMemo(
      () => [
        corrida.destinoPosicao.latitude,
        corrida.destinoPosicao.longitude
      ],
      [
        corrida.destinoPosicao.latitude,
        corrida.destinoPosicao.longitude
      ]
    );


  // ========================================
  // DEFINIR ORIGEM E DESTINO
  // ========================================

  const origem =
    useMemo(
      () => {
        if (
          etapa === "chegou" ||
          etapa === "andamento"
        ) {
          return posicaoPassageiro;
        }

        return posicaoMotorista;
      },
      [
        etapa,
        posicaoMotorista,
        posicaoPassageiro
      ]
    );

  const destino =
    useMemo(
      () => {
        if (
          etapa === "andamento"
        ) {
          return posicaoDestino;
        }

        return posicaoPassageiro;
      },
      [
        etapa,
        posicaoPassageiro,
        posicaoDestino
      ]
    );


  // ========================================
  // REINICIAR ROTA AO MUDAR ETAPA
  // ========================================

  useEffect(() => {
    rotaCarregada.current =
      false;

    setRota([]);

    setIndiceVeiculo(
      0
    );

    setDestinoAjustado(
      null
    );
  }, [
    etapa
  ]);


  // ========================================
  // BUSCAR ROTA
  // ========================================

  useEffect(() => {
    async function buscarRota() {
      if (
        etapa === "chegou"
      ) {
        setRota([
          posicaoPassageiro
        ]);

        setIndiceVeiculo(
          0
        );

        return;
      }

      if (
        rotaCarregada.current
      ) {
        return;
      }

      rotaCarregada.current =
        true;

      const origemLongitude =
        origem[1];

      const origemLatitude =
        origem[0];

      const destinoLongitude =
        destino[1];

      const destinoLatitude =
        destino[0];

      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${origemLongitude},${origemLatitude};` +
          `${destinoLongitude},${destinoLatitude}` +
          `?overview=full&geometries=geojson`;

        const resposta =
          await fetch(
            url
          );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível calcular a rota."
          );
        }

        const dados =
          await resposta.json();

        if (
          !dados.routes ||
          dados.routes.length === 0
        ) {
          throw new Error(
            "Nenhuma rota encontrada."
          );
        }

        const coordenadas =
          dados.routes[0]
            .geometry
            .coordinates
            .map(
              (
                [
                  longitude,
                  latitude
                ]
              ) => [
                latitude,
                longitude
              ]
            );


        // ========================================
        // AJUSTAR DESTINO REAL DA ROTA
        // ========================================

        if (
          etapa === "andamento" &&
          coordenadas.length > 0
        ) {
          setDestinoAjustado(
            coordenadas[
              coordenadas.length - 1
            ]
          );
        }


        // ========================================
        // REDUZIR ROTA PARA ANIMAÇÃO
        // ========================================

        const quantidadePassos =
          45;

        const rotaReduzida =
          [];

        for (
          let i = 0;
          i < quantidadePassos;
          i++
        ) {
          const proporcao =
            i /
            (
              quantidadePassos -
              1
            );

          const indice =
            Math.floor(
              proporcao *
              (
                coordenadas.length -
                1
              )
            );

          rotaReduzida.push(
            coordenadas[indice]
          );
        }

        setRota(
          rotaReduzida
        );
      } catch (erro) {
        console.error(
          "Erro ao criar rota:",
          erro
        );


        // ========================================
        // PLANO B
        // ========================================

        const rotaAlternativa =
          [];

        const passos =
          45;

        for (
          let i = 0;
          i < passos;
          i++
        ) {
          const progresso =
            i /
            (
              passos -
              1
            );

          const latitudeAtual =
            origem[0] +
            (
              destino[0] -
              origem[0]
            ) *
            progresso;

          const longitudeAtual =
            origem[1] +
            (
              destino[1] -
              origem[1]
            ) *
            progresso;

          rotaAlternativa.push([
            latitudeAtual,
            longitudeAtual
          ]);
        }

        if (
          etapa === "andamento"
        ) {
          setDestinoAjustado(
            rotaAlternativa[
              rotaAlternativa.length - 1
            ]
          );
        }

        setRota(
          rotaAlternativa
        );
      }
    }

    buscarRota();
  }, [
    origem,
    destino,
    etapa,
    posicaoPassageiro
  ]);


  // ========================================
  // MOVIMENTAR VEÍCULO
  // ========================================

  useEffect(() => {
    if (
      rota.length === 0
    ) {
      return;
    }

    if (
      etapa === "chegou"
    ) {
      return;
    }

    const intervalo =
      setInterval(() => {
        setIndiceVeiculo(
          (
            indiceAtual
          ) => {
            if (
              indiceAtual >=
              rota.length - 1
            ) {
              clearInterval(
                intervalo
              );

              return indiceAtual;
            }

            return indiceAtual + 1;
          }
        );
      }, 850);

    return () => {
      clearInterval(
        intervalo
      );
    };
  }, [
    rota,
    etapa
  ]);


  // ========================================
  // PROGRESSO DA ROTA
  // ========================================

  useEffect(() => {
    if (
      rota.length <= 1
    ) {
      return;
    }

    const progresso =
      indiceVeiculo /
      (
        rota.length - 1
      );

    onProgress?.(
      progresso
    );

    if (
      progresso >= 1
    ) {
      if (
        etapa === "buscar"
      ) {
        onChegouPassageiro?.();
      }

      if (
        etapa === "andamento"
      ) {
        onChegouDestino?.();
      }
    }
  }, [
    indiceVeiculo,
    rota,
    etapa,
    onProgress,
    onChegouPassageiro,
    onChegouDestino
  ]);


  // ========================================
  // POSIÇÃO ATUAL DO CARRO
  // ========================================

  const posicaoAtualVeiculo =
    etapa === "chegou"
      ? posicaoPassageiro
      : rota[
          indiceVeiculo
        ] ||
        origem;


  // ========================================
  // DESTINO EXIBIDO
  // ========================================

  const destinoExibido =
    etapa === "andamento" &&
    destinoAjustado
      ? destinoAjustado
      : destino;


  // ========================================
  // PARTE JÁ PERCORRIDA
  // ========================================

  const rotaPercorrida =
    rota.slice(
      0,
      indiceVeiculo + 1
    );


  return (
    <MapContainer
      center={
        origem
      }
      zoom={15}
      className="driver-navigation-map"
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      zoomControl={true}
      dragging={true}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      <AjustarMapa
        veiculo={
          posicaoAtualVeiculo
        }
        destino={
          destinoExibido
        }
      />


      {/* ========================================
          ROTA COMPLETA
      ======================================== */}

      {rota.length > 1 && (
        <Polyline
          positions={
            rota
          }
          pathOptions={{
            color: "#173b57",
            weight: 6,
            opacity: 0.3
          }}
        />
      )}


      {/* ========================================
          ROTA JÁ PERCORRIDA
      ======================================== */}

      {rotaPercorrida.length > 1 && (
        <Polyline
          positions={
            rotaPercorrida
          }
          pathOptions={{
            color: "#285c7a",
            weight: 6,
            opacity: 0.95
          }}
        />
      )}


      {/* ========================================
          CARRO
      ======================================== */}

      <Marker
        position={
          posicaoAtualVeiculo
        }
        icon={
          iconeMotorista
        }
      >
        <Popup>
          {etapa === "buscar"
            ? "Você está indo buscar o passageiro."
            : etapa === "chegou"
              ? "Você chegou ao passageiro."
              : "Você está indo para o destino."}
        </Popup>
      </Marker>


      {/* ========================================
          PASSAGEIRO
      ======================================== */}

      {etapa === "buscar" && (
        <Marker
          position={
            posicaoPassageiro
          }
          icon={
            iconePassageiro
          }
        >
          <Popup>
            {corrida.passageiro}
            {" está aguardando aqui."}
          </Popup>
        </Marker>
      )}


      {/* ========================================
          DESTINO
      ======================================== */}

      {etapa === "andamento" && (
        <Marker
          position={
            destinoExibido
          }
          icon={
            iconeDestino
          }
        >
          <Popup>
            {corrida.destino}
          </Popup>
        </Marker>
      )}

    </MapContainer>
  );
}

export default DriverNavigationMap;