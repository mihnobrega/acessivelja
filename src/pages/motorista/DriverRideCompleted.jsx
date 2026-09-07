import {
  useNavigate
} from "react-router-dom";

import "../../css/driver-ride-completed.css";


function DriverRideCompleted() {
  const navigate =
    useNavigate();

  const corridaSalva =
    sessionStorage.getItem(
      "ultimaCorridaMotorista"
    );

  const corrida =
    corridaSalva
      ? JSON.parse(
          corridaSalva
        )
      : null;


  // ========================================
  // VOLTAR AO PAINEL
  // ========================================

  function voltarPainel() {
    sessionStorage.removeItem(
      "ultimaCorridaMotorista"
    );

    navigate(
      "/motorista"
    );
  }


  return (
    <main className="driver-completed-page">

      <section className="driver-completed-card">

        <div className="driver-completed-icon">
          ✓
        </div>

        <span className="driver-completed-label">
          CORRIDA FINALIZADA
        </span>

        <h1>
          Corrida concluída
        </h1>

        <p className="driver-completed-message">
          O passageiro chegou ao destino e
          o valor da corrida foi adicionado
          aos seus ganhos.
        </p>


        {corrida && (
          <div className="driver-completed-summary">

            <div className="driver-completed-passenger">

              <div className="driver-completed-avatar">
                {corrida.passageiro
                  ?.charAt(0)}
              </div>

              <div>

                <span>
                  PASSAGEIRO
                </span>

                <strong>
                  {corrida.passageiro}
                </strong>

              </div>

            </div>


            <div className="driver-completed-route">

              <div>

                <span>
                  EMBARQUE
                </span>

                <strong>
                  {corrida.embarque}
                </strong>

              </div>

              <div className="driver-completed-line"></div>

              <div>

                <span>
                  DESTINO
                </span>

                <strong>
                  {corrida.destino}
                </strong>

              </div>

            </div>


            <div className="driver-completed-info">

              <div>

                <span>
                  DISTÂNCIA
                </span>

                <strong>
                  {corrida.distancia}
                </strong>

              </div>

              <div>

                <span>
                  TEMPO
                </span>

                <strong>
                  {corrida.duracao}
                </strong>

              </div>

              <div>

                <span>
                  RECEBIDO
                </span>

                <strong>
                  {corrida.valor}
                </strong>

              </div>

            </div>

          </div>
        )}


        <button
          type="button"
          className="driver-completed-button"
          onClick={
            voltarPainel
          }
        >
          Voltar para o painel
        </button>

      </section>

    </main>
  );
}

export default DriverRideCompleted;