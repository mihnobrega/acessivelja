import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import AccessiblePlacesMap from "../components/AccessiblePlacesMap";


/* ========================================
   CALCULAR E FORMATAR DISTÂNCIA
======================================== */

function calcularDistancia(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const raioTerra = 6371;

  const paraRadianos = (graus) =>
    graus * (Math.PI / 180);

  const diferencaLatitude =
    paraRadianos(
      latitude2 - latitude1
    );

  const diferencaLongitude =
    paraRadianos(
      longitude2 - longitude1
    );

  const a =
    Math.sin(
      diferencaLatitude / 2
    ) ** 2 +
    Math.cos(
      paraRadianos(latitude1)
    ) *
      Math.cos(
        paraRadianos(latitude2)
      ) *
      Math.sin(
        diferencaLongitude / 2
      ) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return raioTerra * c;
}


function formatarDistancia(
  distanciaKm
) {
  if (
    distanciaKm < 1
  ) {
    return `${Math.round(
      distanciaKm * 1000
    )} m`;
  }

  return `${distanciaKm
    .toFixed(1)
    .replace(".", ",")} km`;
}


function AccessibleMap() {
  const navigate = useNavigate();

  const vozIniciadaRef =
    useRef(false);


  /* ========================================
     LOCALIZAÇÃO REAL DO USUÁRIO
  ======================================== */

  const [
    localizacao,
    setLocalizacao
  ] = useState(null);

  const [
    carregandoLocalizacao,
    setCarregandoLocalizacao
  ] = useState(true);

  const [
    erroLocalizacao,
    setErroLocalizacao
  ] = useState("");


  /* ========================================
     FILTRO SELECIONADO
  ======================================== */

  const [
    filtroSelecionado,
    setFiltroSelecionado
  ] = useState("todos");


  /* ========================================
     LOCAL SELECIONADO
  ======================================== */

  const [
    localSelecionado,
    setLocalSelecionado
  ] = useState(null);


  /* ========================================
     MICROFONE
  ======================================== */

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);


  /* ========================================
     ESTABELECIMENTOS DEMONSTRATIVOS
  ======================================== */

  const locaisBase = [
    {
      id: 1,
      nome: "Café Aurora",
      categoria: "Café",
      icone: "☕",
      recursos: [
        "mobilidade",
        "visual",
        "auditiva"
      ],
      acessibilidade: [
        "Entrada sem degraus",
        "Banheiro acessível",
        "Cardápio em braile",
        "Atendimento inclusivo"
      ],
      deslocamentoLatitude: 0.003,
      deslocamentoLongitude: -0.002
    },
    {
      id: 2,
      nome: "Shopping Horizonte",
      categoria: "Shopping",
      icone: "🛍️",
      recursos: [
        "mobilidade",
        "visual",
        "auditiva",
        "cognitiva"
      ],
      acessibilidade: [
        "Elevadores acessíveis",
        "Banheiros adaptados",
        "Vagas reservadas",
        "Piso tátil",
        "Sinalização acessível"
      ],
      deslocamentoLatitude: -0.005,
      deslocamentoLongitude: 0.004
    },
    {
      id: 3,
      nome: "Centro Cultural Harmonia",
      categoria: "Cultura",
      icone: "🎭",
      recursos: [
        "mobilidade",
        "auditiva"
      ],
      acessibilidade: [
        "Entrada acessível",
        "Espaços para cadeira de rodas",
        "Eventos com intérprete de Libras"
      ],
      deslocamentoLatitude: 0.007,
      deslocamentoLongitude: 0.006
    },
    {
      id: 4,
      nome: "Biblioteca Caminhos",
      categoria: "Biblioteca",
      icone: "📖",
      recursos: [
        "mobilidade",
        "visual",
        "cognitiva"
      ],
      acessibilidade: [
        "Piso tátil",
        "Livros em braile",
        "Audiolivros",
        "Espaço para cadeira de rodas",
        "Sinalização simplificada"
      ],
      deslocamentoLatitude: -0.003,
      deslocamentoLongitude: -0.006
    },
    {
      id: 5,
      nome: "Restaurante Sabor & Acesso",
      categoria: "Restaurante",
      icone: "🍴",
      recursos: [
        "mobilidade",
        "visual"
      ],
      acessibilidade: [
        "Entrada sem degraus",
        "Mesas acessíveis",
        "Cardápio em braile",
        "Banheiro adaptado"
      ],
      deslocamentoLatitude: 0.005,
      deslocamentoLongitude: -0.007
    },
    {
      id: 6,
      nome: "Farmácia Vida",
      categoria: "Farmácia",
      icone: "💊",
      recursos: [
        "mobilidade",
        "auditiva",
        "cognitiva"
      ],
      acessibilidade: [
        "Entrada acessível",
        "Balcão rebaixado",
        "Atendimento inclusivo",
        "Sinalização simplificada"
      ],
      deslocamentoLatitude: -0.007,
      deslocamentoLongitude: -0.002
    },
    {
      id: 7,
      nome: "Parque das Flores",
      categoria: "Lazer",
      icone: "🌳",
      recursos: [
        "mobilidade",
        "visual",
        "cognitiva"
      ],
      acessibilidade: [
        "Caminhos acessíveis",
        "Piso tátil",
        "Banheiro adaptado",
        "Sinalização de fácil compreensão"
      ],
      deslocamentoLatitude: 0.009,
      deslocamentoLongitude: 0.002
    },
    {
      id: 8,
      nome: "Centro de Saúde Bem-Estar",
      categoria: "Saúde",
      icone: "🏥",
      recursos: [
        "mobilidade",
        "visual",
        "auditiva",
        "cognitiva"
      ],
      acessibilidade: [
        "Rampa de acesso",
        "Banheiro adaptado",
        "Piso tátil",
        "Atendimento em Libras",
        "Sinalização acessível"
      ],
      deslocamentoLatitude: -0.009,
      deslocamentoLongitude: 0.007
    }
  ];


  /* ========================================
     CRIAR LOCAIS PRÓXIMOS AO USUÁRIO
  ======================================== */

  const locais =
    localizacao
      ? locaisBase.map(
          (local) => {
            const latitudeLocal =
              localizacao.latitude +
              local.deslocamentoLatitude;

            const longitudeLocal =
              localizacao.longitude +
              local.deslocamentoLongitude;

            const distanciaKm =
              calcularDistancia(
                localizacao.latitude,
                localizacao.longitude,
                latitudeLocal,
                longitudeLocal
              );

            return {
              ...local,
              latitude:
                latitudeLocal,
              longitude:
                longitudeLocal,
              distancia:
                formatarDistancia(
                  distanciaKm
                )
            };
          }
        )
      : [];


  /* ========================================
     PEGAR LOCALIZAÇÃO
  ======================================== */

  useEffect(() => {
    if (
      !navigator.geolocation
    ) {
      setErroLocalizacao(
        "Seu dispositivo não oferece suporte à localização."
      );

      setCarregandoLocalizacao(
        false
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setLocalizacao({
          latitude:
            posicao.coords.latitude,
          longitude:
            posicao.coords.longitude,
          precisao:
            posicao.coords.accuracy
        });

        setCarregandoLocalizacao(
          false
        );
      },

      (erro) => {
        console.error(
          "Erro de localização:",
          erro
        );

        setErroLocalizacao(
          "Não foi possível acessar sua localização."
        );

        setCarregandoLocalizacao(
          false
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }, []);


  /* ========================================
     FILTRAR OS LOCAIS
  ======================================== */

  const locaisFiltrados =
    filtroSelecionado === "todos"
      ? locais
      : locais.filter(
          (local) =>
            local.recursos.includes(
              filtroSelecionado
            )
        );


  /* ========================================
     INICIAR VOZ QUANDO O MAPA CARREGAR
  ======================================== */

  useEffect(() => {
    if (
      !localizacao ||
      vozIniciadaRef.current
    ) {
      return;
    }

    vozIniciadaRef.current =
      true;

    const temporizador =
      setTimeout(() => {
        falarIntroducaoMapa();
      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, [localizacao]);


  /* ========================================
     INTRODUÇÃO DO MAPA
  ======================================== */

  function falarIntroducaoMapa() {
    falarEExecutar(
      "Mapa acessível aberto. Encontrei lugares próximos com recursos de acessibilidade. Qual filtro deseja usar? Você pode dizer todos, mobilidade, visual, auditiva ou cognitiva.",
      ouvirFiltro
    );
  }


  /* ========================================
     OUVIR FILTRO
  ======================================== */

  function ouvirFiltro() {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "mobilidade"
          ) ||
          comando.includes(
            "cadeira"
          )
        ) {
          aplicarFiltroPorVoz(
            "mobilidade"
          );

          return;
        }

        if (
          comando.includes(
            "visual"
          ) ||
          comando.includes(
            "visão"
          ) ||
          comando.includes(
            "visao"
          )
        ) {
          aplicarFiltroPorVoz(
            "visual"
          );

          return;
        }

        if (
          comando.includes(
            "auditiva"
          ) ||
          comando.includes(
            "audição"
          ) ||
          comando.includes(
            "audicao"
          )
        ) {
          aplicarFiltroPorVoz(
            "auditiva"
          );

          return;
        }

        if (
          comando.includes(
            "cognitiva"
          )
        ) {
          aplicarFiltroPorVoz(
            "cognitiva"
          );

          return;
        }

        if (
          comando.includes(
            "todos"
          ) ||
          comando.includes(
            "todas"
          )
        ) {
          aplicarFiltroPorVoz(
            "todos"
          );

          return;
        }

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

        falarEExecutar(
          "Não entendi o filtro. Diga todos, mobilidade, visual, auditiva ou cognitiva.",
          ouvirFiltro
        );
      }
    );
  }


  /* ========================================
     APLICAR FILTRO POR VOZ
  ======================================== */

  function aplicarFiltroPorVoz(
    filtro
  ) {
    setFiltroSelecionado(
      filtro
    );

    const encontrados =
      filtro === "todos"
        ? locais
        : locais.filter(
            (local) =>
              local.recursos.includes(
                filtro
              )
          );

    anunciarLocais(
      encontrados,
      filtro
    );
  }


  /* ========================================
     ANUNCIAR LOCAIS
  ======================================== */

  function anunciarLocais(
    encontrados,
    filtro
  ) {
    if (
      encontrados.length === 0
    ) {
      falarEExecutar(
        "Não encontrei lugares com esse recurso. Diga outro filtro.",
        ouvirFiltro
      );

      return;
    }

    const nomes =
      encontrados
        .map(
          (local) =>
            local.nome
        )
        .join(", ");

    const nomeFiltro =
      filtro === "todos"
        ? "todos os tipos de acessibilidade"
        : `acessibilidade ${filtro}`;

    falarEExecutar(
      `Encontrei ${encontrados.length} lugares com ${nomeFiltro}. ${nomes}. Diga o nome de um lugar para ouvir os detalhes, diga outro filtro, ou diga voltar para o início.`,
      () =>
        ouvirEscolhaLocal(
          encontrados
        )
    );
  }


  /* ========================================
     OUVIR ESCOLHA DO LOCAL
  ======================================== */

  function ouvirEscolhaLocal(
    encontrados
  ) {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "outro filtro"
          ) ||
          comando.includes(
            "filtro"
          )
        ) {
          falarEExecutar(
            "Qual filtro deseja usar? Diga todos, mobilidade, visual, auditiva ou cognitiva.",
            ouvirFiltro
          );

          return;
        }

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

        const localEncontrado =
          encontrarLocalPorVoz(
            comando,
            encontrados
          );

        if (
          localEncontrado
        ) {
          abrirLocalPorVoz(
            localEncontrado
          );

          return;
        }

        falarEExecutar(
          "Não encontrei esse lugar. Diga novamente o nome de um dos locais, diga outro filtro ou diga voltar para o início.",
          () =>
            ouvirEscolhaLocal(
              encontrados
            )
        );
      }
    );
  }


  /* ========================================
     NORMALIZAR TEXTO
  ======================================== */

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
      .replace(
        /&/g,
        "e"
      )
      .trim();
  }


  /* ========================================
     ENCONTRAR LOCAL POR VOZ
  ======================================== */

  function encontrarLocalPorVoz(
    comando,
    encontrados
  ) {
    const comandoNormalizado =
      normalizarTexto(
        comando
      );

    return encontrados.find(
      (local) => {
        const nome =
          normalizarTexto(
            local.nome
          );

        const categoria =
          normalizarTexto(
            local.categoria
          );

        if (
          comandoNormalizado.includes(
            nome
          )
        ) {
          return true;
        }

        const palavrasNome =
          nome.split(" ");

        const palavrasEncontradas =
          palavrasNome.filter(
            (palavra) =>
              palavra.length > 3 &&
              comandoNormalizado.includes(
                palavra
              )
          );

        if (
          palavrasEncontradas.length >= 1
        ) {
          return true;
        }

        if (
          comandoNormalizado.includes(
            categoria
          )
        ) {
          return true;
        }

        return false;
      }
    );
  }


  /* ========================================
     ABRIR LOCAL POR VOZ
  ======================================== */

  function abrirLocalPorVoz(
    local
  ) {
    setLocalSelecionado(
      local
    );

    const recursos =
      local.acessibilidade
        .join(", ");

    falarEExecutar(
      `${local.nome}. Está a ${local.distancia} da sua localização. Recursos de acessibilidade: ${recursos}. Diga fechar para voltar aos lugares, outro filtro para escolher outro tipo de acessibilidade, ou voltar para o início.`,
      () =>
        ouvirComandoDetalhes(
          local
        )
    );
  }


  /* ========================================
     OUVIR COMANDO NOS DETALHES
  ======================================== */

  function ouvirComandoDetalhes(
    local
  ) {
    reconhecerVoz(
      (comando) => {
        if (
          comando.includes(
            "fechar"
          ) ||
          comando.includes(
            "voltar aos lugares"
          )
        ) {
          setLocalSelecionado(
            null
          );

          const encontrados =
            filtroSelecionado ===
            "todos"
              ? locais
              : locais.filter(
                  (item) =>
                    item.recursos.includes(
                      filtroSelecionado
                    )
                );

          falarEExecutar(
            "Detalhes fechados. Diga o nome de outro lugar, diga outro filtro ou diga voltar para o início.",
            () =>
              ouvirEscolhaLocal(
                encontrados
              )
          );

          return;
        }

        if (
          comando.includes(
            "outro filtro"
          ) ||
          comando.includes(
            "filtro"
          )
        ) {
          setLocalSelecionado(
            null
          );

          falarEExecutar(
            "Qual filtro deseja usar? Diga todos, mobilidade, visual, auditiva ou cognitiva.",
            ouvirFiltro
          );

          return;
        }

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

        if (
          comando.includes(
            "repetir"
          ) ||
          comando.includes(
            "recursos"
          )
        ) {
          abrirLocalPorVoz(
            local
          );

          return;
        }

        falarEExecutar(
          "Não entendi. Diga fechar, outro filtro, repetir recursos ou voltar para o início.",
          () =>
            ouvirComandoDetalhes(
              local
            )
        );
      }
    );
  }


  /* ========================================
     FALAR E DEPOIS EXECUTAR
  ======================================== */

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


  /* ========================================
     RECONHECER VOZ
  ======================================== */

  function reconhecerVoz(
    callback
  ) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (
      !SpeechRecognition
    ) {
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
    <main className="accessible-map-page">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="accessible-map-header">

        <button
          type="button"
          className="accessible-map-back"
          onClick={() =>
            navigate(
              "/home"
            )
          }
          aria-label="Voltar para o início"
        >
          ←
        </button>

        <div>

          <span>
            Acessível Já
          </span>

          <h1>
            Mapa Acessível
          </h1>

          <p>
            Encontre lugares com recursos
            de acessibilidade.
          </p>

        </div>

      </header>


      {/* ========================================
          LOCALIZAÇÃO
      ======================================== */}

      <section className="accessible-location-card">

        <div className="accessible-location-icon">
          ◎
        </div>

        <div>

          <span>
            Sua localização
          </span>

          {carregandoLocalizacao && (
            <strong>
              Localizando você...
            </strong>
          )}

          {!carregandoLocalizacao &&
            localizacao && (
              <>
                <strong>
                  Localização encontrada
                </strong>

                <small>
                  Precisão aproximada de{" "}
                  {Math.round(
                    localizacao.precisao
                  )} metros
                </small>
              </>
            )}

          {erroLocalizacao && (
            <strong>
              {erroLocalizacao}
            </strong>
          )}

        </div>

      </section>


      {/* ========================================
          FILTROS
      ======================================== */}

      <section className="accessible-filter-section">

        <div className="accessible-section-title">

          <span>
            Explorar
          </span>

          <h2>
            Filtrar acessibilidade
          </h2>

        </div>


        <div className="accessible-filters">

          <button
            type="button"
            className={
              filtroSelecionado ===
              "todos"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado(
                "todos"
              )
            }
          >
            Todos
          </button>


          <button
            type="button"
            className={
              filtroSelecionado ===
              "mobilidade"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado(
                "mobilidade"
              )
            }
          >
            ♿ Mobilidade
          </button>


          <button
            type="button"
            className={
              filtroSelecionado ===
              "visual"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado(
                "visual"
              )
            }
          >
            👁 Visual
          </button>


          <button
            type="button"
            className={
              filtroSelecionado ===
              "auditiva"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado(
                "auditiva"
              )
            }
          >
            🦻 Auditiva
          </button>


          <button
            type="button"
            className={
              filtroSelecionado ===
              "cognitiva"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado(
                "cognitiva"
              )
            }
          >
            Cognitiva
          </button>

        </div>

      </section>


      {/* ========================================
          ESPAÇO DO MAPA
      ======================================== */}

      <section className="accessible-map-container">

        {carregandoLocalizacao && (
          <div className="accessible-map-loading">

            <div className="map-loading-circle"></div>

            <strong>
              Preparando mapa acessível...
            </strong>

            <p>
              Aguarde enquanto acessamos
              sua localização.
            </p>

          </div>
        )}


        {!carregandoLocalizacao &&
          localizacao && (
            <AccessiblePlacesMap
              latitude={
                localizacao.latitude
              }
              longitude={
                localizacao.longitude
              }
              locais={
                locaisFiltrados
              }
              localSelecionado={
                localSelecionado
              }
              onSelecionarLocal={
                setLocalSelecionado
              }
            />
          )}


        {!carregandoLocalizacao &&
          erroLocalizacao && (
            <div className="accessible-map-loading">

              <strong>
                Não foi possível mostrar o mapa.
              </strong>

              <p>
                Verifique a permissão de localização.
              </p>

            </div>
          )}

      </section>


      {/* ========================================
          LUGARES
      ======================================== */}

      <section className="accessible-places-section">

        <div className="accessible-section-title">

          <span>
            Próximos de você
          </span>

          <h2>
            Lugares acessíveis
          </h2>

        </div>


        <div className="accessible-places-list">

          {locaisFiltrados.map(
            (local) => (
              <button
                key={
                  local.id
                }
                type="button"
                className="accessible-place-card"
                onClick={() =>
                  setLocalSelecionado(
                    local
                  )
                }
              >

                <div className="accessible-place-icon">
                  {local.icone}
                </div>

                <div className="accessible-place-content">

                  <span>
                    {local.categoria}
                  </span>

                  <strong>
                    {local.nome}
                  </strong>

                  <small>
                    {local.distancia}
                  </small>

                </div>

                <div className="accessible-place-arrow">
                  →
                </div>

              </button>
            )
          )}

        </div>

      </section>


      {/* ========================================
          DETALHES DO LOCAL
      ======================================== */}

      {localSelecionado && (
        <div className="accessible-place-overlay">

          <section className="accessible-place-modal">

            <button
              type="button"
              className="accessible-modal-close"
              onClick={() =>
                setLocalSelecionado(
                  null
                )
              }
              aria-label="Fechar detalhes"
            >
              ×
            </button>


            <div className="accessible-modal-icon">
              {localSelecionado.icone}
            </div>


            <span>
              {localSelecionado.categoria}
            </span>


            <h2>
              {localSelecionado.nome}
            </h2>


            <p>
              {localSelecionado.distancia}
              {" "}da sua localização
            </p>


            <div className="accessible-modal-divider">
            </div>


            <h3>
              Recursos de acessibilidade
            </h3>


            <div className="accessible-features">

              {localSelecionado
                .acessibilidade
                .map(
                  (recurso) => (
                    <div
                      key={
                        recurso
                      }
                      className="accessible-feature"
                    >
                      <span>
                        ✓
                      </span>

                      {recurso}
                    </div>
                  )
                )}

            </div>


            <small className="accessible-data-warning">
              Informações demonstrativas
              para o protótipo.
            </small>

          </section>

        </div>
      )}


      {/* ========================================
          INDICADOR DE VOZ
      ======================================== */}

      {ouvindo && (
        <p
          aria-live="polite"
          style={{
            textAlign: "center",
            marginTop: "12px",
            marginBottom: "20px"
          }}
        >
          🎙️ Ouvindo...
        </p>
      )}

    </main>
  );
}

export default AccessibleMap;