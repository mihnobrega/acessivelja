import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  veiculos
} from "../data/vehicles";

function VehicleRental() {
  const navigate = useNavigate();

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);


  // ========================================
  // INICIAR FLUXO POR VOZ
  // ========================================

  useEffect(() => {
    const iniciarPorVoz =
      sessionStorage.getItem(
        "iniciarAluguelPorVoz"
      );

    if (
      iniciarPorVoz !== "true"
    ) {
      return;
    }

    const temporizador =
      setTimeout(() => {
        sessionStorage.removeItem(
          "iniciarAluguelPorVoz"
        );

        falarIntroducaoAluguel();
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, []);


  // ========================================
  // FALAR INTRODUÇÃO
  // ========================================

  function falarIntroducaoAluguel() {
    const nomesVeiculos =
      veiculos
        .map(
          (veiculo) =>
            veiculo.nome
        )
        .join(", ");

    falarEExecutar(
      `Aluguel de veículos. Escolha um veículo de acordo com suas necessidades de acessibilidade. Os veículos disponíveis são: ${nomesVeiculos}. Diga o nome do veículo que deseja conhecer.`,
      ouvirVeiculo
    );
  }


  // ========================================
  // OUVIR VEÍCULO
  // ========================================

  function ouvirVeiculo() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "voltar"
          ) ||
          comando.includes(
            "início"
          ) ||
          comando.includes(
            "inicio"
          )
        ) {
          navigate(
            "/home"
          );

          return;
        }

        const veiculoEncontrado =
          encontrarVeiculoPorVoz(
            comando
          );

        if (
          veiculoEncontrado
        ) {
          falarEExecutar(
            `${veiculoEncontrado.nome} selecionado. Abrindo os detalhes do veículo.`,
            () =>
              selecionarVeiculo(
                veiculoEncontrado,
                true
              )
          );

          return;
        }

        falarEExecutar(
          "Não encontrei esse veículo. Diga novamente o nome de um dos veículos disponíveis.",
          ouvirVeiculo
        );
      }
    );
  }


  // ========================================
  // ENCONTRAR VEÍCULO
  // ========================================

  function encontrarVeiculoPorVoz(
    comando
  ) {
    const comandoNormalizado =
      normalizarTexto(
        comando
      );

    return veiculos.find(
      (veiculo) => {
        const nome =
          normalizarTexto(
            veiculo.nome
          );

        const tipo =
          normalizarTexto(
            veiculo.tipo
          );

        if (
          comandoNormalizado.includes(
            nome
          )
        ) {
          return true;
        }

        if (
          comandoNormalizado.includes(
            tipo
          )
        ) {
          return true;
        }

        const palavrasNome =
          nome.split(" ");

        return palavrasNome.some(
          (palavra) =>
            palavra.length > 3 &&
            comandoNormalizado.includes(
              palavra
            )
        );
      }
    );
  }


  // ========================================
  // NORMALIZAR TEXTO
  // ========================================

  function normalizarTexto(
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
  // SELECIONAR VEÍCULO
  // ========================================

  function selecionarVeiculo(
    veiculo,
    porVoz = false
  ) {
    if (
      porVoz
    ) {
      sessionStorage.setItem(
        "continuarDetalhesAluguelPorVoz",
        "true"
      );
    }

    navigate(
      `/aluguel/${veiculo.id}`
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


  return (
    <main className="rental-page">

      <header className="rental-header">

        <button
          type="button"
          className="rental-back"
          onClick={() =>
            navigate("/home")
          }
          aria-label="Voltar para o início"
        >
          ←
        </button>

        <div>

          <span>
            ACESSÍVEL JÁ
          </span>

          <h1>
            Alugar veículo
          </h1>

          <p>
            Mais autonomia para
            chegar onde quiser.
          </p>

        </div>

      </header>

      <section className="rental-intro">

        <div className="rental-intro-icon">
          ♿
        </div>

        <div>

          <span>
            MOBILIDADE
          </span>

          <h2>
            Escolha o veículo ideal
          </h2>

          <p>
            Compare as adaptações
            disponíveis e escolha a
            opção mais adequada para
            sua viagem.
          </p>

        </div>

      </section>

      <section className="rental-vehicles">

        <div className="rental-section-title">

          <span>
            VEÍCULOS
          </span>

          <h2>
            Disponíveis para aluguel
          </h2>

        </div>

        <div className="rental-list">

          {veiculos.map((veiculo) => (

            <button
              key={veiculo.id}
              type="button"
              className={
                veiculo.recomendado
                  ? "rental-card rental-card-featured"
                  : "rental-card"
              }
              onClick={() =>
                selecionarVeiculo(
                  veiculo
                )
              }
            >

              {veiculo.destaque && (
                <div className="rental-badge">
                  RECOMENDADO
                </div>
              )}

              <div className="rental-card-top">

                <div className="rental-car-icon">

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

                <div className="rental-card-heading">

                  <span>
                    {veiculo.tipo}
                  </span>

                  <strong>
                    {veiculo.nome}
                  </strong>

                </div>

                <div className="rental-card-arrow">
                  →
                </div>

              </div>

              <p className="rental-description">
                {veiculo.descricao}
              </p>

              <div className="rental-features">

                {veiculo.recursos.map(
                  (recurso) => (
                    <span key={recurso}>
                      ✓ {recurso}
                    </span>
                  )
                )}

              </div>

              <div className="rental-card-footer">

                <span>
                  A partir de
                </span>

                <div>

                  <strong>
                    {veiculo.valor}
                  </strong>

                  <small>
                    {veiculo.periodo}
                  </small>

                </div>

              </div>

            </button>

          ))}

        </div>

      </section>


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

export default VehicleRental;