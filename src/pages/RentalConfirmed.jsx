import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

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

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);


  // ========================================
  // INICIAR CONFIRMAÇÃO POR VOZ
  // ========================================

  useEffect(() => {
    const continuarPorVoz =
      sessionStorage.getItem(
        "continuarAluguelConfirmadoPorVoz"
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
          "continuarAluguelConfirmadoPorVoz"
        );

        falarConfirmacao();
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
  // FALAR CONFIRMAÇÃO
  // ========================================

  function falarConfirmacao() {
    const retirada =
      formatarDataFalada(
        dataRetirada
      );

    const devolucao =
      formatarDataFalada(
        dataDevolucao
      );

    const total =
      formatarValor(
        valorTotal
      );

    const mensagem =
      `Reserva confirmada com sucesso. ` +
      `O veículo ${veiculo.nome} foi reservado. ` +
      `A retirada será em ${retirada}. ` +
      `A devolução será em ${devolucao}. ` +
      `O período será de ${quantidadeDias} ${quantidadeDias === 1 ? "dia" : "dias"}. ` +
      `O valor total estimado é ${total}. ` +
      `Guarde as informações da sua reserva para apresentar no momento da retirada. ` +
      `Diga voltar ao início para retornar para a página inicial.`;

    falarEExecutar(
      mensagem,
      ouvirComandoFinal
    );
  }


  // ========================================
  // OUVIR COMANDO FINAL
  // ========================================

  function ouvirComandoFinal() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "voltar ao início"
          ) ||
          comando.includes(
            "voltar ao inicio"
          ) ||
          comando.includes(
            "início"
          ) ||
          comando.includes(
            "inicio"
          ) ||
          comando.includes(
            "home"
          ) ||
          comando.includes(
            "finalizar"
          )
        ) {
          navigate(
            "/home"
          );

          return;
        }

        if (
          comando.includes(
            "repetir"
          ) ||
          comando.includes(
            "reserva"
          ) ||
          comando.includes(
            "detalhes"
          )
        ) {
          falarConfirmacao();

          return;
        }

        falarEExecutar(
          "Não entendi. Diga voltar ao início ou repetir reserva.",
          ouvirComandoFinal
        );
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
      <main className="rental-confirmed-page">

        <section className="rental-confirmed-error">

          <h1>
            Não encontramos os dados da reserva.
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/home"
              )
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
            navigate(
              "/home"
            )
          }
        >
          <span>
            Voltar ao início
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
              marginTop:
                "16px"
            }}
          >
            🎙️ Ouvindo...
          </p>
        )}

      </section>

    </main>
  );
}

export default RentalConfirmed;