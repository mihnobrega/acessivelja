import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

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

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);


  // ========================================
  // INICIAR RESUMO POR VOZ
  // ========================================

  useEffect(() => {
    const continuarPorVoz =
      sessionStorage.getItem(
        "continuarResumoAluguelPorVoz"
      );

    if (
      continuarPorVoz !== "true" ||
      !veiculo
    ) {
      return;
    }

    const temporizador =
      setTimeout(() => {
        sessionStorage.removeItem(
          "continuarResumoAluguelPorVoz"
        );

        falarResumoReserva();
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, [veiculo]);


  // ========================================
  // FORMATAR DATA
  // ========================================

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


  // ========================================
  // FORMATAR DATA PARA FALA
  // ========================================

  function formatarDataFalada(data) {
    if (!data) {
      return "";
    }

    return new Date(
      `${data}T12:00:00`
    ).toLocaleDateString(
      "pt-BR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }


  // ========================================
  // FORMATAR VALOR
  // ========================================

  function formatarValor(valor) {
    return Number(
      valor
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
  }


  // ========================================
  // FALAR RESUMO COMPLETO
  // ========================================

  function falarResumoReserva() {
    const retirada =
      formatarDataFalada(
        dataRetirada
      );

    const devolucao =
      formatarDataFalada(
        dataDevolucao
      );

    const diaria =
      formatarValor(
        valorDiaria
      );

    const total =
      formatarValor(
        valorTotal
      );

    const recursos =
      veiculo.recursos
        ? veiculo.recursos.join(", ")
        : "";

    let mensagem =
      `Resumo da reserva. ` +
      `Veículo ${veiculo.nome}. ` +
      `Categoria ${veiculo.tipo}. ` +
      `${veiculo.descricao}. `;

    if (recursos) {
      mensagem +=
        `Recursos de acessibilidade: ${recursos}. `;
    }

    mensagem +=
      `A retirada será em ${retirada}. ` +
      `A devolução será em ${devolucao}. ` +
      `A duração do aluguel será de ${quantidadeDias} ${quantidadeDias === 1 ? "dia" : "dias"}. ` +
      `O valor da diária é ${diaria}. ` +
      `A quantidade de diárias é ${quantidadeDias}. ` +
      `O valor total estimado da reserva é ${total}. ` +
      `Deseja confirmar o aluguel? Diga confirmar aluguel, confirmar, sim ou voltar.`;

    falarEExecutar(
      mensagem,
      ouvirConfirmacaoReserva
    );
  }


  // ========================================
  // OUVIR CONFIRMAÇÃO
  // ========================================

  function ouvirConfirmacaoReserva() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "confirmar aluguel"
          ) ||
          comando.includes(
            "confirmar reserva"
          ) ||
          comando.includes(
            "confirmar"
          ) ||
          comando.includes(
            "sim"
          )
        ) {
          falarEExecutar(
            "Reserva confirmada.",
            () =>
              confirmarReserva(
                true
              )
          );

          return;
        }

        if (
          comando.includes(
            "voltar"
          ) ||
          comando.includes(
            "alterar"
          ) ||
          comando.includes(
            "mudar"
          )
        ) {
          sessionStorage.setItem(
            "continuarPeriodoAluguelPorVoz",
            "true"
          );

          navigate(
            `/aluguel/${id}/periodo`
          );

          return;
        }

        if (
          comando.includes(
            "repetir"
          ) ||
          comando.includes(
            "resumo"
          )
        ) {
          falarResumoReserva();

          return;
        }

        falarEExecutar(
          "Não entendi. Diga confirmar aluguel, repetir resumo ou voltar.",
          ouvirConfirmacaoReserva
        );
      }
    );
  }


  // ========================================
  // CONFIRMAR RESERVA
  // ========================================

  function confirmarReserva(
    porVoz = false
  ) {
    if (
      porVoz
    ) {
      sessionStorage.setItem(
        "continuarAluguelConfirmadoPorVoz",
        "true"
      );
    }

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


  // ========================================
  // FALAR E EXECUTAR
  // ========================================

  function falarEExecutar(
    mensagem,
    callback
  ) {
    if (
      !("speechSynthesis" in window)
    ) {
      callback?.();
      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        mensagem
      );

    fala.lang =
      "pt-BR";

    fala.rate =
      1;

    fala.pitch =
      1;

    fala.onend = () => {
      setTimeout(() => {
        callback?.();
      }, 350);
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ========================================
  // RECONHECER VOZ
  // ========================================

  function reconhecerVoz(
    callback
  ) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (
      !SpeechRecognition
    ) {
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
        setOuvindo(
          true
        );
      };

    reconhecimento.onend =
      () => {
        setOuvindo(
          false
        );
      };

    reconhecimento.onerror =
      (erro) => {
        console.error(
          "Erro no reconhecimento de voz:",
          erro
        );

        setOuvindo(
          false
        );
      };

    reconhecimento.onresult =
      (evento) => {
        const comando =
          evento.results[0][0]
            .transcript
            .toLowerCase()
            .trim();

        callback?.(
          comando
        );
      };

    reconhecimento.start();
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
              navigate(
                "/aluguel"
              )
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
        onClick={() =>
          confirmarReserva(
            false
          )
        }
      >
        <span>
          Confirmar reserva
        </span>

        <span>
          →
        </span>
      </button>


      {ouvindo && (
        <p
          aria-live="polite"
          style={{
            textAlign:
              "center",
            margin:
              "16px 0 24px"
          }}
        >
          🎙️ Ouvindo...
        </p>
      )}

    </main>
  );
}

export default RentalSummary;