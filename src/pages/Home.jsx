import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  obterUsuario
} from "../utils/usuario";

import useAlertaSonoro from "../hooks/useAlertaSonoro";

function Home() {
  const navigate = useNavigate();

  // Indica se o microfone está ouvindo.
  const [
    ouvindo,
    setOuvindo
  ] = useState(false);

  // Indica se o assistente está ativado.
  const [
    assistenteAtivo,
    setAssistenteAtivo
  ] = useState(false);

  // Busca os dados do usuário salvo.
  const usuario =
    obterUsuario();

  // Pega somente o primeiro nome.
  const primeiroNome =
    usuario?.nome
      ? usuario.nome.split(" ")[0]
      : "Usuário";

  // Busca a foto do perfil.
  const fotoPerfil =
    usuario?.fotoPerfil || "";

  // ==================================================
  // ALERTA SONORO
  // ==================================================

  useAlertaSonoro(
    `Olá, ${primeiroNome}. Você está na página inicial do Acessível Já. Escolha um serviço para continuar.`
  );

  // ==================================================
  // CARREGA A PREFERÊNCIA DE VOZ
  // ==================================================

  useEffect(() => {
    const preferenciasSalvas =
      localStorage.getItem(
        "acessivelJaPreferencias"
      );

    // Se não tiver preferência salva, mantém desligado.
    if (!preferenciasSalvas) {
      return;
    }

    try {
      const preferencias =
        JSON.parse(
          preferenciasSalvas
        );

      // Usa a mesma opção dos alertas sonoros do perfil.
      setAssistenteAtivo(
        Boolean(
          preferencias.alertasSonoros
        )
      );

    } catch (erro) {
      console.error(
        "Erro ao carregar preferências:",
        erro
      );
    }
  }, []);

  // ==================================================
  // SALVA O ESTADO DO ASSISTENTE
  // ==================================================

  function salvarEstadoAssistente(
    ativo
  ) {
    const preferenciasSalvas =
      localStorage.getItem(
        "acessivelJaPreferencias"
      );

    let preferencias = {};

    // Recupera as preferências que já existem.
    if (preferenciasSalvas) {
      try {
        preferencias =
          JSON.parse(
            preferenciasSalvas
          );
      } catch (erro) {
        console.error(
          "Erro ao carregar preferências:",
          erro
        );
      }
    }

    // Mantém as outras preferências e altera apenas a voz.
    const novasPreferencias = {
      ...preferencias,
      alertasSonoros: ativo
    };

    localStorage.setItem(
      "acessivelJaPreferencias",
      JSON.stringify(
        novasPreferencias
      )
    );

    // Avisa o restante do aplicativo sobre a alteração.
    window.dispatchEvent(
      new Event(
        "preferenciasAcessibilidadeAlteradas"
      )
    );
  }

  // ==================================================
  // DESATIVA O ASSISTENTE
  // ==================================================

  function desativarAssistente() {
    // Atualiza o botão.
    setAssistenteAtivo(false);

    // Salva a preferência.
    salvarEstadoAssistente(false);

    // Para qualquer fala que estiver acontecendo.
    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    // Também encerra o estado visual de escuta.
    setOuvindo(false);
  }

  // ==================================================
  // ATIVA O ASSISTENTE
  // ==================================================

  function ativarAssistenteVoz() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    // Verifica se o navegador aceita reconhecimento de voz.
    if (!SpeechRecognition) {
      alert(
        "O reconhecimento de voz não é suportado neste navegador."
      );

      return;
    }

    // Marca o assistente como ativado.
    setAssistenteAtivo(true);

    // Salva a preferência.
    salvarEstadoAssistente(true);

    // Cria o reconhecimento de voz.
    const reconhecimento =
      new SpeechRecognition();

    // Define o idioma.
    reconhecimento.lang = "pt-BR";

    // Escuta somente um comando por vez.
    reconhecimento.continuous = false;

    // Usa apenas o resultado final.
    reconhecimento.interimResults = false;

    // Quando começar a ouvir.
    reconhecimento.onstart = () => {
      setOuvindo(true);
    };

    // Quando parar de ouvir.
    reconhecimento.onend = () => {
      setOuvindo(false);
    };

    // Caso ocorra algum erro.
    reconhecimento.onerror = (
      erro
    ) => {
      console.error(
        "Erro no reconhecimento de voz:",
        erro
      );

      setOuvindo(false);
    };

    // Recebe aquilo que a pessoa falou.
    reconhecimento.onresult = (
      evento
    ) => {
      const comando =
        evento.results[0][0]
          .transcript
          .toLowerCase();

      // Abre a tela de corrida.
      if (
        comando.includes("corrida") ||
        comando.includes("pedir corrida")
      ) {
        navigate("/corrida");
        return;
      }

      // Abre o mapa acessível.
      if (
        comando.includes("mapa") ||
        comando.includes("lugar acessível") ||
        comando.includes("lugares acessíveis")
      ) {
        navigate(
          "/mapa-acessivel"
        );

        return;
      }

      // Abre a parte de aluguel.
      if (
        comando.includes("alugar") ||
        comando.includes("aluguel") ||
        comando.includes("veículo")
      ) {
        navigate(
          "/aluguel"
        );

        return;
      }

      // Abre o perfil.
      if (
        comando.includes("perfil") ||
        comando.includes("acessibilidade")
      ) {
        navigate(
          "/perfil"
        );

        return;
      }

      // Mostra mensagem se não entender.
      alert(
        `Não entendi o comando: "${comando}". Tente dizer "pedir corrida", "mapa acessível", "alugar veículo" ou "abrir perfil".`
      );
    };

    // Inicia o microfone.
    reconhecimento.start();
  }

  // ==================================================
  // BOTÃO ATIVAR / DESATIVAR
  // ==================================================

  function alternarAssistente() {
    if (assistenteAtivo) {
      desativarAssistente();
      return;
    }

    ativarAssistenteVoz();
  }

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
            {ouvindo
              ? "Estou ouvindo. Diga o que deseja fazer."
              : assistenteAtivo
                ? "Assistente por voz ativado."
                : "Use comandos de voz para navegar pelo aplicativo."}
          </p>

        </div>

        <button
          type="button"
          className="voice-button"
          onClick={
            alternarAssistente
          }
          aria-label={
            assistenteAtivo
              ? "Desativar assistente por voz"
              : "Ativar assistente por voz"
          }
        >
          {ouvindo
            ? "Ouvindo..."
            : assistenteAtivo
              ? "Desativar"
              : "Ativar"}
        </button>

      </section>

    </main>
  );
}

export default Home;