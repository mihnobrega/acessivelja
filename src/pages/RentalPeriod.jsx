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

function RentalPeriod() {
  const navigate = useNavigate();
  const { id } = useParams();

  const veiculo =
    buscarVeiculoPorId(id);

  const [
    dataRetirada,
    setDataRetirada
  ] = useState("");

  const [
    dataDevolucao,
    setDataDevolucao
  ] = useState("");

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
        "continuarPeriodoAluguelPorVoz"
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
          "continuarPeriodoAluguelPorVoz"
        );

        falarEExecutar(
          `Agora escolha o período de aluguel do veículo ${veiculo.nome}. Diga primeiro a data de retirada.`,
          ouvirDataRetirada
        );
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, [veiculo]);


  // ========================================
  // OUVIR DATA DE RETIRADA
  // ========================================

  function ouvirDataRetirada() {
    reconhecerVoz(
      (comando) => {
        const data =
          converterDataFalado(
            comando
          );

        if (!data) {
          falarEExecutar(
            "Não entendi a data de retirada. Diga, por exemplo, 10 de setembro.",
            ouvirDataRetirada
          );

          return;
        }

        if (
          data <
          obterHoje()
        ) {
          falarEExecutar(
            "Essa data já passou. Diga uma data de retirada a partir de hoje.",
            ouvirDataRetirada
          );

          return;
        }

        setDataRetirada(
          data
        );

        falarEExecutar(
          `Data de retirada definida para ${formatarDataFalada(data)}. Agora diga a data de devolução.`,
          () =>
            ouvirDataDevolucao(
              data
            )
        );
      }
    );
  }


  // ========================================
  // OUVIR DATA DE DEVOLUÇÃO
  // ========================================

  function ouvirDataDevolucao(
    retirada
  ) {
    reconhecerVoz(
      (comando) => {
        const data =
          converterDataFalado(
            comando
          );

        if (!data) {
          falarEExecutar(
            "Não entendi a data de devolução. Diga, por exemplo, 12 de setembro.",
            () =>
              ouvirDataDevolucao(
                retirada
              )
          );

          return;
        }

        if (
          data < retirada
        ) {
          falarEExecutar(
            "A data de devolução não pode ser anterior à retirada. Diga outra data.",
            () =>
              ouvirDataDevolucao(
                retirada
              )
          );

          return;
        }

        setDataDevolucao(
          data
        );

        const dias =
          calcularDiasComDatas(
            retirada,
            data
          );

        const diaria =
          obterValorDiaria();

        const total =
          dias *
          diaria;

        falarEExecutar(
          `Período definido. Retirada em ${formatarDataFalada(retirada)} e devolução em ${formatarDataFalada(data)}. O aluguel terá duração de ${dias} ${dias === 1 ? "dia" : "dias"} e o valor estimado será de ${formatarValorFalado(total)}. Diga continuar para ver o resumo, ou diga alterar datas.`,
          () =>
            ouvirConfirmacaoPeriodo(
              retirada,
              data
            )
        );
      }
    );
  }


  // ========================================
  // OUVIR CONFIRMAÇÃO
  // ========================================

  function ouvirConfirmacaoPeriodo(
    retirada,
    devolucao
  ) {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "continuar"
          ) ||
          comando.includes(
            "confirmar"
          ) ||
          comando.includes(
            "sim"
          ) ||
          comando.includes(
            "resumo"
          )
        ) {
          const dias =
            calcularDiasComDatas(
              retirada,
              devolucao
            );

          const diaria =
            obterValorDiaria();

          const total =
            dias *
            diaria;

          sessionStorage.setItem(
            "continuarResumoAluguelPorVoz",
            "true"
          );

          navigate(
            `/aluguel/${id}/resumo`,
            {
              state: {
                veiculo,
                dataRetirada:
                  retirada,
                dataDevolucao:
                  devolucao,
                quantidadeDias:
                  dias,
                valorDiaria:
                  diaria,
                valorTotal:
                  total,
              },
            }
          );

          return;
        }

        if (
          comando.includes(
            "alterar"
          ) ||
          comando.includes(
            "mudar"
          ) ||
          comando.includes(
            "datas"
          )
        ) {
          setDataRetirada(
            ""
          );

          setDataDevolucao(
            ""
          );

          falarEExecutar(
            "Certo. Diga novamente a data de retirada.",
            ouvirDataRetirada
          );

          return;
        }

        if (
          comando.includes(
            "voltar"
          )
        ) {
          sessionStorage.setItem(
            "continuarDetalhesAluguelPorVoz",
            "true"
          );

          navigate(
            `/aluguel/${id}`
          );

          return;
        }

        falarEExecutar(
          "Não entendi. Diga continuar, alterar datas ou voltar.",
          () =>
            ouvirConfirmacaoPeriodo(
              retirada,
              devolucao
            )
        );
      }
    );
  }


  // ========================================
  // VALOR DA DIÁRIA
  // ========================================

  function obterValorDiaria() {
    const valorNumerico =
      veiculo.valor
        .replace("R$", "")
        .replace(",", ".")
        .trim();

    return Number(
      valorNumerico
    );
  }


  // ========================================
  // CALCULAR DIAS
  // ========================================

  function calcularDiasComDatas(
    retiradaTexto,
    devolucaoTexto
  ) {
    const retirada =
      new Date(
        `${retiradaTexto}T12:00:00`
      );

    const devolucao =
      new Date(
        `${devolucaoTexto}T12:00:00`
      );

    const diferenca =
      devolucao - retirada;

    if (
      diferenca < 0
    ) {
      return 0;
    }

    const dias =
      Math.ceil(
        diferenca /
        (
          1000 *
          60 *
          60 *
          24
        )
      );

    return Math.max(
      1,
      dias
    );
  }


  function calcularDias() {
    if (
      !dataRetirada ||
      !dataDevolucao
    ) {
      return 0;
    }

    return calcularDiasComDatas(
      dataRetirada,
      dataDevolucao
    );
  }


  // ========================================
  // CONVERTER DATA FALADA
  // ========================================

  function converterDataFalado(
    texto
  ) {
    const normalizado =
      texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /dia /g,
          ""
        )
        .trim();

    const meses = {
      janeiro: 1,
      fevereiro: 2,
      marco: 3,
      abril: 4,
      maio: 5,
      junho: 6,
      julho: 7,
      agosto: 8,
      setembro: 9,
      outubro: 10,
      novembro: 11,
      dezembro: 12
    };

    const numeros = {
      um: 1,
      uma: 1,
      dois: 2,
      tres: 3,
      quatro: 4,
      cinco: 5,
      seis: 6,
      sete: 7,
      oito: 8,
      nove: 9,
      dez: 10,
      onze: 11,
      doze: 12,
      treze: 13,
      quatorze: 14,
      catorze: 14,
      quinze: 15,
      dezesseis: 16,
      dezessete: 17,
      dezoito: 18,
      dezenove: 19,
      vinte: 20,
      "vinte e um": 21,
      "vinte e dois": 22,
      "vinte e tres": 23,
      "vinte e quatro": 24,
      "vinte e cinco": 25,
      "vinte e seis": 26,
      "vinte e sete": 27,
      "vinte e oito": 28,
      "vinte e nove": 29,
      trinta: 30,
      "trinta e um": 31
    };

    const formatoNumerico =
      normalizado.match(
        /^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?$/
      );

    if (
      formatoNumerico
    ) {
      const dia =
        Number(
          formatoNumerico[1]
        );

      const mes =
        Number(
          formatoNumerico[2]
        );

      const ano =
        formatoNumerico[3]
          ? Number(
              formatoNumerico[3]
            )
          : new Date().getFullYear();

      return montarDataISO(
        dia,
        mes,
        ano
      );
    }

    for (
      const [
        nomeMes,
        numeroMes
      ] of Object.entries(
        meses
      )
    ) {
      if (
        normalizado.includes(
          nomeMes
        )
      ) {
        const parteDia =
          normalizado
            .replace(
              `de ${nomeMes}`,
              ""
            )
            .replace(
              nomeMes,
              ""
            )
            .trim();

        let dia =
          Number(
            parteDia
          );

        if (
          !dia
        ) {
          dia =
            numeros[
              parteDia
            ];
        }

        if (
          !dia
        ) {
          return null;
        }

        let ano =
          new Date()
            .getFullYear();

        const candidata =
          montarDataISO(
            dia,
            numeroMes,
            ano
          );

        if (
          candidata &&
          candidata <
            obterHoje()
        ) {
          ano += 1;
        }

        return montarDataISO(
          dia,
          numeroMes,
          ano
        );
      }
    }

    return null;
  }


  // ========================================
  // MONTAR DATA ISO
  // ========================================

  function montarDataISO(
    dia,
    mes,
    ano
  ) {
    const data =
      new Date(
        ano,
        mes - 1,
        dia
      );

    if (
      data.getFullYear() !==
        ano ||
      data.getMonth() !==
        mes - 1 ||
      data.getDate() !==
        dia
    ) {
      return null;
    }

    const mesTexto =
      String(
        mes
      ).padStart(
        2,
        "0"
      );

    const diaTexto =
      String(
        dia
      ).padStart(
        2,
        "0"
      );

    return `${ano}-${mesTexto}-${diaTexto}`;
  }


  // ========================================
  // FORMATAR DATA PARA FALA
  // ========================================

  function formatarDataFalada(
    data
  ) {
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
  // FORMATAR VALOR PARA FALA
  // ========================================

  function formatarValorFalado(
    valor
  ) {
    return valor.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
  }


  // ========================================
  // CONTINUAR MANUALMENTE
  // ========================================

  const quantidadeDias =
    calcularDias();

  const valorDiaria =
    obterValorDiaria();

  const valorTotal =
    quantidadeDias *
    valorDiaria;

  const periodoValido =
    dataRetirada &&
    dataDevolucao &&
    quantidadeDias > 0;


  function continuarReserva() {
    if (
      !periodoValido
    ) {
      return;
    }

    navigate(
      `/aluguel/${id}/resumo`,
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


  function obterHoje() {
    return new Date()
      .toISOString()
      .split("T")[0];
  }


  const hoje =
    obterHoje();


  if (!veiculo) {
    return (
      <main className="rental-period-page">

        <section className="rental-period-error">

          <h1>
            Veículo não encontrado
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
    <main className="rental-period-page">

      <header className="rental-period-header">

        <button
          type="button"
          className="rental-period-back"
          onClick={() =>
            navigate(
              `/aluguel/${id}`
            )
          }
          aria-label="Voltar"
        >
          ←
        </button>

        <div>

          <span>
            ALUGUEL
          </span>

          <h1>
            Escolha o período
          </h1>

          <p>
            Defina quando você deseja retirar
            e devolver o veículo.
          </p>

        </div>

      </header>

      <section className="rental-period-vehicle">

        <div className="rental-period-vehicle-image">

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

        <div className="rental-period-vehicle-info">

          <span>
            {veiculo.tipo}
          </span>

          <h2>
            {veiculo.nome}
          </h2>

          <div>

            <strong>
              {veiculo.valor}
            </strong>

            <small>
              {veiculo.periodo}
            </small>

          </div>

        </div>

      </section>

      <section className="rental-period-selection">

        <div className="rental-period-title">

          <span>
            PERÍODO DA RESERVA
          </span>

          <h2>
            Quando você precisa do veículo?
          </h2>

        </div>

        <div className="rental-date-fields">

          <label className="rental-date-field">

            <span>
              Data de retirada
            </span>

            <input
              type="date"
              value={
                dataRetirada
              }
              min={
                hoje
              }
              onChange={
                (
                  evento
                ) => {
                  setDataRetirada(
                    evento.target.value
                  );

                  if (
                    dataDevolucao &&
                    evento.target.value >
                      dataDevolucao
                  ) {
                    setDataDevolucao(
                      ""
                    );
                  }
                }
              }
            />

          </label>

          <label className="rental-date-field">

            <span>
              Data de devolução
            </span>

            <input
              type="date"
              value={
                dataDevolucao
              }
              min={
                dataRetirada ||
                hoje
              }
              disabled={
                !dataRetirada
              }
              onChange={
                (
                  evento
                ) =>
                  setDataDevolucao(
                    evento.target.value
                  )
              }
            />

          </label>

        </div>

      </section>

      {periodoValido && (
        <section className="rental-period-summary">

          <div className="rental-period-summary-title">

            <span>
              RESUMO
            </span>

            <h2>
              Seu período de aluguel
            </h2>

          </div>

          <div className="rental-period-summary-info">

            <div>

              <span>
                Diária
              </span>

              <strong>
                R$ {valorDiaria
                  .toFixed(2)
                  .replace(".", ",")}
              </strong>

            </div>

            <div>

              <span>
                Período
              </span>

              <strong>
                {quantidadeDias}{" "}
                {quantidadeDias ===
                1
                  ? "dia"
                  : "dias"}
              </strong>

            </div>

          </div>

          <div className="rental-period-total">

            <div>

              <span>
                Valor estimado
              </span>

              <small>
                {quantidadeDias}{" "}
                {quantidadeDias ===
                1
                  ? "diária"
                  : "diárias"}
              </small>

            </div>

            <strong>
              R$ {valorTotal
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </div>

        </section>
      )}

      <button
        type="button"
        className="rental-period-continue"
        disabled={
          !periodoValido
        }
        onClick={
          continuarReserva
        }
      >
        <span>
          Continuar
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

export default RentalPeriod;