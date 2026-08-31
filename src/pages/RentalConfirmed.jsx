import {
  useLocation,
  useNavigate
} from "react-router-dom";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function RentalConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    veiculo,
    dataRetirada,
    dataDevolucao,
    quantidadeDias,
    valorTotal,
  } = location.state || {};

  // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    veiculo
      ? `Reserva confirmada com sucesso. O veículo ${veiculo.nome} foi reservado.`
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

  if (!veiculo) {
    return (
      <main className="rental-confirmed-page">

        <section className="rental-confirmed-error">

          <h1>
            Não encontramos os dados da reserva.
          </h1>

          <button
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
    <main className="rental-confirmed-page">

      <section className="rental-confirmed-content">

        <div className="rental-confirmed-icon">
          ✓
        </div>

        <div className="rental-confirmed-title">

          <span>
            RESERVA REALIZADA
          </span>

          <h1>
            Reserva confirmada!
          </h1>

          <p>
            Seu veículo foi reservado com sucesso.
            Confira abaixo os detalhes do aluguel.
          </p>

        </div>

        <section className="rental-confirmed-vehicle">

          <div className="rental-confirmed-image">

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

          <div className="rental-confirmed-vehicle-info">

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

        <section className="rental-confirmed-details">

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

        </section>

        <section className="rental-confirmed-total">

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

        </section>

        <section className="rental-confirmed-notice">

          <div>
            i
          </div>

          <p>
            Guarde as informações da sua reserva.
            Você poderá apresentar os dados no
            momento da retirada do veículo.
          </p>

        </section>

        <button
          type="button"
          className="rental-confirmed-home"
          onClick={() =>
            navigate("/home")
          }
        >
          <span>
            Voltar ao início
          </span>

          <span>
            →
          </span>
        </button>

      </section>

    </main>
  );
}

export default RentalConfirmed;