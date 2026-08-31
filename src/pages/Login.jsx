import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../css/login.css";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [erro, setErro] =
    useState("");

    const [
  mostrarSenha,
  setMostrarSenha
] = useState(false);

  function fazerLogin(evento) {
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

  navigate("/home");
  return;
}

      setErro(
        "Email ou senha incorretos."
      );

    } catch (erro) {
      console.error(
        "Erro ao carregar usuário:",
        erro
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

        <form
          className="login-form"
          onSubmit={fazerLogin}
        >

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

            </div>

          </label>

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

        <div className="login-divider">

          <span></span>

          <p>
            ou
          </p>

          <span></span>

        </div>

        <div className="login-register">

          <p>
            Ainda não possui uma conta?
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/cadastro")
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