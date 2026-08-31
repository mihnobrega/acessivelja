import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function RentalSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const {
    veiculo,
    dataRetirada,
    dataDevolucao,
    quantidadeDias,
    valorDiaria,
    valorTotal,
  } = location.state || {};

  // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    veiculo
      ? `Resumo da reserva do veículo ${veiculo.nome}. Confira as datas e o valor antes de confirmar.`
      : ""
  );

  function formatarData(data) {
    if (!data) {
      return "--";
    }

    const [
      ano,
      mes,
      dia
    ] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  function confirmarReserva() {
    navigate(
      `/aluguel/${id}/confirmado`,
      {
        state: {
          veiculo,
          dataRetirada,
          dataDevolucao,
          quantidadeDias,
          valorDiaria,
          valorTotal,
        },
      }
    );
  }

  if (!veiculo) {
    return (
      <main className="rental-summary-page">

        <section className="rental-summary-error">

          <h1>
            Não encontramos os dados da reserva.
          </h1>

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
    <main className="rental-summary-page">

      <header className="rental-summary-header">

        <button
          type="button"
          className="rental-summary-back"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          ←
        </button>

        <div>

          <span>
            RESUMO DA RESERVA
          </span>

          <h1>
            Confira os detalhes
          </h1>

          <p>
            Revise as informações antes
            de confirmar o aluguel.
          </p>

        </div>

      </header>

      <section className="rental-summary-vehicle">

        <div className="rental-summary-image">

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

        <div className="rental-summary-vehicle-info">

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

      <section className="rental-summary-period">

        <div className="rental-summary-section-title">

          <span>
            PERÍODO
          </span>

          <h2>
            Datas da reserva
          </h2>

        </div>

        <div className="rental-summary-date-grid">

          <div>
            <span>
              Retirada
            </span>

            <strong>
              {formatarData(
                dataRetirada
              )}
            </strong>
          </div>

          <div>
            <span>
              Devolução
            </span>

            <strong>
              {formatarData(
                dataDevolucao
              )}
            </strong>
          </div>

        </div>

        <div className="rental-summary-days">

          <span>
            Duração do aluguel
          </span>

          <strong>
            {quantidadeDias}{" "}
            {quantidadeDias === 1
              ? "dia"
              : "dias"}
          </strong>

        </div>

      </section>

      <section className="rental-summary-values">

        <div className="rental-summary-section-title">

          <span>
            VALORES
          </span>

          <h2>
            Resumo do pagamento
          </h2>

        </div>

        <div className="rental-summary-value-row">

          <span>
            Valor da diária
          </span>

          <strong>
            R$ {Number(valorDiaria)
              .toFixed(2)
              .replace(".", ",")}
          </strong>

        </div>

        <div className="rental-summary-value-row">

          <span>
            Quantidade de diárias
          </span>

          <strong>
            {quantidadeDias}
          </strong>

        </div>

        <div className="rental-summary-divider"></div>

        <div className="rental-summary-total">

          <div>

            <span>
              Valor total
            </span>

            <small>
              Valor estimado da reserva
            </small>

          </div>

          <strong>
            R$ {Number(valorTotal)
              .toFixed(2)
              .replace(".", ",")}
          </strong>

        </div>

      </section>

      <section className="rental-summary-notice">

        <div>
          i
        </div>

        <p>
          O veículo será reservado para o período
          selecionado. Confira as datas antes
          de continuar.
        </p>

      </section>

      <button
        type="button"
        className="rental-summary-confirm"
        onClick={confirmarReserva}
      >
        <span>
          Confirmar reserva
        </span>

        <span>
          →
        </span>
      </button>

    </main>
  );
}

export default RentalSummary;