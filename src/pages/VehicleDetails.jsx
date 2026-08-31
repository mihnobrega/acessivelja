import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  buscarVeiculoPorId
} from "../data/vehicles";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function VehicleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const veiculo =
    buscarVeiculoPorId(id);

  // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    veiculo
      ? `Detalhes do veículo ${veiculo.nome}. Confira as adaptações disponíveis e o valor do aluguel.`
      : ""
  );

  if (!veiculo) {
    return (
      <main className="vehicle-details-page">

        <section className="vehicle-details-empty">

          <span>
            🚙
          </span>

          <h1>
            Veículo não encontrado
          </h1>

          <p>
            Não foi possível carregar
            as informações deste veículo.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/aluguel")
            }
          >
            Voltar para veículos
          </button>

        </section>

      </main>
    );
  }

  return (
    <main className="vehicle-details-page">

      <header className="vehicle-details-header">

        <button
          type="button"
          className="vehicle-details-back"
          onClick={() =>
            navigate("/aluguel")
          }
          aria-label="Voltar para veículos"
        >
          ←
        </button>

        <div>

          <span>
            VEÍCULO {id}
          </span>

          <h1>
            {veiculo.nome}
          </h1>

          <p>
            Conheça os detalhes
            deste veículo adaptado.
          </p>

        </div>

      </header>

      <section className="vehicle-details-hero">

        <div className="vehicle-details-photo">

          {veiculo.imagem ? (
            <img
              src={veiculo.imagem}
              alt={`Foto do ${veiculo.nome}`}
            />
          ) : (
            <span className="vehicle-details-photo-fallback">
              {veiculo.icone}
            </span>
          )}

        </div>

        <div className="vehicle-details-name">

          <span>
            {veiculo.tipo}
          </span>

          <h2>
            {veiculo.nome}
          </h2>

          <p>
            {veiculo.descricao}
          </p>

        </div>

      </section>

      <section className="vehicle-details-section">

        <div className="vehicle-details-section-title">

          <span>
            ACESSIBILIDADE
          </span>

          <h2>
            Adaptações disponíveis
          </h2>

        </div>

        <div className="vehicle-details-features">

          {veiculo.recursos.map((recurso) => (

            <div
              key={recurso}
              className="vehicle-details-feature"
            >

              <div>
                ✓
              </div>

              <span>
                {recurso}
              </span>

            </div>

          ))}

        </div>

      </section>

      <section className="vehicle-details-price">

        <div>

          <span>
            VALOR DO ALUGUEL
          </span>

          <strong>
            {veiculo.valor}
          </strong>

          <small>
            {veiculo.periodo}
          </small>

        </div>

      </section>

      <section className="vehicle-details-info">

        <div className="vehicle-details-info-item">

          <span>
            🛡️
          </span>

          <div>

            <strong>
              Veículo verificado
            </strong>

            <p>
              Revisado antes de cada locação.
            </p>

          </div>

        </div>

        <div className="vehicle-details-info-item">

          <span>
            ♿
          </span>

          <div>

            <strong>
              Adaptado
            </strong>

            <p>
              Preparado para oferecer mais autonomia.
            </p>

          </div>

        </div>

        <div className="vehicle-details-info-item">

          <span>
            📞
          </span>

          <div>

            <strong>
              Suporte
            </strong>

            <p>
              Atendimento durante o período de aluguel.
            </p>

          </div>

        </div>

      </section>

      <button
        type="button"
        className="vehicle-details-continue"
        onClick={() =>
          navigate(
            `/aluguel/${id}/periodo`,
            {
              state: {
                veiculo
              }
            }
          )
        }
      >
        Escolher período

        <span>
          →
        </span>

      </button>

    </main>
  );
}

export default VehicleDetails;