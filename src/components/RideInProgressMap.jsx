import {
  useEffect,
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
   ÍCONE DO VEÍCULO
======================================== */
const iconeVeiculo = L.divIcon({
  className: "ride-progress-car-marker",

  html: `
    <div class="ride-progress-car">
      🚙
    </div>
  `,

  iconSize: [50, 50],

  iconAnchor: [25, 25],
});


/* ========================================
   ÍCONE DO DESTINO
======================================== */
const iconeDestino = L.divIcon({
  className: "ride-progress-destination-marker",

  html: `
    <div class="ride-progress-destination-pin">
      📍
    </div>
  `,

  iconSize: [46, 46],

  iconAnchor: [23, 40],
});


/* ========================================
   AJUSTAR O ZOOM
======================================== */
function AjustarMapa({
  posicaoVeiculo,
  destino
}) {
  const map = useMap();

  useEffect(() => {
    if (!posicaoVeiculo || !destino) {
      return;
    }

    map.fitBounds(
      [
        posicaoVeiculo,
        destino
      ],
      {
        padding: [60, 60]
      }
    );

  }, [
    map,
    posicaoVeiculo,
    destino
  ]);

  return null;
}


/* ========================================
   MAPA DA VIAGEM
======================================== */
function RideInProgressMap({
  latitude,
  longitude,
  destino,
  onProgress
}) {

  /*
    Ponto inicial da viagem.

    É a localização real do usuário
    no momento em que a corrida começa.
  */
  const origem = [
    latitude,
    longitude
  ];


  /*
    Destino que a pessoa escolheu
    na tela de pedir corrida.
  */
  const posicaoDestino = [
    destino.latitude,
    destino.longitude
  ];


  /*
    Guarda todos os pontos da rota.
  */
  const [
    rotaViagem,
    setRotaViagem
  ] = useState([]);


  /*
    Guarda onde o carro está
    dentro da rota.
  */
  const [
    indiceVeiculo,
    setIndiceVeiculo
  ] = useState(0);


  /*
    Evita carregar a mesma rota
    várias vezes.
  */
  const rotaCarregada =
    useRef(false);


  /* ========================================
     BUSCAR A ROTA
  ======================================== */
  useEffect(() => {

    async function buscarRota() {

      if (rotaCarregada.current) {
        return;
      }

      rotaCarregada.current = true;


      /*
        O OSRM recebe:

        longitude, latitude
      */
      const origemLongitude =
        origem[1];

      const origemLatitude =
        origem[0];

      const destinoLongitude =
        posicaoDestino[1];

      const destinoLatitude =
        posicaoDestino[0];


      try {

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${origemLongitude},${origemLatitude};` +
          `${destinoLongitude},${destinoLatitude}` +
          `?overview=full&geometries=geojson`;


        const resposta =
          await fetch(url);


        if (!resposta.ok) {
          throw new Error(
            "Não foi possível calcular a rota da viagem."
          );
        }


        const dados =
          await resposta.json();


        if (
          !dados.routes ||
          dados.routes.length === 0
        ) {
          throw new Error(
            "Nenhuma rota disponível."
          );
        }


        /*
          O OSRM devolve:

          longitude, latitude

          e o Leaflet usa:

          latitude, longitude.
        */
        const coordenadas =
          dados.routes[0]
            .geometry
            .coordinates
            .map(
              ([longitude, latitude]) => [
                latitude,
                longitude
              ]
            );


        /*
          Para apresentação não queremos
          que a viagem dure vários minutos.

          Vamos reduzir a rota para
          aproximadamente 60 passos.
        */
        const quantidadePassos = 60;

        const rotaReduzida = [];


        for (
          let i = 0;
          i < quantidadePassos;
          i++
        ) {

          const proporcao =
            i /
            (quantidadePassos - 1);


          const indice =
            Math.floor(
              proporcao *
              (coordenadas.length - 1)
            );


          rotaReduzida.push(
            coordenadas[indice]
          );
        }


        setRotaViagem(
          rotaReduzida
        );


      } catch (erro) {

        console.error(
          "Erro ao criar rota da viagem:",
          erro
        );


        /*
          PLANO B

          Se o serviço externo falhar,
          criamos uma linha reta até
          o destino.

          Isso evita a apresentação
          ficar parada.
        */
        const rotaAlternativa = [];

        const passos = 60;


        for (
          let i = 0;
          i < passos;
          i++
        ) {

          const progresso =
            i /
            (passos - 1);


          const latitudeAtual =
            origem[0] +
            (
              posicaoDestino[0] -
              origem[0]
            ) *
            progresso;


          const longitudeAtual =
            origem[1] +
            (
              posicaoDestino[1] -
              origem[1]
            ) *
            progresso;


          rotaAlternativa.push([
            latitudeAtual,
            longitudeAtual
          ]);
        }


        setRotaViagem(
          rotaAlternativa
        );
      }
    }


    buscarRota();

  }, []);


  /* ========================================
     MOVIMENTAR O VEÍCULO
  ======================================== */
  useEffect(() => {

    if (rotaViagem.length === 0) {
      return;
    }


    /*
      A cada 800 milissegundos
      avançamos um ponto.

      60 passos x 0,8 segundos
      dá aproximadamente 48 segundos.
    */
    const intervalo =
      setInterval(() => {

        setIndiceVeiculo(
          (indiceAtual) => {

            if (
              indiceAtual >=
              rotaViagem.length - 1
            ) {

              clearInterval(
                intervalo
              );

              return indiceAtual;
            }


            return indiceAtual + 1;
          }
        );

      }, 800);


    return () => {
      clearInterval(intervalo);
    };

  }, [
    rotaViagem
  ]);


  /* ========================================
     CALCULAR PROGRESSO
  ======================================== */
  useEffect(() => {

    if (rotaViagem.length === 0) {
      return;
    }


    const progresso =
      indiceVeiculo /
      (
        rotaViagem.length - 1
      );


    /*
      Mandamos o progresso para:

      RideInProgress.jsx

      0 = 0%
      0.5 = 50%
      1 = 100%
    */
    onProgress?.(
      progresso
    );

  }, [
    indiceVeiculo,
    rotaViagem,
    onProgress
  ]);


  /* ========================================
     POSIÇÃO ATUAL DO CARRO
  ======================================== */
  const posicaoVeiculo =
    rotaViagem[
      indiceVeiculo
    ] || origem;


  return (
    <MapContainer
      center={origem}
      zoom={15}
      className="ride-progress-real-map"
      scrollWheelZoom={true}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      <AjustarMapa
        posicaoVeiculo={
          posicaoVeiculo
        }
        destino={
          posicaoDestino
        }
      />


      {/* ROTA COMPLETA */}

      {rotaViagem.length > 0 && (
        <Polyline
          positions={
            rotaViagem
          }
          pathOptions={{
            color: "#173b57",
            weight: 6,
            opacity: 0.34,
          }}
        />
      )}


      {/* PARTE DA ROTA JÁ PERCORRIDA */}

      {rotaViagem.length > 0 && (
        <Polyline
          positions={
            rotaViagem.slice(
              0,
              indiceVeiculo + 1
            )
          }
          pathOptions={{
            color: "#285c7a",
            weight: 6,
            opacity: 0.95,
          }}
        />
      )}


      {/* VEÍCULO */}

      <Marker
        position={
          posicaoVeiculo
        }
        icon={
          iconeVeiculo
        }
      >
        <Popup>
          Você está nesta parte
          da viagem.
        </Popup>
      </Marker>


      {/* DESTINO */}

      <Marker
        position={
          posicaoDestino
        }
        icon={
          iconeDestino
        }
      >
        <Popup>
          {destino.nome ||
            "Seu destino"}
        </Popup>
      </Marker>

    </MapContainer>
  );
}


export default RideInProgressMap;