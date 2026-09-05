import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

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

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);


  // ==================================================
  // CONTINUAR FLUXO DE VOZ
  // ==================================================

  useEffect(() => {
    const continuarPorVoz =
      sessionStorage.getItem(
        "continuarResumoPorVoz"
      );

    if (
      continuarPorVoz !== "true" ||
      !corrida ||
      !motorista
    ) {
      return;
    }

    const temporizador =
      setTimeout(() => {
        sessionStorage.removeItem(
          "continuarResumoPorVoz"
        );

        falarAvaliacao();
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, []);


  // ==================================================
  // FALAR AVALIAÇÃO
  // ==================================================

  function falarAvaliacao() {
    if (
      !("speechSynthesis" in window)
    ) {
      ouvirAvaliacao();
      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        "Corrida concluída. Como foi sua viagem? Diga uma avaliação de uma a cinco estrelas."
      );

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    fala.onend = () => {
      setTimeout(() => {
        ouvirAvaliacao();
      }, 350);
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ==================================================
  // OUVIR AVALIAÇÃO
  // ==================================================

  function ouvirAvaliacao() {
    reconhecerVoz(
      (comando) => {
        const nota =
          identificarNota(
            comando
          );

        if (!nota) {
          falarAvaliacaoNaoEntendida();
          return;
        }

        setAvaliacao(
          nota
        );

        perguntarComentario(
          nota
        );
      }
    );
  }


  // ==================================================
  // IDENTIFICAR NOTA
  // ==================================================

  function identificarNota(
    comando
  ) {
    if (
      comando.includes("cinco") ||
      comando.includes("5")
    ) {
      return 5;
    }

    if (
      comando.includes("quatro") ||
      comando.includes("4")
    ) {
      return 4;
    }

    if (
      comando.includes("três") ||
      comando.includes("tres") ||
      comando.includes("3")
    ) {
      return 3;
    }

    if (
      comando.includes("dois") ||
      comando.includes("2")
    ) {
      return 2;
    }

    if (
      comando.includes("uma") ||
      comando.includes("um") ||
      comando.includes("1")
    ) {
      return 1;
    }

    return null;
  }


  // ==================================================
  // AVALIAÇÃO NÃO ENTENDIDA
  // ==================================================

  function falarAvaliacaoNaoEntendida() {
    falarEExecutar(
      "Não entendi sua avaliação. Diga uma, duas, três, quatro ou cinco estrelas.",
      ouvirAvaliacao
    );
  }


  // ==================================================
  // PERGUNTAR COMENTÁRIO
  // ==================================================

  function perguntarComentario(
    nota
  ) {
    falarEExecutar(
      `Avaliação de ${nota} estrelas registrada. Deseja deixar um comentário? Diga sim ou não.`,
      ouvirRespostaComentario
    );
  }


  // ==================================================
  // OUVIR RESPOSTA SOBRE COMENTÁRIO
  // ==================================================

  function ouvirRespostaComentario() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes("sim") ||
          comando.includes("quero") ||
          comando.includes("gostaria")
        ) {
          pedirComentario();
          return;
        }

        if (
          comando.includes("não") ||
          comando.includes("nao") ||
          comando.includes("sem comentário") ||
          comando.includes("sem comentario")
        ) {
          pedirConclusao();
          return;
        }

        falarEExecutar(
          "Não entendi. Diga sim para deixar um comentário ou não para continuar.",
          ouvirRespostaComentario
        );
      }
    );
  }


  // ==================================================
  // PEDIR COMENTÁRIO
  // ==================================================

  function pedirComentario() {
    falarEExecutar(
      "Diga agora o seu comentário sobre a viagem.",
      ouvirComentario
    );
  }


  // ==================================================
  // OUVIR COMENTÁRIO
  // ==================================================

  function ouvirComentario() {
    reconhecerVoz(
      (comando) => {
        setComentario(
          comando
        );

        falarEExecutar(
          "Comentário registrado. Diga concluir para voltar à página inicial.",
          ouvirConclusao
        );
      }
    );
  }


  // ==================================================
  // PEDIR CONCLUSÃO
  // ==================================================

  function pedirConclusao() {
    falarEExecutar(
      "Avaliação registrada. Diga concluir para voltar à página inicial.",
      ouvirConclusao
    );
  }


  // ==================================================
  // OUVIR CONCLUSÃO
  // ==================================================

  function ouvirConclusao() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes("concluir") ||
          comando.includes("finalizar") ||
          comando.includes("terminar")
        ) {
          concluir();
          return;
        }

        falarEExecutar(
          "Não entendi. Diga concluir.",
          ouvirConclusao
        );
      }
    );
  }


  // ==================================================
  // FALAR E EXECUTAR
  // ==================================================

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

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    fala.onend = () => {
      setTimeout(() => {
        callback?.();
      }, 350);
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ==================================================
  // RECONHECER VOZ
  // ==================================================

  function reconhecerVoz(
    callback
  ) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
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

    reconhecimento.onstart = () => {
      setOuvindo(
        true
      );
    };

    reconhecimento.onend = () => {
      setOuvindo(
        false
      );
    };

    reconhecimento.onerror = (
      erro
    ) => {
      console.error(
        "Erro no reconhecimento de voz:",
        erro
      );

      setOuvindo(
        false
      );
    };

    reconhecimento.onresult = (
      evento
    ) => {
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


  // ==================================================
  // CONCLUIR
  // ==================================================

  function concluir() {
    window.speechSynthesis?.cancel();

    navigate(
      "/home"
    );
  }


  // ==================================================
  // SEGURANÇA
  // ==================================================

  if (
    !corrida ||
    !motorista
  ) {
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
              .replace(
                ".",
                ","
              )}
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
        onClick={
          concluir
        }
      >
        Concluir

        <span>
          →
        </span>
      </button>


      {ouvindo && (
        <p
          aria-live="polite"
          style={{
            textAlign: "center",
            marginTop: "12px"
          }}
        >
          🎙️ Ouvindo...
        </p>
      )}

    </main>
  );
}

export default RideSummary;