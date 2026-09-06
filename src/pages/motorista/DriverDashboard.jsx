import {
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


  // ========================================
  // ALTERAR DISPONIBILIDADE
  // ========================================

  function alterarDisponibilidade() {
    const novoEstado =
      !online;

    setOnline(
      novoEstado
    );

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
            0
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
            R$ 0,00
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


        {!online ? (

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

        ) : (

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

      </section>

    </main>
  );
}

export default DriverDashboard;