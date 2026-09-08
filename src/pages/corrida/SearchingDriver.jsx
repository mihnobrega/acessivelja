import {
  useEffect
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";


function SearchingDriver() {
  const navigate =
    useNavigate();

  const location =
    useLocation();


  const {
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
    porVoz
  } = location.state || {};


  // ==================================================
  // BUSCAR MOTORISTA
  // ==================================================

  useEffect(() => {
    if (
      !corrida
    ) {
      navigate(
        "/home"
      );

      return;
    }


    let tempoBusca =
      null;


    function iniciarBusca() {
      tempoBusca =
        setTimeout(() => {

          if (
            porVoz === true
          ) {
            sessionStorage.setItem(
              "continuarMotoristaPorVoz",
              "true"
            );
          } else {
            sessionStorage.removeItem(
              "continuarMotoristaPorVoz"
            );
          }


          navigate(
            "/corrida/motorista",
            {
              state: {
                corrida,
                pagamento,
                distancia,
                duracao,
                destino,
                porVoz:
                  porVoz === true
              }
            }
          );

        }, 5000);
    }


    // ========================================
    // FLUXO NORMAL
    // ========================================

    if (
      porVoz !== true
    ) {
      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      iniciarBusca();

      return () => {
        if (
          tempoBusca
        ) {
          clearTimeout(
            tempoBusca
          );
        }
      };
    }


    // ========================================
    // FLUXO POR VOZ
    // ========================================

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();


      const fala =
        new SpeechSynthesisUtterance(
          "Procurando um motorista disponível próximo de você. Aguarde alguns instantes."
        );


      fala.lang =
        "pt-BR";

      fala.rate =
        1;

      fala.pitch =
        1;


      fala.onend =
        () => {
          iniciarBusca();
        };


      window.speechSynthesis.speak(
        fala
      );

    } else {
      iniciarBusca();
    }


    return () => {
      if (
        tempoBusca
      ) {
        clearTimeout(
          tempoBusca
        );
      }


      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };

  }, [
    corrida,
    pagamento,
    distancia,
    duracao,
    destino,
    porVoz,
    navigate
  ]);


  // ==================================================
  // CANCELAR BUSCA
  // ==================================================

  function cancelarBusca() {
    sessionStorage.removeItem(
      "continuarMotoristaPorVoz"
    );


    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }


    navigate(
      -1
    );
  }


  // ==================================================
  // VERIFICA CORRIDA
  // ==================================================

  if (
    !corrida
  ) {
    return null;
  }


  // ==================================================
  // NOME DO PAGAMENTO
  // ==================================================

  function nomePagamento() {
    if (
      pagamento === "pix"
    ) {
      return "Pix";
    }


    if (
      pagamento === "cartao"
    ) {
      return "Cartão";
    }


    if (
      pagamento === "dinheiro"
    ) {
      return "Dinheiro";
    }


    return "Não informado";
  }


  return (
    <main className="searching-driver-page">

      <section className="searching-driver-content">


        {/* ========================================
            STATUS
        ======================================== */}

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


        {/* ========================================
            RADAR
        ======================================== */}

        <div className="driver-radar">

          <div className="radar-circle radar-circle-one"></div>

          <div className="radar-circle radar-circle-two"></div>

          <div className="radar-circle radar-circle-three"></div>

          <div className="radar-car">
            🚗
          </div>

        </div>


        {/* ========================================
            MENSAGEM DE BUSCA
        ======================================== */}

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


        {/* ========================================
            RESUMO DA CORRIDA
        ======================================== */}

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
                .replace(
                  ".",
                  ","
                )}

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


        {/* ========================================
            CANCELAR
        ======================================== */}

        <button
          type="button"
          className="cancel-search-button"
          onClick={
            cancelarBusca
          }
        >
          Cancelar busca
        </button>

      </section>

    </main>
  );
}

export default SearchingDriver;