import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function DriverFound() {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
  } = location.state || {};

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);

  const motorista = {
    nome: "Carlos Henrique",
    avaliacao: 4.9,
    viagens: 1284,
    carro: "Chevrolet Spin",
    cor: "Prata",
    placa: "ABC-1D23",
    chegada: 4,
  };


  // ==================================================
  // ALERTA SONORO
  // ==================================================

  useAlertaSonoro(
    corrida
      ? `Motorista encontrado. ${motorista.nome} está a caminho e chegará em aproximadamente ${motorista.chegada} minutos.`
      : ""
  );


  // ==================================================
  // CONTINUA O FLUXO DE VOZ
  // ==================================================

  useEffect(() => {
    const continuarPorVoz =
      sessionStorage.getItem(
        "continuarMotoristaPorVoz"
      );

    if (
      continuarPorVoz !== "true" ||
      !corrida
    ) {
      return;
    }

    const temporizador =
      setTimeout(() => {
        sessionStorage.removeItem(
          "continuarMotoristaPorVoz"
        );

        falarMotoristaEncontrado();
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, []);


  // ==================================================
  // FALAR MOTORISTA ENCONTRADO
  // ==================================================

  function falarMotoristaEncontrado() {
    if (
      !("speechSynthesis" in window)
    ) {
      ouvirComandoMotorista();
      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        `Motorista encontrado. Seu motorista é ${motorista.nome}. O veículo é um ${motorista.carro}, cor ${motorista.cor}, placa ${motorista.placa}. Ele chegará em aproximadamente ${motorista.chegada} minutos. Diga acompanhar motorista ou cancelar corrida.`
      );

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    fala.onend = () => {
      setTimeout(() => {
        ouvirComandoMotorista();
      }, 350);
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ==================================================
  // OUVIR COMANDO
  // ==================================================

  function ouvirComandoMotorista() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const reconhecimento =
      new SpeechRecognition();

    reconhecimento.lang =
      "pt-BR";

    reconhecimento.continuous =
      false;

    reconhecimento.interimResults =
      false;

    reconhecimento.onstart = () => {
      setOuvindo(
        true
      );
    };

    reconhecimento.onend = () => {
      setOuvindo(
        false
      );
    };

    reconhecimento.onerror = (
      erro
    ) => {
      console.error(
        "Erro no reconhecimento de voz:",
        erro
      );

      setOuvindo(
        false
      );
    };

    reconhecimento.onresult = (
      evento
    ) => {
      const comando =
        evento.results[0][0]
          .transcript
          .toLowerCase();

      executarComandoMotorista(
        comando
      );
    };

    reconhecimento.start();
  }


  // ==================================================
  // EXECUTAR COMANDO
  // ==================================================

  function executarComandoMotorista(
    comando
  ) {
    if (
      comando.includes(
        "acompanhar motorista"
      ) ||
      comando.includes(
        "acompanhar"
      ) ||
      comando.includes(
        "motorista"
      )
    ) {
      acompanharMotorista();
      return;
    }

    if (
      comando.includes(
        "cancelar corrida"
      ) ||
      comando.includes(
        "cancelar"
      )
    ) {
      cancelarCorrida();
      return;
    }

    falarComandoNaoEntendido();
  }


  // ==================================================
  // COMANDO NÃO ENTENDIDO
  // ==================================================

  function falarComandoNaoEntendido() {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        "Não entendi. Diga acompanhar motorista ou cancelar corrida."
      );

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    fala.onend = () => {
      setTimeout(() => {
        ouvirComandoMotorista();
      }, 350);
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ==================================================
  // VERIFICA SE EXISTE UMA CORRIDA
  // ==================================================

  if (!corrida) {
    return (
      <main className="driver-found-page">

        <section className="driver-error-card">

          <h1>
            Corrida não encontrada
          </h1>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate(
                "/home"
              )
            }
          >
            Voltar ao início
          </button>

        </section>

      </main>
    );
  }


  // ==================================================
  // ACOMPANHAR MOTORISTA
  // ==================================================

  function acompanharMotorista() {
    sessionStorage.setItem(
      "continuarAcompanhamentoPorVoz",
      "true"
    );

    navigate(
      "/corrida/acompanhamento",
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


  // ==================================================
  // CANCELAR CORRIDA
  // ==================================================

  function cancelarCorrida() {
    sessionStorage.removeItem(
      "continuarAcompanhamentoPorVoz"
    );

    navigate(
      "/home"
    );
  }


  return (
    <main className="driver-found-page">

      <section className="driver-found-container">


        <header className="driver-found-header">

          <span>
            Motorista encontrado
          </span>

          <h1>
            Seu motorista está a caminho
          </h1>

          <p>
            Ele chegará em aproximadamente{" "}
            {motorista.chegada} minutos.
          </p>

        </header>


        <div className="driver-success-icon">
          <span>✓</span>
        </div>


        <section className="driver-card">

          <div className="driver-main-info">

            <div className="driver-avatar">
              CH
            </div>

            <div className="driver-person">

              <span>
                Seu motorista
              </span>

              <h2>
                {motorista.nome}
              </h2>

              <div className="driver-rating">

                <span aria-hidden="true">
                  ★
                </span>

                <strong>
                  {motorista.avaliacao}
                </strong>

                <small>
                  {motorista.viagens} viagens
                </small>

              </div>

            </div>

            <div className="driver-arrival">

              <strong>
                {motorista.chegada}
              </strong>

              <span>
                min
              </span>

            </div>

          </div>


          <div className="driver-divider"></div>


          <div className="driver-car-info">

            <div className="driver-car-icon">
              🚙
            </div>

            <div>

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

            <div className="driver-plate">

              <span>
                Placa
              </span>

              <strong>
                {motorista.placa}
              </strong>

            </div>

          </div>


          {corrida.id === "adaptada" && (

            <div className="driver-accessibility">

              <span aria-hidden="true">
                ♿
              </span>

              <div>

                <strong>
                  Veículo adaptado
                </strong>

                <p>
                  Preparado para embarque e
                  transporte de cadeira de rodas.
                </p>

              </div>

            </div>

          )}

        </section>


        <section className="driver-contact-section">

          <button
            type="button"
            className="driver-contact-button"
          >
            <span>💬</span>
            <strong>Mensagem</strong>
          </button>

          <button
            type="button"
            className="driver-contact-button"
          >
            <span>📞</span>
            <strong>Contato</strong>
          </button>

        </section>


        <section className="driver-trip-summary">

          <div>

            <span>
              Corrida
            </span>

            <strong>
              {corrida.nome}
            </strong>

          </div>

          <div>

            <span>
              Valor
            </span>

            <strong>
              R${" "}
              {corrida.preco
                .toFixed(2)
                .replace(
                  ".",
                  ","
                )}
            </strong>

          </div>

        </section>


        <button
          type="button"
          className="track-driver-button"
          onClick={
            acompanharMotorista
          }
        >

          <span>
            Acompanhar motorista
          </span>

          <span aria-hidden="true">
            →
          </span>

        </button>


        <button
          type="button"
          className="cancel-ride-button"
          onClick={
            cancelarCorrida
          }
        >
          Cancelar corrida
        </button>


        {ouvindo && (

          <p
            aria-live="polite"
            style={{
              textAlign: "center",
              marginTop: "12px"
            }}
          >
            🎙️ Ouvindo...
          </p>

        )}

      </section>

    </main>
  );
}

export default DriverFound;