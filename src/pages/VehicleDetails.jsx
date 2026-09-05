import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  buscarVeiculoPorId
} from "../data/vehicles";

function VehicleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const veiculo =
    buscarVeiculoPorId(id);

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);


  // ========================================
  // INICIAR FLUXO POR VOZ
  // ========================================

  useEffect(() => {
    const continuarPorVoz =
      sessionStorage.getItem(
        "continuarDetalhesAluguelPorVoz"
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
          "continuarDetalhesAluguelPorVoz"
        );

        falarDetalhesVeiculo();
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, [veiculo]);


  // ========================================
  // FALAR DETALHES DO VEÍCULO
  // ========================================

  function falarDetalhesVeiculo() {
    const recursos =
      veiculo.recursos
        .join(", ");

    falarEExecutar(
      `Você escolheu ${veiculo.nome}. ${veiculo.descricao}. As adaptações disponíveis são: ${recursos}. O valor do aluguel é ${veiculo.valor} ${veiculo.periodo}. O veículo é verificado, adaptado e possui suporte durante o período de aluguel. Deseja escolher o período? Diga continuar, escolher período ou voltar.`,
      ouvirComandoDetalhes
    );
  }


  // ========================================
  // OUVIR COMANDO
  // ========================================

  function ouvirComandoDetalhes() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "continuar"
          ) ||
          comando.includes(
            "escolher período"
          ) ||
          comando.includes(
            "escolher periodo"
          ) ||
          comando.includes(
            "período"
          ) ||
          comando.includes(
            "periodo"
          ) ||
          comando.includes(
            "sim"
          )
        ) {
          irParaPeriodo(
            true
          );

          return;
        }

        if (
          comando.includes(
            "voltar"
          ) ||
          comando.includes(
            "outro veículo"
          ) ||
          comando.includes(
            "outro veiculo"
          )
        ) {
          sessionStorage.setItem(
            "iniciarAluguelPorVoz",
            "true"
          );

          navigate(
            "/aluguel"
          );

          return;
        }

        if (
          comando.includes(
            "repetir"
          ) ||
          comando.includes(
            "detalhes"
          )
        ) {
          falarDetalhesVeiculo();

          return;
        }

        falarEExecutar(
          "Não entendi. Diga continuar, escolher período, repetir detalhes ou voltar.",
          ouvirComandoDetalhes
        );
      }
    );
  }


  // ========================================
  // IR PARA PERÍODO
  // ========================================

  function irParaPeriodo(
    porVoz = false
  ) {
    if (
      porVoz
    ) {
      sessionStorage.setItem(
        "continuarPeriodoAluguelPorVoz",
        "true"
      );
    }

    navigate(
      `/aluguel/${id}/periodo`,
      {
        state: {
          veiculo
        }
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
      <main className="vehicle-details-page">

        <section className="vehicle-details-empty">

          <span>
            🚙
          </span>

          <h1>
            Veículo não encontrado
          </h1>

          <p>
            Não foi possível carregar
            as informações deste veículo.
          </p>

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
    <main className="vehicle-details-page">

      <header className="vehicle-details-header">

        <button
          type="button"
          className="vehicle-details-back"
          onClick={() =>
            navigate(
              "/aluguel"
            )
          }
          aria-label="Voltar para veículos"
        >
          ←
        </button>

        <div>

          <span>
            VEÍCULO {id}
          </span>

          <h1>
            {veiculo.nome}
          </h1>

          <p>
            Conheça os detalhes
            deste veículo adaptado.
          </p>

        </div>

      </header>

      <section className="vehicle-details-hero">

        <div className="vehicle-details-photo">

          {veiculo.imagem ? (
            <img
              src={veiculo.imagem}
              alt={`Foto do ${veiculo.nome}`}
            />
          ) : (
            <span className="vehicle-details-photo-fallback">
              {veiculo.icone}
            </span>
          )}

        </div>

        <div className="vehicle-details-name">

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

      <section className="vehicle-details-section">

        <div className="vehicle-details-section-title">

          <span>
            ACESSIBILIDADE
          </span>

          <h2>
            Adaptações disponíveis
          </h2>

        </div>

        <div className="vehicle-details-features">

          {veiculo.recursos.map(
            (recurso) => (
              <div
                key={recurso}
                className="vehicle-details-feature"
              >

                <div>
                  ✓
                </div>

                <span>
                  {recurso}
                </span>

              </div>
            )
          )}

        </div>

      </section>

      <section className="vehicle-details-price">

        <div>

          <span>
            VALOR DO ALUGUEL
          </span>

          <strong>
            {veiculo.valor}
          </strong>

          <small>
            {veiculo.periodo}
          </small>

        </div>

      </section>

      <section className="vehicle-details-info">

        <div className="vehicle-details-info-item">

          <span>
            🛡️
          </span>

          <div>

            <strong>
              Veículo verificado
            </strong>

            <p>
              Revisado antes de cada locação.
            </p>

          </div>

        </div>

        <div className="vehicle-details-info-item">

          <span>
            ♿
          </span>

          <div>

            <strong>
              Adaptado
            </strong>

            <p>
              Preparado para oferecer mais autonomia.
            </p>

          </div>

        </div>

        <div className="vehicle-details-info-item">

          <span>
            📞
          </span>

          <div>

            <strong>
              Suporte
            </strong>

            <p>
              Atendimento durante o período de aluguel.
            </p>

          </div>

        </div>

      </section>

      <button
        type="button"
        className="vehicle-details-continue"
        onClick={() =>
          irParaPeriodo(
            false
          )
        }
      >
        Escolher período

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

export default VehicleDetails;