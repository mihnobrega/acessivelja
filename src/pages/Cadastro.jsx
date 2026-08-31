import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../css/cadastro.css";
import logo from "../assets/logo.png";

function Cadastro() {
  const navigate = useNavigate();

  const [
    nome,
    setNome
  ] = useState("");

  const [
    email,
    setEmail
  ] = useState("");

  const [
    senha,
    setSenha
  ] = useState("");

  const [
  mostrarSenha,
  setMostrarSenha
] = useState(false);

  const [
    necessidades,
    setNecessidades
  ] = useState([]);

  const [
    outraNecessidade,
    setOutraNecessidade
  ] = useState("");

  const [
    fotoPerfil,
    setFotoPerfil
  ] = useState("");


  // ========================================
  // OPÇÕES DE ACESSIBILIDADE
  // ========================================

  const opcoesAcessibilidade = [
    "Mobilidade reduzida",
    "Usuário de cadeira de rodas",
    "Deficiência visual",
    "Baixa visão",
    "Deficiência auditiva",
    "Pessoa surda",
    "Deficiência intelectual",
    "Neurodivergência",
    "Outra necessidade",
    "Não preciso de recursos de acessibilidade",
  ];


  // ========================================
  // SELECIONAR FOTO
  // ========================================

  function selecionarFoto(evento) {
    const arquivo =
      evento.target.files[0];

    if (!arquivo) {
      return;
    }

    const leitor =
      new FileReader();

    leitor.onloadend = () => {
      setFotoPerfil(
        leitor.result
      );
    };

    leitor.readAsDataURL(
      arquivo
    );
  }


  // ========================================
  // SELECIONAR NECESSIDADES
  // ========================================

  function alterarNecessidade(opcao) {
    if (
      necessidades.includes(opcao)
    ) {
      setNecessidades(
        necessidades.filter(
          (item) =>
            item !== opcao
        )
      );

      return;
    }

    setNecessidades([
      ...necessidades,
      opcao,
    ]);
  }


  // ========================================
  // CADASTRAR USUÁRIO
  // ========================================

  function cadastrarUsuario(evento) {
    evento.preventDefault();

    const usuario = {
      nome,
      email: email.trim(),
      senha,
      necessidades,
      outraNecessidade,
      fotoPerfil,
    };

    localStorage.setItem(
  "acessivelJaUsuario",
  JSON.stringify(usuario)
);

localStorage.setItem(
  "acessivelJaLogado",
  "true"
);

navigate("/home");
}

  return (
    <main className="cadastro-page">

      {/* ========================================
          DECORAÇÕES
      ======================================== */}

      <div
        className="
          cadastro-decoration
          cadastro-decoration-one
        "
      ></div>

      <div
        className="
          cadastro-decoration
          cadastro-decoration-two
        "
      ></div>


      {/* ========================================
          VOLTAR
      ======================================== */}

      <button
        className="cadastro-back"
        onClick={() =>
          navigate("/")
        }
        type="button"
        aria-label="Voltar"
      >
        ←
      </button>


      {/* ========================================
          IDENTIDADE / LOGO
      ======================================== */}

      <section className="cadastro-brand">

        <div className="cadastro-logo-box">

          <img
            src={logo}
            alt="Logo Acessível Já"
          />

        </div>

        <span>
          ACESSÍVEL JÁ
        </span>

        <h1>
          Crie sua conta
        </h1>

        <p>
          Vamos personalizar sua experiência
          de acordo com o que você precisa.
        </p>

      </section>


      {/* ========================================
          CARD PRINCIPAL
      ======================================== */}

      <section className="cadastro-card">

        <div className="cadastro-card-header">

          <span>
            SEUS DADOS
          </span>

          <h2>
            Conte um pouco sobre você
          </h2>

          <p>
            Essas informações ajudam o
            Acessível Já a oferecer uma
            experiência mais adequada.
          </p>

        </div>


        {/* ========================================
            FORMULÁRIO
        ======================================== */}

        <form
          className="cadastro-form"
          onSubmit={cadastrarUsuario}
        >

          {/* ========================================
              NOME
          ======================================== */}

          <div className="form-group">

            <label htmlFor="nome">
              Nome
            </label>

            <div className="cadastro-input">

              <span
                aria-hidden="true"
              >
                👤
              </span>

              <input
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(evento) =>
                  setNome(
                    evento.target.value
                  )
                }
                required
              />

            </div>

          </div>


          {/* ========================================
              EMAIL
          ======================================== */}

          <div className="form-group">

            <label htmlFor="email">
              E-mail
            </label>

            <div className="cadastro-input">

              <span
                aria-hidden="true"
              >
                ✉
              </span>

              <input
                id="email"
                type="email"
                placeholder="seuemail@email.com"
                value={email}
                onChange={(evento) =>
                  setEmail(
                    evento.target.value
                  )
                }
                required
              />

            </div>

          </div>


          {/* ========================================
              SENHA
          ======================================== */}

         <div className="cadastro-input">

  <span
    aria-hidden="true"
  >
    🔒
  </span>

  <input
    id="senha"
    type={
      mostrarSenha
        ? "text"
        : "password"
    }
    placeholder="Crie uma senha"
    value={senha}
    onChange={(evento) =>
      setSenha(
        evento.target.value
      )
    }
    required
  />

  <button
    type="button"
    className="cadastro-show-password"
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

          {/* ========================================
              DIVISÓRIA - FOTO
          ======================================== */}

          <div className="cadastro-section-divider">

            <span>
              FOTO DE PERFIL
            </span>

          </div>


          {/* ========================================
              FOTO DE PERFIL
          ======================================== */}

          <div className="cadastro-foto">

            <div className="cadastro-foto-area">

              <div className="cadastro-foto-preview">

                {fotoPerfil ? (

                  <img
                    src={fotoPerfil}
                    alt="Prévia da foto de perfil"
                  />

                ) : (

                  <span
                    aria-hidden="true"
                  >
                    👤
                  </span>

                )}

              </div>


              <div className="cadastro-foto-info">

                <strong>
                  Adicione sua foto
                </strong>

                <span>
                  Escolha uma imagem para
                  o seu perfil.
                </span>

                <label
                  htmlFor="fotoPerfil"
                  className="cadastro-foto-button"
                >
                  Escolher foto
                </label>

                <input
                  id="fotoPerfil"
                  type="file"
                  accept="image/*"
                  onChange={selecionarFoto}
                />

              </div>

            </div>

          </div>


          {/* ========================================
              DIVISÓRIA - ACESSIBILIDADE
          ======================================== */}

          <div className="cadastro-section-divider">

            <span>
              ACESSIBILIDADE
            </span>

          </div>


          {/* ========================================
              RECURSOS DE ACESSIBILIDADE
          ======================================== */}

          <fieldset className="accessibility-options">

            <legend>
              Quais recursos de acessibilidade
              você precisa?
            </legend>

            <p className="accessibility-help">
              Você pode selecionar mais de
              uma opção.
            </p>


            <div className="options-grid">

              {opcoesAcessibilidade.map(
                (opcao) => (

                  <label
                    className="accessibility-option"
                    key={opcao}
                  >

                    <input
                      type="checkbox"
                      checked={
                        necessidades.includes(
                          opcao
                        )
                      }
                      onChange={() =>
                        alterarNecessidade(
                          opcao
                        )
                      }
                    />

                    <span>
                      {opcao}
                    </span>

                  </label>

                )
              )}

            </div>

          </fieldset>


          {/* ========================================
              OUTRA NECESSIDADE
          ======================================== */}

          {necessidades.includes(
            "Outra necessidade"
          ) && (

            <div className="form-group other-need">

              <label htmlFor="outraNecessidade">
                Conte como podemos tornar sua
                experiência mais acessível
              </label>

              <textarea
                id="outraNecessidade"
                placeholder="Descreva sua necessidade..."
                value={outraNecessidade}
                onChange={(evento) =>
                  setOutraNecessidade(
                    evento.target.value
                  )
                }
              />

            </div>

          )}


          {/* ========================================
              CRIAR CONTA
          ======================================== */}

          <button
            className="cadastro-button"
            type="submit"
          >

            <span>
              Criar minha conta
            </span>

            <span
              aria-hidden="true"
            >
              →
            </span>

          </button>

        </form>


        {/* ========================================
            JÁ TEM CONTA
        ======================================== */}

        <div className="cadastro-login">

          <p>
            Já possui uma conta?
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Entrar
          </button>

        </div>

      </section>

    </main>
  );
}

export default Cadastro;