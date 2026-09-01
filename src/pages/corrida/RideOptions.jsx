import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import useAlertaSonoro from "../../hooks/useAlertaSonoro";

function RideOptions() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    distancia,
    duracao,
    destino
  } = location.state || {};

  // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    "Escolha uma opção de corrida. Confira o preço, o tempo estimado e os recursos disponíveis."
  );


  // ========================================
  // ESTADOS
  // ========================================

  const [
    corridaSelecionada,
    setCorridaSelecionada
  ] = useState(null);

  const [
    pagamento,
    setPagamento
  ] = useState("pix");

  const [
    ouvindoOpcao,
    setOuvindoOpcao
  ] = useState(false);

  const corridaSelecionadaRef =
  useRef(null);

const pagamentoRef =
  useRef("pix");


  // ========================================
  // DADOS DO USUÁRIO
  // ========================================

  const dadosUsuario =
    localStorage.getItem(
      "acessivelJaUsuario"
    );

  const usuario =
    dadosUsuario
      ? JSON.parse(
          dadosUsuario
        )
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


  // ========================================
  // CALCULAR PREÇO
  // ========================================

  function calcularPreco(
    valorBase,
    valorPorKm
  ) {
    if (!distancia) {
      return valorBase;
    }

    return (
      valorBase +
      distancia * valorPorKm
    );
  }


  // ========================================
  // OPÇÕES DE CORRIDA
  // ========================================

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


  // ========================================
  // CONFIRMAR CORRIDA
  // ========================================

  function confirmarCorrida() {
  const corridaAtual =
    corridaSelecionadaRef.current;

  const pagamentoAtual =
    pagamentoRef.current;

  if (!corridaAtual) {
    return;
  }

  navigate(
    "/corrida/procurando",
    {
      state: {
        corrida:
          corridaAtual,
        pagamento:
          pagamentoAtual,
        distancia,
        duracao,
        destino,
      },
    }
  );
}


  // ========================================
  // FALAR E DEPOIS OUVIR
  // ========================================

  function falarEExecutar(
    mensagem,
    proximaEtapa
  ) {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      if (proximaEtapa) {
        proximaEtapa();
      }

      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        mensagem
      );

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;
    fala.volume = 1;

    fala.onend = () => {
      if (!proximaEtapa) {
        return;
      }

      setTimeout(() => {
        proximaEtapa();
      }, 350);
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ========================================
  // RECONHECIMENTO DE VOZ
  // ========================================

  function reconhecerVoz(
    callback
  ) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "O reconhecimento de voz não é suportado neste navegador."
      );

      return;
    }

    const reconhecimento =
      new SpeechRecognition();

    reconhecimento.lang =
      "pt-BR";

    reconhecimento.continuous =
      false;

    reconhecimento.interimResults =
      false;

    reconhecimento.onstart =
      () => {
        setOuvindoOpcao(
          true
        );
      };

    reconhecimento.onend =
      () => {
        setOuvindoOpcao(
          false
        );
      };

    reconhecimento.onerror =
      (erro) => {
        console.error(
          "Erro no reconhecimento de voz:",
          erro
        );

        setOuvindoOpcao(
          false
        );
      };

    reconhecimento.onresult =
      (evento) => {
        const texto =
          evento.results[0][0]
            .transcript
            .trim();

        callback(
          texto
        );
      };

    reconhecimento.start();
  }


  // ========================================
  // NORMALIZAR COMANDO
  // ========================================

  function normalizarComando(
    texto
  ) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .trim();
  }


  // ========================================
  // OUVIR OPÇÃO DE CORRIDA
  // ========================================

  function ouvirOpcaoCorrida() {
    reconhecerVoz(
      (texto) => {
        const comando =
          normalizarComando(
            texto
          );

        if (
          comando.includes(
            "adaptado"
          ) ||
          comando.includes(
            "adaptada"
          )
        ) {
          selecionarCorridaPorVoz(
            corridaAdaptada
          );

          return;
        }

        if (
          comando.includes(
            "confort"
          ) ||
          comando.includes(
            "conforto"
          )
        ) {
          selecionarCorridaPorVoz(
            corridaConfort
          );

          return;
        }

        if (
          comando.includes(
            "acessivel ja"
          ) ||
          comando.includes(
            "normal"
          )
        ) {
          selecionarCorridaPorVoz(
            corridaNormal
          );

          return;
        }

        falarEExecutar(
          "Não consegui identificar a opção de corrida. Diga Acessível Já, Acessível Adaptado ou Acessível Confort.",
          ouvirOpcaoCorrida
        );
      }
    );
  }


  // ========================================
  // SELECIONAR CORRIDA POR VOZ
  // ========================================

  function selecionarCorridaPorVoz(
  corrida
) {
  corridaSelecionadaRef.current =
    corrida;

  setCorridaSelecionada(
    corrida
  );

  falarEExecutar(
    `${corrida.nome} selecionado. Como deseja pagar? Diga Pix, cartão ou dinheiro.`,
    ouvirPagamento
  );
}


  // ========================================
  // OUVIR PAGAMENTO
  // ========================================

  function ouvirPagamento() {
    reconhecerVoz(
      (texto) => {
        const comando =
          normalizarComando(
            texto
          );

        if (
          comando.includes(
            "pix"
          )
        ) {
          selecionarPagamentoPorVoz(
            "pix",
            "Pix"
          );

          return;
        }

        if (
          comando.includes(
            "cartao"
          ) ||
          comando.includes(
            "credito"
          ) ||
          comando.includes(
            "debito"
          )
        ) {
          selecionarPagamentoPorVoz(
            "cartao",
            "cartão"
          );

          return;
        }

        if (
          comando.includes(
            "dinheiro"
          )
        ) {
          selecionarPagamentoPorVoz(
            "dinheiro",
            "dinheiro"
          );

          return;
        }

        falarEExecutar(
          "Não consegui identificar a forma de pagamento. Diga Pix, cartão ou dinheiro.",
          ouvirPagamento
        );
      }
    );
  }


  // ========================================
  // SELECIONAR PAGAMENTO
  // ========================================

  function selecionarPagamentoPorVoz(
  tipo,
  nome
) {
  pagamentoRef.current =
    tipo;

  setPagamento(
    tipo
  );

  falarEExecutar(
    `Pagamento por ${nome} selecionado. Diga confirmar corrida para continuar.`,
    ouvirConfirmacao
  );
}


  // ========================================
  // OUVIR CONFIRMAÇÃO
  // ========================================

  function ouvirConfirmacao() {
    reconhecerVoz(
      (texto) => {
        const comando =
          normalizarComando(
            texto
          );

        if (
          comando.includes(
            "confirmar corrida"
          ) ||
          comando.includes(
            "confirmar"
          ) ||
          comando.includes(
            "sim"
          )
        ) {
          confirmarCorrida();

          return;
        }

        if (
          comando.includes(
            "nao"
          ) ||
          comando.includes(
            "cancelar"
          )
        ) {
          falarEExecutar(
            "Tudo bem. Diga Pix, cartão ou dinheiro para escolher outra forma de pagamento.",
            ouvirPagamento
          );

          return;
        }

        falarEExecutar(
          "Não entendi. Diga confirmar corrida para continuar ou não para voltar ao pagamento.",
          ouvirConfirmacao
        );
      }
    );
  }


  // ========================================
  // COMANDOS DO MICROFONE GLOBAL
  // ========================================

  useEffect(() => {
    function executarComando(
      evento
    ) {
      const comando =
        normalizarComando(
          evento.detail.comando
        );

      if (
        comando.includes(
          "adaptado"
        ) ||
        comando.includes(
          "adaptada"
        )
      ) {
        evento.detail.entendido =
          true;

        selecionarCorridaPorVoz(
          corridaAdaptada
        );

        return;
      }

      if (
        comando.includes(
          "confort"
        ) ||
        comando.includes(
          "conforto"
        )
      ) {
        evento.detail.entendido =
          true;

        selecionarCorridaPorVoz(
          corridaConfort
        );

        return;
      }

      if (
        comando.includes(
          "acessivel ja"
        ) ||
        comando.includes(
          "corrida normal"
        ) ||
        comando === "normal"
      ) {
        evento.detail.entendido =
          true;

        selecionarCorridaPorVoz(
          corridaNormal
        );

        return;
      }

      if (
        comando.includes(
          "pix"
        )
      ) {
        evento.detail.entendido =
          true;

        selecionarPagamentoPorVoz(
          "pix",
          "Pix"
        );

        return;
      }

      if (
        comando.includes(
          "cartao"
        ) ||
        comando.includes(
          "credito"
        ) ||
        comando.includes(
          "debito"
        )
      ) {
        evento.detail.entendido =
          true;

        selecionarPagamentoPorVoz(
          "cartao",
          "cartão"
        );

        return;
      }

      if (
        comando.includes(
          "dinheiro"
        )
      ) {
        evento.detail.entendido =
          true;

        selecionarPagamentoPorVoz(
          "dinheiro",
          "dinheiro"
        );

        return;
      }

      if (
        comando.includes(
          "confirmar corrida"
        ) ||
        comando.includes(
          "confirmar"
        )
      ) {
        if (
          corridaSelecionada
        ) {
          evento.detail.entendido =
            true;

          confirmarCorrida();
        }

        return;
      }
    }

    window.addEventListener(
      "comandoVozPagina",
      executarComando
    );

    return () => {
      window.removeEventListener(
        "comandoVozPagina",
        executarComando
      );
    };
  }, [
    corridaSelecionada,
    pagamento,
    distancia,
    duracao,
    destino
  ]);

  useEffect(() => {
  const iniciarPorVoz =
    sessionStorage.getItem(
      "iniciarOpcoesCorridaPorVoz"
    );

  if (
    iniciarPorVoz !== "true"
  ) {
    return;
  }

  const temporizador =
    setTimeout(() => {
      sessionStorage.removeItem(
        "iniciarOpcoesCorridaPorVoz"
      );

      falarEExecutar(
        "Escolha sua corrida. Você pode dizer Acessível Já, Acessível Adaptado ou Acessível Confort.",
        ouvirOpcaoCorrida
      );
    }, 800);

  return () => {
    clearTimeout(
      temporizador
    );
  };
}, []);


  return (
    <main className="ride-options-page">

      <header className="ride-options-header">

        <button
          className="ride-back-button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          ←
        </button>

        <div>
          <p>
            Sua viagem
          </p>

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

        {opcoes.map(
          (opcao) => {

            const recomendadoAdaptado =
              precisaAdaptado &&
              opcao.id ===
                "adaptada";

            const recomendadoNormal =
              !precisaAdaptado &&
              opcao.id ===
                "normal";

            const selecionada =
              corridaSelecionada
                ?.id ===
              opcao.id;

            return (
              <button
                key={
                  opcao.id
                }
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
                onClick={() => {
                  corridaSelecionadaRef.current =
                    opcao;

                  setCorridaSelecionada(
                    opcao
                  );
                }}
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
                      {
                        opcao.tempoChegada
                      }{" "}
                      min
                    </span>

                  </div>


                  <p>
                    {
                      opcao.descricao
                    }
                  </p>


                  <div className="ride-option-bottom">

                    <small>
                      Motorista em aproximadamente{" "}
                      {
                        opcao.tempoChegada
                      }{" "}
                      minutos
                    </small>

                    <strong>
                      R${" "}
                      {opcao.preco
                        .toFixed(
                          2
                        )
                        .replace(
                          ".",
                          ","
                        )}
                    </strong>

                  </div>

                </div>

              </button>
            );
          }
        )}

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
                pagamento ===
                "pix"
                  ? "payment-selected"
                  : ""
              }`}
              onClick={() => {
                pagamentoRef.current =
                  "pix";

                setPagamento(
                  "pix"
                );
              }}
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
                {pagamento ===
                "pix"
                  ? "✓"
                  : ""}
              </span>
            </button>


            <button
              type="button"
              className={`payment-option ${
                pagamento ===
                "cartao"
                  ? "payment-selected"
                  : ""
              }`}
              onClick={() => {
                pagamentoRef.current =
                  "cartao";

                setPagamento(
                  "cartao"
                );
              }}
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
                {pagamento ===
                "cartao"
                  ? "✓"
                  : ""}
              </span>
            </button>


            <button
              type="button"
              className={`payment-option ${
                pagamento ===
                "dinheiro"
                  ? "payment-selected"
                  : ""
              }`}
              onClick={() => {
                pagamentoRef.current =
                  "dinheiro";

                setPagamento(
                  "dinheiro"
                );
              }}
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
                {pagamento ===
                "dinheiro"
                  ? "✓"
                  : ""}
              </span>
            </button>

          </div>


          <button
            className="confirm-ride-button"
            type="button"
            onClick={
              confirmarCorrida
            }
          >

            <span>
              Confirmar{" "}
              {
                corridaSelecionada
                  .nome
              }
            </span>

            <strong>
              R${" "}
              {corridaSelecionada
                .preco
                .toFixed(2)
                .replace(
                  ".",
                  ","
                )}
            </strong>

          </button>

        </section>
      )}


      {ouvindoOpcao && (
        <div
          className="voice-listening-status"
          role="status"
        >
          Ouvindo...
        </div>
      )}

    </main>
  );
}

export default RideOptions;