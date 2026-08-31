import {
  useLocation,
  useNavigate
} from "react-router-dom";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function DriverFound() {
  // Permite navegar para outras páginas.
  const navigate = useNavigate();

  // Recupera os dados enviados pela página anterior.
  const location = useLocation();

  // Dados da corrida recebidos pelo location.state.
  const {
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
  } = location.state || {};

  // Motorista fictício utilizado na simulação.
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
              navigate("/home")
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
    navigate("/home");
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
            <span>Corrida</span>
            <strong>
              {corrida.nome}
            </strong>
          </div>

          <div>
            <span>Valor</span>

            <strong>
              R${" "}
              {corrida.preco
                .toFixed(2)
                .replace(".", ",")}
            </strong>
          </div>

        </section>

        <button
          type="button"
          className="track-driver-button"
          onClick={acompanharMotorista}
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
          onClick={cancelarCorrida}
        >
          Cancelar corrida
        </button>

      </section>

    </main>
  );
}

export default DriverFound;