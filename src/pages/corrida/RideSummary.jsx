import {
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function RideSummary() {
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

  const [
    avaliacao,
    setAvaliacao
  ] = useState(0);

  const [
    comentario,
    setComentario
  ] = useState("");

  // ==================================================
  // ALERTA SONORO
  // ==================================================

  useAlertaSonoro(
    corrida && motorista
      ? "Corrida concluída. Como foi sua viagem? Você pode avaliar seu motorista de uma a cinco estrelas."
      : ""
  );

  function nomePagamento() {
    if (pagamento === "pix") {
      return "Pix";
    }

    if (pagamento === "cartao") {
      return "Cartão";
    }

    if (pagamento === "dinheiro") {
      return "Dinheiro";
    }

    return "Não informado";
  }

  function concluir() {
    navigate("/home");
  }

  if (!corrida || !motorista) {
    return (
      <main className="ride-summary-page">

        <section className="driver-error-card">

          <h1>
            Não encontramos os dados da corrida.
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

  return (
    <main className="ride-summary-page">

      <header className="ride-summary-header">

        <span>
          Corrida concluída
        </span>

        <h1>
          Como foi sua viagem?
        </h1>

        <p>
          Sua opinião ajuda a melhorar
          a experiência do Acessível Já.
        </p>

      </header>

      <section className="ride-summary-driver">

        <div className="ride-summary-avatar">
          CH
        </div>

        <div>

          <span>
            Motorista
          </span>

          <strong>
            {motorista.nome}
          </strong>

          <small>
            ★ {motorista.avaliacao}
          </small>

        </div>

      </section>

      <section className="ride-summary-details">

        <div>

          <span>
            Valor
          </span>

          <strong>
            R${" "}
            {corrida.preco
              .toFixed(2)
              .replace(".", ",")}
          </strong>

        </div>

        <div>

          <span>
            Pagamento
          </span>

          <strong>
            {nomePagamento()}
          </strong>

        </div>

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
            Tempo
          </span>

          <strong>
            {duracao
              ? `${Math.ceil(Number(duracao))} min`
              : "--"}
          </strong>

        </div>

      </section>

      {destino && (
        <section className="ride-summary-destination">

          <span>
            Destino
          </span>

          <strong>
            {destino.nome}
          </strong>

        </section>
      )}

      <section className="ride-rating-card">

        <span>
          Avaliação
        </span>

        <h2>
          Avalie seu motorista
        </h2>

        <div className="ride-rating-stars">

          {[1, 2, 3, 4, 5].map(
            (estrela) => (
              <button
                key={estrela}
                type="button"
                className={
                  estrela <= avaliacao
                    ? "ride-star active"
                    : "ride-star"
                }
                onClick={() =>
                  setAvaliacao(
                    estrela
                  )
                }
                aria-label={`Dar ${estrela} estrelas`}
              >
                ★
              </button>
            )
          )}

        </div>

        <textarea
          value={comentario}
          onChange={(evento) =>
            setComentario(
              evento.target.value
            )
          }
          placeholder="Quer deixar algum comentário?"
        />

      </section>

      <button
        type="button"
        className="ride-summary-finish"
        onClick={concluir}
      >
        Concluir

        <span>
          →
        </span>
      </button>

    </main>
  );
}

export default RideSummary;