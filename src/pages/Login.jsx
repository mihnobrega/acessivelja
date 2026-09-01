import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../css/login.css";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [
    email,
    setEmail
  ] = useState("");

  const [
    senha,
    setSenha
  ] = useState("");

  const [
    erro,
    setErro
  ] = useState("");

  const [
    mostrarSenha,
    setMostrarSenha
  ] = useState(false);

  const [
    ouvindoEmail,
    setOuvindoEmail
  ] = useState(false);


  // ========================================
  // INICIAR LOGIN POR VOZ
  // ========================================

  useEffect(() => {
    const iniciarPorVoz =
      sessionStorage.getItem(
        "iniciarLoginPorVoz"
      );

    console.log(
      "Login por voz:",
      iniciarPorVoz
    );

    if (
      iniciarPorVoz !== "true"
    ) {
      return;
    }

    const temporizador =
      setTimeout(() => {

        sessionStorage.removeItem(
          "iniciarLoginPorVoz"
        );

        console.log(
          "Iniciando login por voz"
        );

        falarInstrucaoLogin();

      }, 800);

    return () => {
      clearTimeout(
        temporizador
      );
    };
  }, []);


  // ========================================
  // FALAR INSTRUÇÃO
  // ========================================

  function falarInstrucaoLogin() {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      preencherEmailPorVoz();
      return;
    }

    window.speechSynthesis.cancel();

    const fala =
      new SpeechSynthesisUtterance(
        "Você está na tela de login. Diga o seu e-mail."
      );

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;
    fala.volume = 1;

    fala.onend = () => {
      preencherEmailPorVoz();
    };

    window.speechSynthesis.speak(
      fala
    );
  }


  // ========================================
  // PREENCHER EMAIL POR VOZ
  // ========================================

  function preencherEmailPorVoz() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
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
        setOuvindoEmail(
          true
        );
      };

    reconhecimento.onend =
      () => {
        setOuvindoEmail(
          false
        );
      };

    reconhecimento.onerror =
      (erroVoz) => {
        console.error(
          "Erro no reconhecimento de voz:",
          erroVoz
        );

        setOuvindoEmail(
          false
        );
      };

    reconhecimento.onresult =
      (evento) => {
        let texto =
          evento.results[0][0]
            .transcript
            .toLowerCase();

        texto = texto
          .replace(
            /\s+arroba\s+/g,
            "@"
          )
          .replace(
            /\s+ponto\s+/g,
            "."
          )
          .replace(
            /\s/g,
            ""
          );

        setEmail(
          texto
        );

        falarSenha();
      };

    reconhecimento.start();
  }


  // ========================================
  // AVISAR SOBRE A SENHA
  // ========================================

  function falarSenha() {
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
        "E-mail preenchido. Agora digite sua senha e pressione entrar."
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
  // LOGIN
  // ========================================

  function fazerLogin(
    evento
  ) {
    evento.preventDefault();

    setErro("");

    const dadosSalvos =
      localStorage.getItem(
        "acessivelJaUsuario"
      );

    if (!dadosSalvos) {
      setErro(
        "Nenhuma conta foi encontrada. Crie uma conta primeiro."
      );

      return;
    }

    try {
      const usuario =
        JSON.parse(
          dadosSalvos
        );

      const emailCorreto =
        usuario.email ===
        email.trim();

      const senhaCorreta =
        usuario.senha ===
        senha;

      if (
        emailCorreto &&
        senhaCorreta
      ) {
        localStorage.setItem(
          "acessivelJaLogado",
          "true"
        );

        // Continua o assistente
        // de voz na Home.
        sessionStorage.setItem(
          "continuarHomePorVoz",
          "true"
        );

        navigate(
          "/home"
        );

        return;
      }

      setErro(
        "Email ou senha incorretos."
      );

    } catch (
      erroLogin
    ) {
      console.error(
        "Erro ao carregar usuário:",
        erroLogin
      );

      setErro(
        "Não foi possível acessar sua conta."
      );
    }
  }


  return (
    <main className="login-page">

      <div className="login-decoration login-decoration-one"></div>

      <div className="login-decoration login-decoration-two"></div>


      {/* VOLTAR */}

      <button
        type="button"
        className="login-back"
        onClick={() =>
          navigate("/")
        }
        aria-label="Voltar"
      >
        ←
      </button>


      {/* LOGO */}

      <section className="login-brand">

        <div className="login-logo-box">

          <img
            src={logo}
            alt="Logo Acessível Já"
          />

        </div>

        <h1>
          Acessível Já
        </h1>

        <p>
          Mobilidade pensada para todos.
        </p>

      </section>


      {/* CARD */}

      <section className="login-card">

        <div className="login-card-header">

          <span>
            BEM-VINDO DE VOLTA
          </span>

          <h2>
            Entre na sua conta
          </h2>

          <p>
            Use seus dados cadastrados para continuar.
          </p>

        </div>


        {/* FORMULÁRIO */}

        <form
          className="login-form"
          onSubmit={
            fazerLogin
          }
        >


          {/* EMAIL */}

          <label className="login-field">

            <span>
              Email
            </span>

            <div className="login-input">

              <span
                className="login-input-icon"
                aria-hidden="true"
              >
                ✉
              </span>

              <input
                type="email"
                value={email}
                placeholder="seuemail@email.com"
                onChange={(evento) =>
                  setEmail(
                    evento.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className={
                  ouvindoEmail
                    ? "login-voice-field listening"
                    : "login-voice-field"
                }
                onClick={
                  preencherEmailPorVoz
                }
                aria-label={
                  ouvindoEmail
                    ? "Ouvindo email"
                    : "Preencher email por voz"
                }
              >
                {ouvindoEmail
                  ? "●"
                  : "◉"}
              </button>

            </div>

          </label>


          {/* SENHA */}

          <label className="login-field">

            <span>
              Senha
            </span>

            <div className="login-input">

              <span
                className="login-input-icon"
                aria-hidden="true"
              >
                🔒
              </span>

              <input
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                value={senha}
                placeholder="Digite sua senha"
                onChange={(evento) =>
                  setSenha(
                    evento.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="login-show-password"
                onClick={() =>
                  setMostrarSenha(
                    !mostrarSenha
                  )
                }
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {mostrarSenha
                  ? "🙈"
                  : "👁"}
              </button>

            </div>

          </label>


          {/* ERRO */}

          {erro && (
            <div
              className="login-error"
              role="alert"
            >

              <span>
                !
              </span>

              <p>
                {erro}
              </p>

            </div>
          )}


          {/* ENTRAR */}

          <button
            type="submit"
            className="login-button"
          >

            <span>
              Entrar
            </span>

            <span>
              →
            </span>

          </button>

        </form>


        {/* DIVISÓRIA */}

        <div className="login-divider">

          <span></span>

          <p>
            ou
          </p>

          <span></span>

        </div>


        {/* CADASTRO */}

        <div className="login-register">

          <p>
            Ainda não possui uma conta?
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/cadastro"
              )
            }
          >
            Criar uma conta
          </button>

        </div>

      </section>


      <p className="login-footer">
        Acessibilidade, autonomia e mobilidade.
      </p>

    </main>
  );
}

export default Login;