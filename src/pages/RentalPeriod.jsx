import {
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  buscarVeiculoPorId
} from "../data/vehicles";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function RentalPeriod() {
  const navigate = useNavigate();
  const { id } = useParams();

  const veiculo =
    buscarVeiculoPorId(id);

  const [
    dataRetirada,
    setDataRetirada
  ] = useState("");

  const [
    dataDevolucao,
    setDataDevolucao
  ] = useState("");

  // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    veiculo
      ? `Escolha o período de aluguel do veículo ${veiculo.nome}. Informe a data de retirada e a data de devolução.`
      : ""
  );

  if (!veiculo) {
    return (
      <main className="rental-period-page">

        <section className="rental-period-error">

          <h1>
            Veículo não encontrado
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

  function obterValorDiaria() {
    const valorNumerico =
      veiculo.valor
        .replace("R$", "")
        .replace(",", ".")
        .trim();

    return Number(
      valorNumerico
    );
  }

  function calcularDias() {
    if (
      !dataRetirada ||
      !dataDevolucao
    ) {
      return 0;
    }

    const retirada =
      new Date(
        `${dataRetirada}T12:00:00`
      );

    const devolucao =
      new Date(
        `${dataDevolucao}T12:00:00`
      );

    const diferenca =
      devolucao - retirada;

    if (diferenca < 0) {
      return 0;
    }

    const dias =
      Math.ceil(
        diferenca /
        (1000 * 60 * 60 * 24)
      );

    return Math.max(
      1,
      dias
    );
  }

  const quantidadeDias =
    calcularDias();

  const valorDiaria =
    obterValorDiaria();

  const valorTotal =
    quantidadeDias *
    valorDiaria;

  const periodoValido =
    dataRetirada &&
    dataDevolucao &&
    quantidadeDias > 0;

  function continuarReserva() {
    if (!periodoValido) {
      return;
    }

    navigate(
      `/aluguel/${id}/resumo`,
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

  const hoje =
    new Date()
      .toISOString()
      .split("T")[0];

  return (
    <main className="rental-period-page">

      <header className="rental-period-header">

        <button
          type="button"
          className="rental-period-back"
          onClick={() =>
            navigate(`/aluguel/${id}`)
          }
          aria-label="Voltar"
        >
          ←
        </button>

        <div>

          <span>
            ALUGUEL
          </span>

          <h1>
            Escolha o período
          </h1>

          <p>
            Defina quando você deseja retirar
            e devolver o veículo.
          </p>

        </div>

      </header>

      <section className="rental-period-vehicle">

        <div className="rental-period-vehicle-image">

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

        <div className="rental-period-vehicle-info">

          <span>
            {veiculo.tipo}
          </span>

          <h2>
            {veiculo.nome}
          </h2>

          <div>

            <strong>
              {veiculo.valor}
            </strong>

            <small>
              {veiculo.periodo}
            </small>

          </div>

        </div>

      </section>

      <section className="rental-period-selection">

        <div className="rental-period-title">

          <span>
            PERÍODO DA RESERVA
          </span>

          <h2>
            Quando você precisa do veículo?
          </h2>

        </div>

        <div className="rental-date-fields">

          <label className="rental-date-field">

            <span>
              Data de retirada
            </span>

            <input
              type="date"
              value={dataRetirada}
              min={hoje}
              onChange={(evento) => {
                setDataRetirada(
                  evento.target.value
                );

                if (
                  dataDevolucao &&
                  evento.target.value >
                  dataDevolucao
                ) {
                  setDataDevolucao("");
                }
              }}
            />

          </label>

          <label className="rental-date-field">

            <span>
              Data de devolução
            </span>

            <input
              type="date"
              value={dataDevolucao}
              min={dataRetirada || hoje}
              disabled={!dataRetirada}
              onChange={(evento) =>
                setDataDevolucao(
                  evento.target.value
                )
              }
            />

          </label>

        </div>

      </section>

      {periodoValido && (
        <section className="rental-period-summary">

          <div className="rental-period-summary-title">

            <span>
              RESUMO
            </span>

            <h2>
              Seu período de aluguel
            </h2>

          </div>

          <div className="rental-period-summary-info">

            <div>

              <span>
                Diária
              </span>

              <strong>
                R$ {valorDiaria
                  .toFixed(2)
                  .replace(".", ",")}
              </strong>

            </div>

            <div>

              <span>
                Período
              </span>

              <strong>
                {quantidadeDias}{" "}
                {quantidadeDias === 1
                  ? "dia"
                  : "dias"}
              </strong>

            </div>

          </div>

          <div className="rental-period-total">

            <div>

              <span>
                Valor estimado
              </span>

              <small>
                {quantidadeDias}{" "}
                {quantidadeDias === 1
                  ? "diária"
                  : "diárias"}
              </small>

            </div>

            <strong>
              R$ {valorTotal
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </div>

        </section>
      )}

      <button
        type="button"
        className="rental-period-continue"
        disabled={!periodoValido}
        onClick={continuarReserva}
      >
        <span>
          Continuar
        </span>

        <span>
          →
        </span>
      </button>

    </main>
  );
}

export default RentalPeriod;