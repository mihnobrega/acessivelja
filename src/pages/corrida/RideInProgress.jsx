import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import RideInProgressMap from "../../components/RideInProgressMap";

import {
  falarMensagem
} from "../../utils/acessibilidade";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function RideInProgress() {
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
    progressoViagem,
    setProgressoViagem
  ] = useState(0);

  const [
    viagemFinalizada,
    setViagemFinalizada
  ] = useState(false);

  // ==================================================
  // ALERTA DE INÍCIO
  // ==================================================

  useAlertaSonoro(
    motorista && destino
      ? "Sua corrida foi iniciada. Você pode acompanhar o percurso até o destino."
      : ""
  );

  // ========================================
  // GPS REAL DO USUÁRIO
  // ========================================

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
            "Erro ao acessar localização:",
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

  // ========================================
  // RECEBER PROGRESSO
  // ========================================

  function atualizarProgresso(
    progresso
  ) {
    setProgressoViagem(
      progresso
    );

    if (
      progresso >= 1 &&
      !viagemFinalizada
    ) {
      setViagemFinalizada(
        true
      );

      falarMensagem(
        "Você chegou ao seu destino. A corrida foi concluída."
      );
    }
  }

  // ========================================
  // FINALIZAR
  // ========================================

  function finalizarCorrida() {
    navigate(
      "/corrida/resumo",
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

  // ========================================
  // SEGURANÇA
  // ========================================

  if (!motorista || !destino) {
    return (
      <main className="ride-progress-page">

        <section className="driver-error-card">

          <h1>
            Não encontramos os dados da viagem.
          </h1>

          <button
            type="button"
            className="primary-button"
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

  const porcentagem =
    Math.round(
      progressoViagem * 100
    );

  return (
    <main className="ride-progress-page">

      <header className="ride-progress-header">

        <div className="ride-progress-header-content">

          <span>
            Acessível Já
          </span>

          <h1>
            {viagemFinalizada
              ? "Você chegou!"
              : "Viagem em andamento"}
          </h1>

          <p>
            {viagemFinalizada
              ? "Seu destino foi alcançado."
              : "Acompanhe sua viagem em tempo real."}
          </p>

        </div>

        <div className="ride-progress-header-icon">
          {viagemFinalizada
            ? "✓"
            : "🚙"}
        </div>

      </header>

      <section className="ride-progress-status">

        <div className="ride-progress-status-top">

          <div>
            <span>
              Progresso da viagem
            </span>

            <strong>
              {porcentagem}%
            </strong>
          </div>

          <small>
            {viagemFinalizada
              ? "Destino alcançado"
              : "Em movimento"}
          </small>

        </div>

        <div className="ride-progress-bar">

          <div
            className="ride-progress-bar-fill"
            style={{
              width:
                `${porcentagem}%`,
            }}
          ></div>

        </div>

      </section>

      <section className="ride-progress-map-card">

        <div className="ride-progress-live">

          <span></span>

          Viagem ao vivo

        </div>

        {localizacao && (
          <RideInProgressMap
            latitude={
              localizacao.latitude
            }
            longitude={
              localizacao.longitude
            }
            destino={
              destino
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
                Preparando sua viagem...
              </strong>

              <p>
                Estamos acessando sua localização.
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

      <section className="ride-progress-destination">

        <div className="ride-progress-pin">
          📍
        </div>

        <div>

          <span>
            Seu destino
          </span>

          <strong>
            {destino.nome ||
              destino.display_name ||
              "Destino selecionado"}
          </strong>

        </div>

      </section>

      <section className="ride-progress-info">

        <div>

          <span>
            Distância
          </span>

          <strong>
            {distancia
              ? `${Number(distancia).toFixed(1)} km`
              : "--"}
          </strong>

        </div>

        <div>

          <span>
            Tempo estimado
          </span>

          <strong>
            {duracao
              ? `${Number(duracao)
                  .toFixed(2)
                  .replace(".", ",")} min`
              : "--"}
          </strong>

        </div>

        <div>

          <span>
            Motorista
          </span>

          <strong>
            {motorista.nome}
          </strong>

        </div>

      </section>

      {!viagemFinalizada && (
        <section className="ride-progress-actions">

          <button
            type="button"
            className="ride-progress-action"
          >
            <span>
              🛡️
            </span>

            <div>
              <strong>
                Segurança
              </strong>

              <small>
                Central de ajuda
              </small>
            </div>
          </button>

          <button
            type="button"
            className="ride-progress-action"
          >
            <span>
              💬
            </span>

            <div>
              <strong>
                Motorista
              </strong>

              <small>
                Enviar mensagem
              </small>
            </div>
          </button>

        </section>
      )}

      {viagemFinalizada && (
        <section className="ride-arrived-card">

          <div className="ride-arrived-icon">
            ✓
          </div>

          <div>

            <span>
              Corrida concluída
            </span>

            <h2>
              Chegamos ao destino
            </h2>

            <p>
              Esperamos que você tenha
              tido uma viagem confortável
              e acessível.
            </p>

          </div>

        </section>
      )}

      {viagemFinalizada && (
        <button
          type="button"
          className="ride-finish-button"
          onClick={finalizarCorrida}
        >
          Finalizar corrida

          <span>
            →
          </span>
        </button>
      )}

    </main>
  );
}

export default RideInProgress;