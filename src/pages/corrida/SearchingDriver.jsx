import {
  useEffect
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function SearchingDriver() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
  } = location.state || {};

  // ==================================================
  // ALERTA SONORO
  // ==================================================

  useAlertaSonoro(
    corrida
      ? "Procurando um motorista disponível próximo de você. Aguarde alguns instantes."
      : ""
  );

  useEffect(() => {
    if (!corrida) {
      navigate("/home");
      return;
    }

    const tempoBusca =
      setTimeout(() => {
        navigate(
          "/corrida/motorista",
          {
            state: {
              corrida,
              pagamento,
              distancia,
              duracao,
              destino,
            },
          }
        );
      }, 5000);

    return () => {
      clearTimeout(
        tempoBusca
      );
    };
  }, [
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
    navigate,
  ]);

  function cancelarBusca() {
    navigate(-1);
  }

  if (!corrida) {
    return null;
  }

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

  return (
    <main className="searching-driver-page">

      <section className="searching-driver-content">

        <div className="searching-status">

          <span>
            Buscando sua corrida
          </span>

          <h1>
            Procurando motorista...
          </h1>

          <p>
            Estamos procurando um motorista
            próximo de você.
          </p>

        </div>

        <div className="driver-radar">

          <div className="radar-circle radar-circle-one"></div>
          <div className="radar-circle radar-circle-two"></div>
          <div className="radar-circle radar-circle-three"></div>

          <div className="radar-car">
            🚗
          </div>

        </div>

        <div className="searching-message">

          <div className="searching-loading">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <strong>
            Buscando motoristas próximos
          </strong>

          <p>
            Isso pode levar alguns segundos.
          </p>

        </div>

        <section className="searching-trip-card">

          <div className="searching-trip-top">

            <div>
              <span>
                Tipo de corrida
              </span>

              <strong>
                {corrida.nome}
              </strong>
            </div>

            <strong className="searching-price">
              R${" "}
              {corrida.preco
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </div>

          <div className="searching-trip-divider"></div>

          <div className="searching-trip-info">

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
                  ? `${distancia.toFixed(1)} km`
                  : "--"}
              </strong>
            </div>

            <div>
              <span>
                Viagem
              </span>

              <strong>
                {duracao
                  ? `${Math.ceil(duracao)} min`
                  : "--"}
              </strong>
            </div>

          </div>

        </section>

        <button
          type="button"
          className="cancel-search-button"
          onClick={cancelarBusca}
        >
          Cancelar busca
        </button>

      </section>

    </main>
  );
}

export default SearchingDriver;