import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import LocationMap from "../../components/LocationMap";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function RideRequest() {
  const navigate = useNavigate();

  const [localizacao, setLocalizacao] =
    useState(null);

  const [erroLocalizacao, setErroLocalizacao] =
    useState("");

  const [
    carregandoLocalizacao,
    setCarregandoLocalizacao
  ] = useState(true);

  const [
    destinoDigitado,
    setDestinoDigitado
  ] = useState("");

  const [
    resultadosDestino,
    setResultadosDestino
  ] = useState([]);

  const [
    carregandoDestino,
    setCarregandoDestino
  ] = useState(false);

  const [
    destinoSelecionado,
    setDestinoSelecionado
  ] = useState(null);

  const [rota, setRota] =
    useState([]);

  const [distancia, setDistancia] =
    useState(null);

  const [duracao, setDuracao] =
    useState(null);

  const [
    carregandoRota,
    setCarregandoRota
  ] = useState(false);

  const [erroRota, setErroRota] =
    useState("");

  // ==================================================
  // ALERTA SONORO
  // ==================================================

  useAlertaSonoro(
    "Pedir corrida. Informe para onde você deseja ir."
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setErroLocalizacao(
        "Seu dispositivo não oferece suporte à localização."
      );

      setCarregandoLocalizacao(false);
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (posicao) => {
          setLocalizacao({
            latitude:
              posicao.coords.latitude,

            longitude:
              posicao.coords.longitude,

            precisao:
              posicao.coords.accuracy,
          });

          setErroLocalizacao("");
          setCarregandoLocalizacao(false);
        },

        (erro) => {
          console.error(
            "Erro ao obter localização:",
            erro
          );

          let mensagemErro =
            "Não foi possível acessar sua localização.";

          if (
            erro.code ===
            erro.PERMISSION_DENIED
          ) {
            mensagemErro =
              "A permissão de localização foi negada.";
          }

          if (
            erro.code ===
            erro.POSITION_UNAVAILABLE
          ) {
            mensagemErro =
              "Sua localização não está disponível no momento.";
          }

          if (
            erro.code ===
            erro.TIMEOUT
          ) {
            mensagemErro =
              "O GPS demorou muito para responder. Tente novamente.";
          }

          setErroLocalizacao(
            mensagemErro
          );

          setCarregandoLocalizacao(
            false
          );
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  async function buscarDestino() {
    if (!destinoDigitado.trim()) {
      return;
    }

    setCarregandoDestino(true);
    setResultadosDestino([]);

    try {
      let url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=json` +
        `&q=${encodeURIComponent(destinoDigitado)}` +
        `&limit=5` +
        `&addressdetails=1` +
        `&countrycodes=br`;

      if (localizacao) {
        const margem = 0.4;

        const esquerda =
          localizacao.longitude - margem;

        const direita =
          localizacao.longitude + margem;

        const topo =
          localizacao.latitude + margem;

        const baixo =
          localizacao.latitude - margem;

        url +=
          `&viewbox=${esquerda},${topo},${direita},${baixo}` +
          `&bounded=0`;
      }

      const resposta =
        await fetch(url);

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível realizar a busca."
        );
      }

      const dados =
        await resposta.json();

      setResultadosDestino(
        dados
      );

    } catch (erro) {
      console.error(
        "Erro ao buscar destino:",
        erro
      );

    } finally {
      setCarregandoDestino(
        false
      );
    }
  }

  function selecionarDestino(local) {
    const novoDestino = {
      nome:
        local.display_name,

      latitude:
        Number(local.lat),

      longitude:
        Number(local.lon),
    };

    setDestinoSelecionado(
      novoDestino
    );

    setDestinoDigitado(
      local.display_name
    );

    setResultadosDestino([]);

    calcularRota(
      novoDestino
    );
  }

  async function calcularRota(destino) {
    if (!localizacao || !destino) {
      return;
    }

    setCarregandoRota(true);
    setErroRota("");

    try {
      const origemLongitude =
        localizacao.longitude;

      const origemLatitude =
        localizacao.latitude;

      const destinoLongitude =
        destino.longitude;

      const destinoLatitude =
        destino.latitude;

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origemLongitude},${origemLatitude};` +
        `${destinoLongitude},${destinoLatitude}` +
        `?overview=full&geometries=geojson`;

      const resposta =
        await fetch(url);

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
          "Nenhuma rota foi encontrada."
        );
      }

      const melhorRota =
        dados.routes[0];

      const pontosDaRota =
        melhorRota.geometry.coordinates.map(
          ([longitude, latitude]) => [
            latitude,
            longitude,
          ]
        );

      setRota(
        pontosDaRota
      );

      setDistancia(
        melhorRota.distance / 1000
      );

      setDuracao(
        melhorRota.duration / 60
      );

    } catch (erro) {
      console.error(
        "Erro ao calcular rota:",
        erro
      );

      setErroRota(
        "Não conseguimos calcular a rota até esse destino."
      );

    } finally {
      setCarregandoRota(false);
    }
  }

  return (
    <main className="ride-page">

      <header className="ride-header">

        <button
          className="ride-back-button"
          onClick={() =>
            navigate("/home")
          }
          aria-label="Voltar para a tela inicial"
        >
          ←
        </button>

        <div>
          <p>
            Sua corrida
          </p>

          <h1>
            Para onde vamos?
          </h1>
        </div>

      </header>

      <section className="ride-location-card">

        <div
          className="ride-location-icon"
          aria-hidden="true"
        >
          📍
        </div>

        <div className="ride-location-info">

          <span>
            Localização atual
          </span>

          {carregandoLocalizacao && (
            <strong>
              Buscando sua localização...
            </strong>
          )}

          {!carregandoLocalizacao &&
            localizacao && (
              <>
                <strong>
                  {localizacao.precisao > 200
                    ? "Localização aproximada"
                    : "Localização encontrada"}
                </strong>

                <small className="location-accuracy">
                  Precisão aproximada:{" "}
                  {Math.round(
                    localizacao.precisao
                  )} metros
                </small>
              </>
            )}

          {erroLocalizacao && (
            <strong className="location-error">
              {erroLocalizacao}
            </strong>
          )}

        </div>

      </section>

      <section className="ride-map-container">

        {carregandoLocalizacao && (
          <div className="map-loading">

            <div className="map-loading-circle"></div>

            <strong>
              Localizando você...
            </strong>

            <p>
              Aguarde enquanto acessamos seu GPS.
            </p>

          </div>
        )}

        {!carregandoLocalizacao &&
          localizacao && (
            <LocationMap
              latitude={
                localizacao.latitude
              }
              longitude={
                localizacao.longitude
              }
              destino={
                destinoSelecionado
              }
              rota={
                rota
              }
            />
          )}

        {!carregandoLocalizacao &&
          erroLocalizacao && (
            <div className="map-loading">

              <strong>
                Não conseguimos mostrar o mapa.
              </strong>

              <p>
                Verifique se a permissão de localização está ativada.
              </p>

            </div>
          )}

      </section>

      <section className="ride-search-card">

        <label htmlFor="destino">
          Para onde você quer ir?
        </label>

        <div className="destination-input">

          <span aria-hidden="true">
            ●
          </span>

          <input
            id="destino"
            type="text"
            placeholder="Digite seu destino"
            value={destinoDigitado}
            onChange={(event) =>
              setDestinoDigitado(
                event.target.value
              )
            }
          />

        </div>

        <button
          className="primary-button"
          type="button"
          onClick={buscarDestino}
        >
          {carregandoDestino
            ? "Buscando..."
            : "Buscar destino"}
        </button>

        {resultadosDestino.length > 0 && (
          <div className="destination-results">

            {resultadosDestino.map(
              (local) => (
                <button
                  key={local.place_id}
                  type="button"
                  className="destination-result-item"
                  onClick={() =>
                    selecionarDestino(
                      local
                    )
                  }
                >
                  <span className="destination-result-icon">
                    📍
                  </span>

                  <span>
                    {local.display_name}
                  </span>
                </button>
              )
            )}

          </div>
        )}

        {carregandoRota && (
          <div className="route-loading">

            <div className="map-loading-circle"></div>

            <span>
              Calculando melhor rota...
            </span>

          </div>
        )}

        {erroRota && (
          <div className="route-error">
            {erroRota}
          </div>
        )}

        {distancia !== null &&
          duracao !== null &&
          !carregandoRota && (
            <div className="route-information">

              <div className="route-info-item">

                <span aria-hidden="true">
                  ↗
                </span>

                <div>
                  <small>
                    Distância
                  </small>

                  <strong>
                    {distancia.toFixed(1)} km
                  </strong>
                </div>

              </div>

              <div className="route-divider"></div>

              <div className="route-info-item">

                <span aria-hidden="true">
                  ◷
                </span>

                <div>
                  <small>
                    Tempo estimado
                  </small>

                  <strong>
                    {Math.ceil(duracao)} min
                  </strong>
                </div>

              </div>

            </div>
          )}

        {distancia !== null &&
          duracao !== null &&
          destinoSelecionado &&
          !carregandoRota && (
            <button
              className="primary-button ride-continue-button"
              type="button"
              onClick={() =>
                navigate(
                  "/corrida/opcoes",
                  {
                    state: {
                      distancia,
                      duracao,
                      destino:
                        destinoSelecionado,
                    },
                  }
                )
              }
            >
              Continuar
            </button>
          )}

      </section>

    </main>
  );
}

export default RideRequest;