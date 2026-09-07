import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  obterUsuario
} from "../../utils/usuario";

import "../../css/driver-dashboard.css";

function DriverDashboard() {
  const navigate = useNavigate();

  const usuario =
    obterUsuario();

  const motorista =
    usuario?.motorista;

  const [
    online,
    setOnline
  ] = useState(
    Boolean(
      motorista?.disponivel
    )
  );

  const [
    procurandoCorrida,
    setProcurandoCorrida
  ] = useState(false);

  const [
    corridaDisponivel,
    setCorridaDisponivel
  ] = useState(null);


  // ========================================
  // CORRIDA SIMULADA
  // ========================================

  const corridaSimulada = {
    passageiro: "Mariana Costa",
    avaliacao: "4,9",
    embarque: "Rua Coronel Diogo, 120",
    destino: "Shopping Central",
    distancia: "6,4 km",
    duracao: "14 min",
    valor: "R$ 24,90",
    acessibilidade: "Espaço para cadeira de rodas"
  };


  // ========================================
  // PROCURAR CORRIDA
  // ========================================

  useEffect(() => {
    if (
      !online ||
      corridaDisponivel
    ) {
      setProcurandoCorrida(
        false
      );

      return;
    }

    setProcurandoCorrida(
      true
    );

    const temporizador =
      setTimeout(() => {
        setCorridaDisponivel(
          corridaSimulada
        );

        setProcurandoCorrida(
          false
        );
      }, 4000);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, [
    online,
    corridaDisponivel
  ]);


  // ========================================
  // ALTERAR DISPONIBILIDADE
  // ========================================

  function alterarDisponibilidade() {
    const novoEstado =
      !online;

    setOnline(
      novoEstado
    );

    if (!novoEstado) {
      setCorridaDisponivel(
        null
      );

      setProcurandoCorrida(
        false
      );
    }

    const usuarioAtualizado = {
      ...usuario,

      motorista: {
        ...motorista,
        disponivel: novoEstado
      }
    };

    localStorage.setItem(
      "acessivelJaUsuario",
      JSON.stringify(
        usuarioAtualizado
      )
    );
  }


  // ========================================
  // ACEITAR CORRIDA
  // ========================================

  function aceitarCorrida() {
  if (!corridaDisponivel) {
    return;
  }

  function salvarCorrida(
    latitude,
    longitude
  ) {
    const corridaCompleta = {
      ...corridaDisponivel,

      motoristaPosicao: {
        latitude,
        longitude
      },

      passageiroPosicao: {
        latitude:
          latitude + 0.006,
        longitude:
          longitude - 0.004
      },

      destinoPosicao: {
        latitude:
          latitude + 0.013,
        longitude:
          longitude + 0.009
      }
    };

    sessionStorage.setItem(
      "corridaMotoristaAtual",
      JSON.stringify(
        corridaCompleta
      )
    );

    navigate(
      "/motorista/corrida"
    );
  }


  // GPS REAL DO MOTORISTA

  if (
    "geolocation" in
    navigator
  ) {
    navigator.geolocation.getCurrentPosition(
      (
        posicao
      ) => {
        salvarCorrida(
          posicao.coords.latitude,
          posicao.coords.longitude
        );
      },

      () => {
        /*
          Plano B para o protótipo,
          caso o GPS não seja permitido.
        */

        salvarCorrida(
          -23.5505,
          -46.6333
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );

    return;
  }


  salvarCorrida(
    -23.5505,
    -46.6333
  );
}


  // ========================================
  // RECUSAR CORRIDA
  // ========================================

  function recusarCorrida() {
    setCorridaDisponivel(
      null
    );

    setProcurandoCorrida(
      true
    );
  }


  // ========================================
  // SEM PERFIL DE MOTORISTA
  // ========================================

  if (!motorista) {
    return (
      <main className="driver-dashboard-page">

        <div className="driver-empty-profile">

          <h1>
            Perfil de motorista não encontrado
          </h1>

          <p>
            Faça seu cadastro como motorista
            para acessar esta área.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/home"
              )
            }
          >
            Voltar para o início
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="driver-dashboard-page">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="driver-dashboard-header">

        <button
          type="button"
          className="driver-back-button"
          onClick={() =>
            navigate(
              "/home"
            )
          }
          aria-label="Voltar para a página inicial"
        >
          ←
        </button>

        <div>

          <span className="driver-dashboard-label">
            ÁREA DO MOTORISTA
          </span>

          <h1>
            Olá, {
              usuario?.nome
                ?.split(" ")[0] ||
              "Motorista"
            }
          </h1>

          <p>
            Gerencie suas corridas e disponibilidade.
          </p>

        </div>

      </header>


      {/* ========================================
          DISPONIBILIDADE
      ======================================== */}

      <section
        className={
          online
            ? "driver-status-card online"
            : "driver-status-card"
        }
      >

        <div className="driver-status-info">

          <div
            className={
              online
                ? "driver-status-dot active"
                : "driver-status-dot"
            }
          ></div>

          <div>

            <span>
              SUA DISPONIBILIDADE
            </span>

            <h2>
              {online
                ? "Você está online"
                : "Você está offline"}
            </h2>

            <p>
              {online
                ? "Você já pode receber novas solicitações de corrida."
                : "Fique online para começar a receber solicitações."}
            </p>

          </div>

        </div>

        <button
          type="button"
          className={
            online
              ? "driver-online-button active"
              : "driver-online-button"
          }
          onClick={
            alterarDisponibilidade
          }
        >
          {online
            ? "Ficar offline"
            : "Ficar online"}
        </button>

      </section>


      {/* ========================================
          RESUMO
      ======================================== */}

      <section className="driver-dashboard-grid">

        <article className="driver-info-card">

          <span className="driver-info-label">
            VEÍCULO
          </span>

          <strong>
            {motorista.modeloVeiculo}
          </strong>

          <p>
            {motorista.corVeiculo}
            {" • "}
            {motorista.placa}
          </p>

        </article>


        <article className="driver-info-card">

          <span className="driver-info-label">
            AVALIAÇÃO
          </span>

          <strong>
            5,0 ★
          </strong>

          <p>
            Avaliação inicial
          </p>

        </article>


        <article className="driver-info-card">

          <span className="driver-info-label">
            CORRIDAS
          </span>

          <strong>
            {motorista.corridasRealizadas || 0}
          </strong>

          <p>
            Corridas realizadas
          </p>

        </article>


        <article className="driver-info-card">

          <span className="driver-info-label">
            GANHOS
          </span>

          <strong>
            R$ {
              Number(
                motorista.ganhosHoje || 0
              ).toFixed(2)
                .replace(
                  ".",
                  ","
                )
            }
          </strong>

          <p>
            Ganhos de hoje
          </p>

        </article>

      </section>


      {/* ========================================
          RECURSOS DE ACESSIBILIDADE
      ======================================== */}

      <section className="driver-accessibility-card">

        <div className="driver-section-heading">

          <span>
            ACESSIBILIDADE
          </span>

          <h2>
            Recursos do seu veículo
          </h2>

        </div>

        <div className="driver-accessibility-list">

          {motorista.adaptacoes?.map(
            (
              adaptacao
            ) => (
              <span
                key={
                  adaptacao
                }
                className="driver-accessibility-item"
              >
                ✓ {adaptacao}
              </span>
            )
          )}

        </div>

      </section>


      {/* ========================================
          SOLICITAÇÕES
      ======================================== */}

      <section className="driver-requests-section">

        <div className="driver-section-heading">

          <span>
            SOLICITAÇÕES
          </span>

          <h2>
            Novas corridas
          </h2>

        </div>


        {!online && (

          <div className="driver-empty-state">

            <div className="driver-empty-icon">
              ◉
            </div>

            <strong>
              Você está offline
            </strong>

            <p>
              Fique online para receber
              solicitações de corrida.
            </p>

          </div>

        )}


        {online &&
          procurandoCorrida &&
          !corridaDisponivel && (

          <div className="driver-empty-state">

            <div className="driver-search-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <strong>
              Procurando corridas...
            </strong>

            <p>
              Assim que uma solicitação estiver
              disponível, ela aparecerá aqui.
            </p>

          </div>

        )}


        {online &&
          corridaDisponivel && (

          <article className="driver-request-card">

            <div className="driver-request-top">

              <div>

                <span className="driver-request-label">
                  NOVA SOLICITAÇÃO
                </span>

                <h3>
                  {corridaDisponivel.passageiro}
                </h3>

                <p>
                  ★ {corridaDisponivel.avaliacao}
                </p>

              </div>

              <strong className="driver-request-price">
                {corridaDisponivel.valor}
              </strong>

            </div>


            <div className="driver-request-route">

              <div className="driver-route-item">

                <span className="driver-route-marker">
                  A
                </span>

                <div>

                  <small>
                    EMBARQUE
                  </small>

                  <strong>
                    {corridaDisponivel.embarque}
                  </strong>

                </div>

              </div>


              <div className="driver-route-line"></div>


              <div className="driver-route-item">

                <span className="driver-route-marker">
                  B
                </span>

                <div>

                  <small>
                    DESTINO
                  </small>

                  <strong>
                    {corridaDisponivel.destino}
                  </strong>

                </div>

              </div>

            </div>


            <div className="driver-request-details">

              <span>
                {corridaDisponivel.distancia}
              </span>

              <span>
                {corridaDisponivel.duracao}
              </span>

            </div>


            <div className="driver-request-accessibility">

              <span>
                ACESSIBILIDADE
              </span>

              <strong>
                ♿ {corridaDisponivel.acessibilidade}
              </strong>

            </div>


            <div className="driver-request-actions">

              <button
                type="button"
                className="driver-reject-button"
                onClick={
                  recusarCorrida
                }
              >
                Recusar
              </button>

              <button
                type="button"
                className="driver-accept-button"
                onClick={
                  aceitarCorrida
                }
              >
                Aceitar corrida
              </button>

            </div>

          </article>

        )}

      </section>

    </main>
  );
}

export default DriverDashboard;