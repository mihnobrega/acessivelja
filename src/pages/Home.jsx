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

import DriverRegisterModal from "../components/DriverRegisterModal";

import "../css/driver-register-modal.css";

function Home() {
  const navigate = useNavigate();


  // ========================================
  // ESTADOS
  // ========================================

  const [
    ouvindo,
    setOuvindo
  ] = useState(false);

  const [
    assistenteAtivo,
    setAssistenteAtivo
  ] = useState(false);

  const [
    modalMotoristaAberto,
    setModalMotoristaAberto
  ] = useState(false);


  // ========================================
  // USUÁRIO
  // ========================================

  const usuario =
    obterUsuario();

  const primeiroNome =
    usuario?.nome
      ? usuario.nome.split(" ")[0]
      : "Usuário";

  const fotoPerfil =
    usuario?.fotoPerfil || "";

  const motoristaCadastrado =
    Boolean(
      usuario?.perfis?.motorista
    );


  // ========================================
  // CONTINUAR ASSISTENTE APÓS LOGIN
  // ========================================

  useEffect(() => {
    const continuarPorVoz =
      sessionStorage.getItem(
        "continuarHomePorVoz"
      );

    console.log(
      "Continuar voz na Home:",
      continuarPorVoz
    );

    if (
      continuarPorVoz !== "true"
    ) {
      return;
    }

    const temporizador =
      setTimeout(() => {

        sessionStorage.removeItem(
          "continuarHomePorVoz"
        );

        falarBoasVindas();

      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, []);


  // ========================================
  // BOAS-VINDAS APÓS LOGIN
  // ========================================

  function falarBoasVindas() {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      ativarAssistenteVoz();
      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        `Login realizado com sucesso. Olá, ${primeiroNome}. Você está na página inicial. O que deseja fazer? Você pode pedir uma corrida, abrir o mapa acessível, alugar um veículo ou acessar seu perfil.`
      );

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;
    fala.volume = 1;

    fala.onend = () => {
      setTimeout(() => {
        ativarAssistenteVoz();
      }, 350);
    };

    fala.onerror = (
      erro
    ) => {
      console.error(
        "Erro na fala da Home:",
        erro
      );
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ========================================
  // CARREGAR PREFERÊNCIA DE VOZ
  // ========================================

  useEffect(() => {
    const preferenciasSalvas =
      localStorage.getItem(
        "acessivelJaPreferencias"
      );

    if (!preferenciasSalvas) {
      return;
    }

    try {
      const preferencias =
        JSON.parse(
          preferenciasSalvas
        );

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


  // ========================================
  // SALVAR ESTADO DO ASSISTENTE
  // ========================================

  function salvarEstadoAssistente(
    ativo
  ) {
    const preferenciasSalvas =
      localStorage.getItem(
        "acessivelJaPreferencias"
      );

    let preferencias = {};

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

    window.dispatchEvent(
      new Event(
        "preferenciasAcessibilidadeAlteradas"
      )
    );
  }


  // ========================================
  // DESATIVAR ASSISTENTE
  // ========================================

  function desativarAssistente() {
    setAssistenteAtivo(
      false
    );

    salvarEstadoAssistente(
      false
    );

    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }

    setOuvindo(
      false
    );
  }


  // ========================================
  // ATIVAR ASSISTENTE
  // ========================================

  function ativarAssistenteVoz() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "O reconhecimento de voz não é suportado neste navegador."
      );

      return;
    }

    setAssistenteAtivo(
      true
    );

    salvarEstadoAssistente(
      true
    );

    const reconhecimento =
      new SpeechRecognition();

    reconhecimento.lang =
      "pt-BR";

    reconhecimento.continuous =
      false;

    reconhecimento.interimResults =
      false;


    // ========================================
    // COMEÇOU A OUVIR
    // ========================================

    reconhecimento.onstart =
      () => {
        setOuvindo(
          true
        );
      };


    // ========================================
    // PAROU DE OUVIR
    // ========================================

    reconhecimento.onend =
      () => {
        setOuvindo(
          false
        );
      };


    // ========================================
    // ERRO
    // ========================================

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


    // ========================================
    // COMANDO RECONHECIDO
    // ========================================

    reconhecimento.onresult =
      (evento) => {
        const comando =
          evento.results[0][0]
            .transcript
            .toLowerCase();

        console.log(
          "Comando na Home:",
          comando
        );


        // ========================================
        // PEDIR CORRIDA
        // ========================================

        if (
          comando.includes(
            "corrida"
          ) ||
          comando.includes(
            "pedir corrida"
          )
        ) {
          sessionStorage.setItem(
            "iniciarCorridaPorVoz",
            "true"
          );

          navigate(
            "/corrida"
          );

          return;
        }


        // ========================================
        // MAPA ACESSÍVEL
        // ========================================

        if (
          comando.includes(
            "mapa"
          ) ||
          comando.includes(
            "lugar acessível"
          ) ||
          comando.includes(
            "lugares acessíveis"
          )
        ) {
          navigate(
            "/mapa-acessivel"
          );

          return;
        }


        // ========================================
        // ALUGAR VEÍCULO
        // ========================================

        if (
          comando.includes(
            "alugar"
          ) ||
          comando.includes(
            "aluguel"
          ) ||
          comando.includes(
            "veículo"
          ) ||
          comando.includes(
            "veiculo"
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


        // ========================================
        // PERFIL
        // ========================================

        if (
          comando.includes(
            "perfil"
          ) ||
          comando.includes(
            "acessibilidade"
          )
        ) {
          navigate(
            "/perfil"
          );

          return;
        }


        // ========================================
        // NÃO ENTENDEU
        // ========================================

        falarNaoEntendi();
      };

    reconhecimento.start();
  }


  // ========================================
  // COMANDO NÃO ENTENDIDO
  // ========================================

  function falarNaoEntendi() {
  if (
    !(
      "speechSynthesis" in
      window
    )
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const fala =
    new SpeechSynthesisUtterance(
      "Não entendi o comando. Tente novamente quando quiser."
    );

  fala.lang = "pt-BR";
  fala.rate = 1;
  fala.pitch = 1;
  fala.volume = 1;

  window.speechSynthesis.speak(
    fala
  );
}


  // ========================================
  // ATIVAR / DESATIVAR
  // ========================================

  function alternarAssistente() {
    if (
      assistenteAtivo
    ) {
      desativarAssistente();
      return;
    }

    ativarAssistenteVoz();
  }


  // ========================================
  // FINALIZAR CADASTRO DE MOTORISTA
  // ========================================

  function finalizarCadastroMotorista(
    dadosMotorista
  ) {
    const usuarioAtual =
      obterUsuario();

    if (!usuarioAtual) {
      alert(
        "Não foi possível encontrar os dados da sua conta."
      );

      return;
    }

    const usuarioAtualizado = {
      ...usuarioAtual,

      perfis: {
        ...usuarioAtual.perfis,
        usuario: true,
        motorista: true
      },

      motorista: {
        ...dadosMotorista,
        ativo: false,
        disponivel: false,
        cadastradoEm:
          new Date().toISOString()
      }
    };

    localStorage.setItem(
      "acessivelJaUsuario",
      JSON.stringify(
        usuarioAtualizado
      )
    );

    setModalMotoristaAberto(
      false
    );
  }

  // ========================================
// PARAR VOZ AO SAIR DA HOME
// ========================================

useEffect(() => {
  return () => {
    if (
      "speechSynthesis" in
      window
    ) {
      window.speechSynthesis.cancel();
    }
  };
}, []);


  return (
    <main className="home-page">

      <div className="home-decoration home-decoration-one"></div>

      <div className="home-decoration home-decoration-two"></div>


      {/* ========================================
          CABEÇALHO
      ======================================== */}

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
            navigate(
              "/perfil"
            )
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


      {/* ========================================
          INTRODUÇÃO
      ======================================== */}

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


      {/* ========================================
          SERVIÇOS
      ======================================== */}

      <section
        className="services"
        aria-label="Serviços disponíveis"
      >


        {/* CORRIDA */}

        <button
          className="service-card service-primary"
          onClick={() =>
            navigate(
              "/corrida"
            )
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


        {/* MAPA */}

        <button
          className="service-card"
          onClick={() =>
            navigate(
              "/mapa-acessivel"
            )
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


        {/* ALUGUEL */}

        <button
          className="service-card"
          onClick={() =>
            navigate(
              "/aluguel"
            )
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


      {/* ========================================
          PARTICIPAR DA PLATAFORMA
      ======================================== */}

      <section className="provider-section">

        <div className="provider-shine provider-shine-one"></div>
        <div className="provider-shine provider-shine-two"></div>

        <div className="provider-header">

          <span className="provider-label">
            NOVAS POSSIBILIDADES
          </span>

          <h2>
            Faça parte da nossa rede
          </h2>

          <p>
            Dirija com o Acessível Já ou conecte
            sua empresa à nossa plataforma.
          </p>

        </div>


        <div className="provider-options">


          {/* MOTORISTA */}

          <button
            type="button"
            className={
              motoristaCadastrado
                ? "provider-card provider-card-active"
                : "provider-card"
            }
            onClick={() => {
              if (
                motoristaCadastrado
              ) {
                navigate(
                  "/motorista"
                );

                return;
              }

              setModalMotoristaAberto(
                true
              );
            }}
          >

            <div className="provider-card-top">

              <div className="provider-card-icon">
                🚘
              </div>

              <span className="provider-card-arrow">
                ↗
              </span>

            </div>

            <div className="provider-card-content">

              <span className="provider-card-type">
                MOTORISTA
              </span>

              <strong>
                {motoristaCadastrado
                  ? "Área do motorista"
                  : "Quero dirigir"}
              </strong>

              <p>
                {motoristaCadastrado
                  ? "Gerencie suas corridas e sua disponibilidade."
                  : "Cadastre seu perfil e veículo para dirigir pela plataforma."}
              </p>

            </div>

            <div className="provider-card-line"></div>

            {motoristaCadastrado && (
              <span className="provider-status">
                <span></span>
                Perfil cadastrado
              </span>
            )}

          </button>


          {/* EMPRESA */}

          <button
            type="button"
            className="provider-card"
            onClick={() =>
              navigate(
                "/empresa/cadastro"
              )
            }
          >

            <div className="provider-card-top">

              <div className="provider-card-icon">
                🏢
              </div>

              <span className="provider-card-arrow">
                ↗
              </span>

            </div>

            <div className="provider-card-content">

              <span className="provider-card-type">
                EMPRESA
              </span>

              <strong>
                Quero divulgar
              </strong>

              <p>
                Cadastre seu estabelecimento
                e destaque sua acessibilidade.
              </p>

            </div>

            <div className="provider-card-line"></div>

          </button>

        </div>

      </section>


      {/* ========================================
          ASSISTENTE POR VOZ
      ======================================== */}

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


      {/* ========================================
          MODAL MOTORISTA
      ======================================== */}

      <DriverRegisterModal
        aberto={
          modalMotoristaAberto
        }
        onClose={() =>
          setModalMotoristaAberto(
            false
          )
        }
        onFinalizar={
          finalizarCadastroMotorista
        }
      />

    </main>
  );
}

export default Home;