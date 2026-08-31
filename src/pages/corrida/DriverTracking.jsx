import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import DriverTrackingMap from "../../components/DriverTrackingMap";

import {
  falarMensagem
} from "../../utils/acessibilidade";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function DriverTracking() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
    motorista,
  } = location.state || {};

  const [localizacao, setLocalizacao] =
    useState(null);

  const [
    erroLocalizacao,
    setErroLocalizacao
  ] = useState("");

  const [
    statusMotorista,
    setStatusMotorista
  ] = useState(
    "Motorista a caminho"
  );

  const [
    tempoChegada,
    setTempoChegada
  ] = useState(
    motorista?.chegada || 4
  );

  const [
    motoristaChegou,
    setMotoristaChegou
  ] = useState(false);

  // ==================================================
  // ALERTA AO ENTRAR NA TELA
  // ==================================================

  useAlertaSonoro(
    motorista && corrida
      ? `Acompanhamento do motorista. ${motorista.nome} está a caminho do local de embarque.`
      : ""
  );

  // ==================================================
  // GPS
  // ==================================================

  useEffect(() => {
    if (!navigator.geolocation) {
      setErroLocalizacao(
        "Seu dispositivo não oferece suporte à localização."
      );

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
        },

        (erro) => {
          console.error(
            "Erro na localização:",
            erro
          );

          setErroLocalizacao(
            "Não foi possível atualizar sua localização."
          );
        },

        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 15000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  function atualizarProgresso(
    progresso
  ) {
    if (progresso >= 1) {
      if (!motoristaChegou) {
        falarMensagem(
          "Motorista chegou. Procure pelo veículo e confirme a placa antes de embarcar."
        );
      }

      setTempoChegada(0);

      setStatusMotorista(
        "Motorista chegou"
      );

      setMotoristaChegou(
        true
      );

      return;
    }

    if (progresso >= 0.72) {
      if (
        statusMotorista !==
        "Seu motorista está chegando"
      ) {
        falarMensagem(
          "Seu motorista está chegando. Chegada estimada em aproximadamente 1 minuto."
        );
      }

      setTempoChegada(1);

      setStatusMotorista(
        "Seu motorista está chegando"
      );

      return;
    }

    if (progresso >= 0.42) {
      if (
        statusMotorista !==
        "Motorista se aproximando"
      ) {
        falarMensagem(
          "Motorista se aproximando. Chegada estimada em aproximadamente 2 minutos."
        );
      }

      setTempoChegada(2);

      setStatusMotorista(
        "Motorista se aproximando"
      );

      return;
    }

    setTempoChegada(
      motorista?.chegada || 4
    );

    setStatusMotorista(
      "Motorista a caminho"
    );
  }

  function iniciarCorrida() {
    navigate(
      "/corrida/em-andamento",
      {
        state: {
          corrida,
          pagamento,
          distancia,
          duracao,
          destino,
          motorista,
        },
      }
    );
  }

  function cancelarCorrida() {
    navigate("/home");
  }

  if (!motorista || !corrida) {
    return (
      <main className="driver-tracking-page">

        <section className="driver-error-card">

          <h1>
            Não encontramos os dados da corrida.
          </h1>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            Voltar ao início
          </button>

        </section>

      </main>
    );
  }

  return (
    <main className="driver-tracking-page">

      <header className="tracking-header">

        <button
          type="button"
          className="tracking-back-button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          ←
        </button>

        <div className="tracking-header-content">

          <span>
            Sua corrida
          </span>

          <h1>
            {statusMotorista}
          </h1>

          {!motoristaChegou && (
            <p>
              Chegada estimada em{" "}
              <strong>
                {tempoChegada} min
              </strong>
            </p>
          )}

          {motoristaChegou && (
            <p>
              O motorista está esperando
              no local de embarque.
            </p>
          )}

        </div>

      </header>

      <section
        className={`tracking-status-card ${
          motoristaChegou
            ? "tracking-status-arrived"
            : ""
        }`}
      >

        <div className="tracking-status-icon">
          {motoristaChegou
            ? "✓"
            : "🚗"}
        </div>

        <div>

          <span>
            Status
          </span>

          <strong>
            {statusMotorista}
          </strong>

          <small>
            {motoristaChegou
              ? "Procure pelo veículo e confirme a placa antes de embarcar."
              : "Você pode acompanhar a aproximação do motorista pelo mapa."}
          </small>

        </div>

      </section>

      <section className="tracking-map-card">

        <div className="tracking-map-label">

          <span className="tracking-live-dot"></span>

          <span>
            Acompanhamento ao vivo
          </span>

        </div>

        {localizacao && (
          <DriverTrackingMap
            latitude={
              localizacao.latitude
            }
            longitude={
              localizacao.longitude
            }
            onProgress={
              atualizarProgresso
            }
          />
        )}

        {!localizacao &&
          !erroLocalizacao && (
            <div className="tracking-map-loading">

              <div className="map-loading-circle"></div>

              <strong>
                Atualizando sua localização...
              </strong>

              <p>
                Aguarde enquanto acessamos
                seu GPS.
              </p>

            </div>
          )}

        {erroLocalizacao && (
          <div className="tracking-map-loading">

            <strong>
              Localização indisponível
            </strong>

            <p>
              {erroLocalizacao}
            </p>

          </div>
        )}

      </section>

      <section className="tracking-driver-card">

        <div className="tracking-driver-main">

          <div className="tracking-driver-avatar">
            CH
          </div>

          <div className="tracking-driver-name">

            <span>
              Seu motorista
            </span>

            <strong>
              {motorista.nome}
            </strong>

            <small>
              ★ {motorista.avaliacao}
              {" • "}
              {motorista.viagens} viagens
            </small>

          </div>

          <div className="tracking-time">

            <strong>
              {motoristaChegou
                ? "✓"
                : tempoChegada}
            </strong>

            <span>
              {motoristaChegou
                ? "chegou"
                : "min"}
            </span>

          </div>

        </div>

        <div className="tracking-silver-divider"></div>

        <div className="tracking-vehicle">

          <div className="tracking-car-icon">
            🚙
          </div>

          <div className="tracking-car-description">

            <span>
              Veículo
            </span>

            <strong>
              {motorista.carro}
            </strong>

            <small>
              {motorista.cor}
            </small>

          </div>

          <div className="tracking-plate">

            <span>
              Placa
            </span>

            <strong>
              {motorista.placa}
            </strong>

          </div>

        </div>

      </section>

      <section className="tracking-actions">

        <button
          type="button"
          className="tracking-action-button"
        >
          <span>💬</span>
          <strong>Mensagem</strong>
        </button>

        <button
          type="button"
          className="tracking-action-button"
        >
          <span>📞</span>
          <strong>Contato</strong>
        </button>

      </section>

      {motoristaChegou && (
        <button
          type="button"
          className="start-trip-button"
          onClick={iniciarCorrida}
        >
          <span>
            Motorista chegou
          </span>

          <strong>
            Iniciar corrida →
          </strong>
        </button>
      )}

      {!motoristaChegou && (
        <button
          type="button"
          className="tracking-cancel-button"
          onClick={cancelarCorrida}
        >
          Cancelar corrida
        </button>
      )}

    </main>
  );
}

export default DriverTracking;