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
  Circle,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


/* ========================================
   ÍCONE DO MOTORISTA
======================================== */

const iconeMotorista = L.divIcon({
  className: "driver-map-marker",

  html: `
    <div class="driver-map-car">
      🚗
    </div>
  `,

  iconSize: [48, 48],

  iconAnchor: [24, 24],
});


/* ========================================
   ÍCONE DO USUÁRIO
======================================== */

const iconeUsuario = L.divIcon({
  className: "user-map-marker",

  html: `
    <div class="user-map-dot">
      <span></span>
    </div>
  `,

  iconSize: [40, 40],

  iconAnchor: [20, 20],
});


/* ========================================
   AJUSTAR O MAPA AUTOMATICAMENTE
======================================== */

function AjustarMapa({
  usuario,
  motorista
}) {
  const map = useMap();
  const ajustouMapa = useRef(false);

  useEffect(() => {
    if (
      !usuario ||
      !motorista ||
      ajustouMapa.current
    ) {
      return;
    }

    map.fitBounds(
      [
        usuario,
        motorista
      ],
      {
        padding: [35, 35],
        maxZoom: 16
      }
    );

    ajustouMapa.current = true;
  }, [
    map,
    usuario,
    motorista
  ]);

  return null;
}

/* ========================================
   MAPA DE ACOMPANHAMENTO
======================================== */

