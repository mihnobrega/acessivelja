import {
  useNavigate
} from "react-router-dom";

import {
  obterUsuario
} from "../utils/usuario";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function Home() {
  const navigate = useNavigate();

  const usuario =
    obterUsuario();

  const primeiroNome =
    usuario?.nome
      ? usuario.nome.split(" ")[0]
      : "Usuário";

  const fotoPerfil =
    usuario?.fotoPerfil || "";

  // ==================================================
  // ALERTA SONORO
  // ==================================================

  useAlertaSonoro(
    `Olá, ${primeiroNome}. Você está na página inicial do Acessível Já. Escolha um serviço para continuar.`
  );

  return (
    <main className="home-page">

      <div className="home-decoration home-decoration-one"></div>
      <div className="home-decoration home-decoration-two"></div>

      <header className="home-header">

        <div>
          <p className="home-greeting">
            Bem-vindo ao Acessível Já
          </p>

          <h1>
            Olá, {primeiroNome}!
          </h1>
        </div>

        <button
          type="button"
          className="profile-button"
          onClick={() =>
            navigate("/perfil")
          }
          aria-label="Abrir perfil"
        >
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt={`Foto de perfil de ${primeiroNome}`}
              className="home-profile-photo"
            />
          ) : (
            <span>
              {primeiroNome
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </button>

      </header>

      <section className="home-introduction">

        <p className="welcome-label">
          Sua mobilidade
        </p>

        <h2>
          Como podemos ajudar hoje?
        </h2>

        <p>
          Escolha um dos serviços para continuar.
        </p>

      </section>

      <section
        className="services"
        aria-label="Serviços disponíveis"
      >

        <button
          className="service-card service-primary"
          onClick={() =>
            navigate("/corrida")
          }
        >

          <div
            className="service-icon"
            aria-hidden="true"
          >
            🚗
          </div>

          <div className="service-text">

            <strong>
              Pedir corrida
            </strong>

            <span>
              Vá para onde quiser com segurança
              e acessibilidade.
            </span>

          </div>

          <span
            className="service-arrow"
            aria-hidden="true"
          >
            →
          </span>

        </button>

        <button
          className="service-card"
          onClick={() =>
            navigate("/mapa-acessivel")
          }
        >

          <div
            className="service-icon"
            aria-hidden="true"
          >
            📍
          </div>

          <div className="service-text">

            <strong>
              Mapa acessível
            </strong>

            <span>
              Encontre lugares com recursos
              de acessibilidade.
            </span>

          </div>

          <span
            className="service-arrow"
            aria-hidden="true"
          >
            →
          </span>

        </button>

        <button
          className="service-card"
          onClick={() =>
            navigate("/aluguel")
          }
        >

          <div
            className="service-icon"
            aria-hidden="true"
          >
            ♿
          </div>

          <div className="service-text">

            <strong>
              Alugar veículo
            </strong>

            <span>
              Conheça veículos adaptados para
              mais autonomia.
            </span>

          </div>

          <span
            className="service-arrow"
            aria-hidden="true"
          >
            →
          </span>

        </button>

      </section>

      <section className="voice-assistant-card">

        <div className="voice-icon">
          🎙️
        </div>

        <div>
          <strong>
            Assistente por voz
          </strong>

          <p>
            Use comandos de voz para navegar
            pelo aplicativo.
          </p>
        </div>

        <button
          className="voice-button"
          aria-label="Ativar assistente por voz"
        >
          Ativar
        </button>

      </section>

    </main>
  );
}

export default Home;