import {
  useNavigate
} from "react-router-dom";

import {
  veiculos
} from "../data/vehicles";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function VehicleRental() {
  const navigate = useNavigate();

  // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    "Aluguel de veículos. Escolha um veículo de acordo com suas necessidades de acessibilidade."
  );

  function selecionarVeiculo(veiculo) {
    navigate(`/aluguel/${veiculo.id}`);
  }

  return (
    <main className="rental-page">

      <header className="rental-header">

        <button
          type="button"
          className="rental-back"
          onClick={() =>
            navigate("/home")
          }
          aria-label="Voltar para o início"
        >
          ←
        </button>

        <div>

          <span>
            ACESSÍVEL JÁ
          </span>

          <h1>
            Alugar veículo
          </h1>

          <p>
            Mais autonomia para
            chegar onde quiser.
          </p>

        </div>

      </header>

      <section className="rental-intro">

        <div className="rental-intro-icon">
          ♿
        </div>

        <div>

          <span>
            MOBILIDADE
          </span>

          <h2>
            Escolha o veículo ideal
          </h2>

          <p>
            Compare as adaptações
            disponíveis e escolha a
            opção mais adequada para
            sua viagem.
          </p>

        </div>

      </section>

      <section className="rental-vehicles">

        <div className="rental-section-title">

          <span>
            VEÍCULOS
          </span>

          <h2>
            Disponíveis para aluguel
          </h2>

        </div>

        <div className="rental-list">

          {veiculos.map((veiculo) => (

            <button
              key={veiculo.id}
              type="button"
              className={
                veiculo.recomendado
                  ? "rental-card rental-card-featured"
                  : "rental-card"
              }
              onClick={() =>
                selecionarVeiculo(veiculo)
              }
            >

              {veiculo.destaque && (
                <div className="rental-badge">
                  RECOMENDADO
                </div>
              )}

              <div className="rental-card-top">

                <div className="rental-car-icon">

                  {veiculo.imagem ? (
                    <img
                      src={veiculo.imagem}
                      alt={`Foto do ${veiculo.nome}`}
                    />
                  ) : (
                    <span>
                      {veiculo.icone}
                    </span>
                  )}

                </div>

                <div className="rental-card-heading">

                  <span>
                    {veiculo.tipo}
                  </span>

                  <strong>
                    {veiculo.nome}
                  </strong>

                </div>

                <div className="rental-card-arrow">
                  →
                </div>

              </div>

              <p className="rental-description">
                {veiculo.descricao}
              </p>

              <div className="rental-features">

                {veiculo.recursos.map((recurso) => (
                  <span key={recurso}>
                    ✓ {recurso}
                  </span>
                ))}

              </div>

              <div className="rental-card-footer">

                <span>
                  A partir de
                </span>

                <div>

                  <strong>
                    {veiculo.valor}
                  </strong>

                  <small>
                    {veiculo.periodo}
                  </small>

                </div>

              </div>

            </button>

          ))}

        </div>

      </section>

    </main>
  );
}

export default VehicleRental;