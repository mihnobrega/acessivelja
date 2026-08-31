import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function RideOptions() {
  const navigate = useNavigate();
  const location = useLocation();

  const { distancia, duracao, destino } =
    location.state || {};

  // ALERTA SONORO
  useAlertaSonoro(
    "Escolha uma opção de corrida. Confira o preço, o tempo estimado e os recursos disponíveis."
  );

  const [corridaSelecionada, setCorridaSelecionada] =
    useState(null);

  const [pagamento, setPagamento] =
    useState("pix");

  const dadosUsuario = localStorage.getItem(
    "acessivelJaUsuario"
  );

  const usuario = dadosUsuario
    ? JSON.parse(dadosUsuario)
    : null;

  const necessidades =
    usuario?.necessidades || [];

  const usaCadeiraDeRodas =
    necessidades.includes(
      "Usuário de cadeira de rodas"
    );

  const mobilidadeReduzida =
    necessidades.includes(
      "Mobilidade reduzida"
    );

  const precisaAdaptado =
    usaCadeiraDeRodas ||
    mobilidadeReduzida;

  function calcularPreco(
    valorBase,
    valorPorKm
  ) {
    if (!distancia) {
      return valorBase;
    }

    return valorBase +
      distancia * valorPorKm;
  }

  const corridaNormal = {
    id: "normal",
    nome: "Acessível Já",
    descricao:
      "Corrida confortável para o seu dia a dia.",
    tempoChegada: 3,
    preco: calcularPreco(
      6.5,
      2.2
    ),
    icone: "🚗",
  };

  const corridaAdaptada = {
    id: "adaptada",
    nome: "Acessível Adaptado",
    descricao:
      "Veículo preparado para embarque com cadeira de rodas.",
    tempoChegada: 5,
    preco: calcularPreco(
      8.5,
      2.7
    ),
    icone: "♿",
  };

  const corridaConfort = {
    id: "confort",
    nome: "Acessível Confort",
    descricao:
      "Mais espaço e conforto durante a viagem.",
    tempoChegada: 6,
    preco: calcularPreco(
      10,
      3.2
    ),
    icone: "🚙",
  };

  let opcoes = [
    corridaNormal,
    corridaAdaptada,
    corridaConfort,
  ];

  if (precisaAdaptado) {
    opcoes = [
      corridaAdaptada,
      corridaNormal,
      corridaConfort,
    ];
  }

  function confirmarCorrida() {
    if (!corridaSelecionada) {
      return;
    }

    navigate("/corrida/procurando", {
      state: {
        corrida: corridaSelecionada,
        pagamento,
        distancia,
        duracao,
        destino,
      },
    });
  }

  return (
    <main className="ride-options-page">

      <header className="ride-options-header">

        <button
          className="ride-back-button"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          ←
        </button>

        <div>
          <p>Sua viagem</p>

          <h1>
            Escolha sua corrida
          </h1>
        </div>

      </header>


      <section className="ride-summary">

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


        <div className="ride-summary-divider"></div>


        <div>
          <span>
            Tempo estimado
          </span>

          <strong>
            {duracao
              ? `${Math.ceil(duracao)} min`
              : "--"}
          </strong>
        </div>

      </section>


      {destino && (
        <section className="ride-options-destination">

          <span>
            Destino
          </span>

          <strong>
            {destino.nome}
          </strong>

        </section>
      )}


      {precisaAdaptado && (
        <section className="personalized-message">

          <span aria-hidden="true">
            ♿
          </span>

          <div>

            <strong>
              Recomendação personalizada
            </strong>

            <p>
              Priorizamos veículos adaptados
              de acordo com suas necessidades
              de mobilidade.
            </p>

          </div>

        </section>
      )}


      <section className="ride-options-list">

        {opcoes.map((opcao) => {

          const recomendadoAdaptado =
            precisaAdaptado &&
            opcao.id === "adaptada";

          const recomendadoNormal =
            !precisaAdaptado &&
            opcao.id === "normal";

          const selecionada =
            corridaSelecionada?.id ===
            opcao.id;

          return (
            <button
              key={opcao.id}
              type="button"
              className={`ride-option-card ${
                selecionada
                  ? "ride-option-selected"
                  : ""
              } ${
                recomendadoAdaptado
                  ? "ride-option-recommended"
                  : ""
              }`}
              onClick={() =>
                setCorridaSelecionada(opcao)
              }
            >

              {recomendadoAdaptado && (
                <span className="recommended-badge">
                  Recomendado para você
                </span>
              )}

              {recomendadoNormal && (
                <span className="recommended-simple">
                  Recomendado
                </span>
              )}

              <div className="ride-option-icon">
                {opcao.icone}
              </div>


              <div className="ride-option-content">

                <div className="ride-option-title">

                  <strong>
                    {opcao.nome}
                  </strong>

                  <span>
                    {opcao.tempoChegada} min
                  </span>

                </div>


                <p>
                  {opcao.descricao}
                </p>


                <div className="ride-option-bottom">

                  <small>
                    Motorista em aproximadamente{" "}
                    {opcao.tempoChegada} minutos
                  </small>

                  <strong>
                    R${" "}
                    {opcao.preco
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                </div>

              </div>

            </button>
          );
        })}

      </section>


      {corridaSelecionada && (
        <section className="payment-section">

          <div className="payment-header">

            <div>
              <span>
                Pagamento
              </span>

              <h2>
                Como deseja pagar?
              </h2>
            </div>

          </div>


          <div className="payment-options">

            <button
              type="button"
              className={`payment-option ${
                pagamento === "pix"
                  ? "payment-selected"
                  : ""
              }`}
              onClick={() =>
                setPagamento("pix")
              }
            >
              <span className="payment-icon">
                ◈
              </span>

              <div>
                <strong>
                  Pix
                </strong>

                <small>
                  Pagamento por QR Code
                </small>
              </div>

              <span className="payment-check">
                {pagamento === "pix"
                  ? "✓"
                  : ""}
              </span>
            </button>


            <button
              type="button"
              className={`payment-option ${
                pagamento === "cartao"
                  ? "payment-selected"
                  : ""
              }`}
              onClick={() =>
                setPagamento("cartao")
              }
            >
              <span className="payment-icon">
                💳
              </span>

              <div>
                <strong>
                  Cartão
                </strong>

                <small>
                  Crédito ou débito
                </small>
              </div>

              <span className="payment-check">
                {pagamento === "cartao"
                  ? "✓"
                  : ""}
              </span>
            </button>


            <button
              type="button"
              className={`payment-option ${
                pagamento === "dinheiro"
                  ? "payment-selected"
                  : ""
              }`}
              onClick={() =>
                setPagamento("dinheiro")
              }
            >
              <span className="payment-icon">
                R$
              </span>

              <div>
                <strong>
                  Dinheiro
                </strong>

                <small>
                  Pague ao motorista
                </small>
              </div>

              <span className="payment-check">
                {pagamento === "dinheiro"
                  ? "✓"
                  : ""}
              </span>
            </button>

          </div>


          <button
            className="confirm-ride-button"
            type="button"
            onClick={confirmarCorrida}
          >

            <span>
              Confirmar{" "}
              {corridaSelecionada.nome}
            </span>

            <strong>
              R${" "}
              {corridaSelecionada.preco
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </button>

        </section>
      )}

    </main>
  );
}

export default RideOptions;