function DriverTrackingMap({
  latitude,
  longitude,
  onProgress
}) {

  /*
    A localização do usuário vem
    do GPS real do dispositivo.
  */

  const usuario = [
    latitude,
    longitude
  ];


  /*
    Aqui vamos guardar todos os
    pontos que o motorista precisa
    percorrer.
  */

  const [
    rotaMotorista,
    setRotaMotorista
  ] = useState([]);


  /*
    Esse número representa em qual
    ponto da rota o motorista está.

    Exemplo:

    índice 0 = começo
    índice 10 = avançou
    índice 44 = chegou
  */

  const [
    indiceMotorista,
    setIndiceMotorista
  ] = useState(0);


  /*
    Evita buscar a rota várias vezes.

    O useEffect pode executar novamente,
    mas queremos criar a rota apenas uma vez.
  */

  const rotaCarregada =
    useRef(false);


  /* ========================================
     CRIAR A ROTA DO MOTORISTA
  ======================================== */

  useEffect(() => {

    async function buscarRotaMotorista() {

      /*
        Se a rota já foi carregada,
        não fazemos outra busca.
      */

      if (rotaCarregada.current) {
        return;
      }

      rotaCarregada.current = true;


      /*
        Criamos uma posição fictícia
        para o motorista.

        Ele começa um pouco distante
        da localização atual do usuário.
      */

      const inicioMotorista = [
        latitude + 0.009,
        longitude - 0.009,
      ];


      /*
        O OSRM trabalha com:

        longitude, latitude

        por isso precisamos inverter.
      */

      const origemLongitude =
        inicioMotorista[1];

      const origemLatitude =
        inicioMotorista[0];

      const destinoLongitude =
        longitude;

      const destinoLatitude =
        latitude;


      try {

        /*
          Pedimos ao OSRM uma rota
          real pelas ruas.

          O motorista começa na
          posição simulada e termina
          na localização real do usuário.
        */

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${origemLongitude},${origemLatitude};` +
          `${destinoLongitude},${destinoLatitude}` +
          `?overview=full&geometries=geojson`;


        const resposta =
          await fetch(url);


        if (!resposta.ok) {
          throw new Error(
            "Não foi possível criar a rota do motorista."
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

          O Leaflet usa:

          latitude, longitude

          então trocamos a ordem.
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
          Uma rota pode ter centenas
          de pontos.

          Se usássemos todos eles,
          a animação demoraria muito.

          Então pegamos apenas 45 pontos.
        */

        const quantidadePassos = 45;

        const rotaReduzida = [];


        for (
          let i = 0;
          i < quantidadePassos;
          i++
        ) {

          /*
            Descobrimos qual porcentagem
            da rota queremos pegar.

            Exemplo:

            0%
            25%
            50%
            75%
            100%
          */

          const proporcao =
            i /
            (quantidadePassos - 1);


          /*
            Transformamos essa porcentagem
            em uma posição da rota original.
          */

          const indice =
            Math.floor(
              proporcao *
              (coordenadas.length - 1)
            );


          rotaReduzida.push(
            coordenadas[indice]
          );
        }


        /*
          Guardamos os 45 pontos.
        */

        setRotaMotorista(
          rotaReduzida
        );


      } catch (erro) {

        console.error(
          "Erro na rota do motorista:",
          erro
        );


        /*
          PLANO B

          Caso o OSRM não funcione,
          criamos uma rota simples
          em linha reta.

          Assim a apresentação não para.
        */

        const rotaAlternativa = [];

        const passos = 45;


        for (
          let i = 0;
          i < passos;
          i++
        ) {

          const progresso =
            i / (passos - 1);


          const latitudeAtual =
            inicioMotorista[0] +
            (
              latitude -
              inicioMotorista[0]
            ) *
            progresso;


          const longitudeAtual =
            inicioMotorista[1] +
            (
              longitude -
              inicioMotorista[1]
            ) *
            progresso;


          rotaAlternativa.push([
            latitudeAtual,
            longitudeAtual
          ]);
        }


        setRotaMotorista(
          rotaAlternativa
        );
      }
    }


    buscarRotaMotorista();

  }, [
    latitude,
    longitude
  ]);


  /* ========================================
     MOVIMENTAR O MOTORISTA
  ======================================== */

  useEffect(() => {

    /*
      Enquanto ainda não temos rota,
      não fazemos nada.
    */

    if (
      rotaMotorista.length === 0
    ) {
      return;
    }


    /*
      A cada 1 segundo,
      avançamos um ponto da rota.
    */

    const intervalo =
      setInterval(() => {

        setIndiceMotorista(
          (indiceAtual) => {

            /*
              Se chegou ao último ponto,
              paramos a animação.
            */

            if (
              indiceAtual >=
              rotaMotorista.length - 1
            ) {

              clearInterval(
                intervalo
              );

              return indiceAtual;
            }


            /*
              Caso contrário,
              avança um ponto.
            */

            return indiceAtual + 1;
          }
        );

      }, 1000);


    /*
      Quando o componente sair da tela,
      cancelamos o intervalo.
    */

    return () => {
      clearInterval(intervalo);
    };

  }, [
    rotaMotorista
  ]);


  /* ========================================
     CALCULAR O PROGRESSO
  ======================================== */

  useEffect(() => {

    /*
      Esse é o bloco que corrigiu
      aquele erro vermelho do React.

      Agora só avisamos o componente pai
      DEPOIS que indiceMotorista mudou.
    */

    if (
      rotaMotorista.length === 0
    ) {
      return;
    }


    /*
      Exemplo:

      índice atual = 22
      total = 44

      22 / 44 = 0.5

      Ou seja: 50% do caminho.
    */

    const progresso =
      indiceMotorista /
      (
        rotaMotorista.length - 1
      );


    /*
      Enviamos o progresso para:

      DriverTracking.jsx
    */

    onProgress?.(
      progresso
    );

  }, [
    indiceMotorista,
    rotaMotorista,
    onProgress
  ]);


  /* ========================================
     POSIÇÃO ATUAL DO MOTORISTA
  ======================================== */

  const posicaoMotorista =
    rotaMotorista[
      indiceMotorista
    ] || null;


  /* ========================================
     MAPA
  ======================================== */

  return (
    <MapContainer
  center={usuario}
  zoom={16}
  className="tracking-real-map"
  scrollWheelZoom={true}
  doubleClickZoom={true}
  touchZoom={true}
  zoomControl={true}
  dragging={true}
>

      {/* Mapa do OpenStreetMap */}

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* Ajusta o zoom automaticamente */}

      {posicaoMotorista && (
        <AjustarMapa
          usuario={usuario}
          motorista={
            posicaoMotorista
          }
        />
      )}


      {/* Círculo ao redor do usuário */}

      <Circle
        center={usuario}
        radius={40}
        pathOptions={{
          color: "#285c7a",
          fillColor: "#285c7a",
          fillOpacity: 0.12,
        }}
      />


      {/* Marcador do usuário */}

      <Marker
        position={usuario}
        icon={iconeUsuario}
      >

        <Popup>
          Você está aqui.
        </Popup>

      </Marker>


      {/* Linha da rota do motorista */}

      {rotaMotorista.length > 0 && (
        <Polyline
          positions={
            rotaMotorista
          }

          pathOptions={{
            color: "#285c7a",
            weight: 5,
            opacity: 0.5,
          }}
        />
      )}


      {/* Carrinho do motorista */}

      {posicaoMotorista && (
        <Marker
          position={
            posicaoMotorista
          }

          icon={
            iconeMotorista
          }
        >

          <Popup>
            Seu motorista está
            a caminho.
          </Popup>

        </Marker>
      )}

    </MapContainer>
  );
}


export default DriverTrackingMap;