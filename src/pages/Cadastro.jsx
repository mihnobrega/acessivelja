import {
  useEffect,
  useRef,
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

  const senhaRef =
  useRef(null);

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

  const [
  ouvindoCadastro,
  setOuvindoCadastro
] = useState(false);


// ========================================
// INICIAR CADASTRO POR VOZ
// ========================================

useEffect(() => {
  const iniciarPorVoz =
    sessionStorage.getItem(
      "iniciarCadastroPorVoz"
    );

  console.log(
    "Cadastro por voz:",
    iniciarPorVoz
  );

  if (
    iniciarPorVoz !== "true"
  ) {
    return;
  }

  const temporizador =
    setTimeout(() => {

      // Só remove depois que realmente
      // chegou o momento de iniciar.
      sessionStorage.removeItem(
        "iniciarCadastroPorVoz"
      );

      console.log(
        "Iniciando cadastro por voz"
      );

      falarNome();

    }, 800);

  return () => {
    clearTimeout(
      temporizador
    );
  };
}, []);

// ========================================
// INICIAR ACESSIBILIDADE POR VOZ
// ========================================

function iniciarAcessibilidadePorVoz() {
  falarEExecutar(
    "Agora me diga qual recurso de acessibilidade você precisa.",
    ouvirAcessibilidade
  );
}


// ========================================
// OUVIR ACESSIBILIDADE
// ========================================

function ouvirAcessibilidade() {
  reconhecerVoz((texto) => {
    const comando =
      texto
        .toLowerCase()
        .trim();

    let opcaoEncontrada = "";

    if (
      comando.includes(
        "mobilidade reduzida"
      )
    ) {
      opcaoEncontrada =
        "Mobilidade reduzida";
    }

    else if (
      comando.includes(
        "cadeira de rodas"
      ) ||
      comando.includes(
        "cadeirante"
      )
    ) {
      opcaoEncontrada =
        "Usuário de cadeira de rodas";
    }

    else if (
      comando.includes(
        "deficiência visual"
      )
    ) {
      opcaoEncontrada =
        "Deficiência visual";
    }

    else if (
      comando.includes(
        "baixa visão"
      )
    ) {
      opcaoEncontrada =
        "Baixa visão";
    }

    else if (
      comando.includes(
        "deficiência auditiva"
      )
    ) {
      opcaoEncontrada =
        "Deficiência auditiva";
    }

    else if (
      comando.includes(
        "pessoa surda"
      ) ||
      comando.includes(
        "sou surda"
      ) ||
      comando.includes(
        "sou surdo"
      )
    ) {
      opcaoEncontrada =
        "Pessoa surda";
    }

    else if (
      comando.includes(
        "deficiência intelectual"
      )
    ) {
      opcaoEncontrada =
        "Deficiência intelectual";
    }

    else if (
      comando.includes(
        "neurodivergência"
      ) ||
      comando.includes(
        "neurodivergente"
      )
    ) {
      opcaoEncontrada =
        "Neurodivergência";
    }

    else if (
      comando.includes(
        "outra necessidade"
      )
    ) {
      opcaoEncontrada =
        "Outra necessidade";
    }

    else if (
      comando.includes(
        "não preciso"
      ) ||
      comando.includes(
        "nenhuma"
      ) ||
      comando.includes(
        "sem acessibilidade"
      )
    ) {
      opcaoEncontrada =
        "Não preciso de recursos de acessibilidade";
    }

    if (!opcaoEncontrada) {
      falarEExecutar(
        "Não consegui identificar essa opção. Tente falar novamente.",
        ouvirAcessibilidade
      );

      return;
    }

    setNecessidades(
      (anteriores) => {
        if (
          anteriores.includes(
            opcaoEncontrada
          )
        ) {
          return anteriores;
        }

        return [
          ...anteriores,
          opcaoEncontrada
        ];
      }
    );

    perguntarOutraNecessidade(
      opcaoEncontrada
    );
  });
}

// ========================================
// PERGUNTAR SE QUER MAIS UMA
// ========================================

function perguntarOutraNecessidade(
  opcao
) {
  falarEExecutar(
    `${opcao} selecionada. Você precisa de outro recurso de acessibilidade? Responda sim ou não.`,
    ouvirRespostaOutraNecessidade
  );
}


// ========================================
// OUVIR SIM OU NÃO
// ========================================

function ouvirRespostaOutraNecessidade() {
  reconhecerVoz((texto) => {
    const resposta =
      texto
        .toLowerCase()
        .trim();

    if (
      resposta.includes("sim")
    ) {
      falarEExecutar(
        "Certo. Diga o próximo recurso de acessibilidade.",
        ouvirAcessibilidade
      );

      return;
    }

    if (
      resposta.includes("não") ||
      resposta.includes("nao")
    ) {
      falarMensagemCadastro(
        "Certo. Suas preferências de acessibilidade foram preenchidas. Revise os dados e pressione criar minha conta."
      );

      return;
    }

    falarEExecutar(
      "Não entendi. Responda apenas sim ou não.",
      ouvirRespostaOutraNecessidade
    );
  });
}


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
// PEDIR NOME
// ========================================

function falarNome() {
  falarEExecutar(
    "Vamos criar sua conta. Primeiro, diga o seu nome.",
    ouvirNome
  );
}


// ========================================
// OUVIR NOME
// ========================================

function ouvirNome() {
  reconhecerVoz((texto) => {
    const nomeFalado =
      texto
        .trim()
        .replace(
          /\b\w/g,
          (letra) =>
            letra.toUpperCase()
        );

    setNome(
      nomeFalado
    );

    falarEExecutar(
      `Nome preenchido como ${nomeFalado}. Agora diga o seu e-mail.`,
      ouvirEmail
    );
  });
}

// ========================================
// OUVIR EMAIL
// ========================================

function ouvirEmail() {
  reconhecerVoz((texto) => {
    let emailFalado =
      texto.toLowerCase();

    emailFalado =
      emailFalado
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
  emailFalado
);

if (
  senhaRef.current
) {
  senhaRef.current.focus();
}

falarMensagemCadastro(
  "E-mail preenchido. Agora crie sua senha usando o teclado."
);
  });
}

// ========================================
// FALAR E CONTINUAR
// ========================================

function falarEExecutar(
  mensagem,
  proximaEtapa
) {
  if (
    !("speechSynthesis" in window)
  ) {
    proximaEtapa();
    return;
  }

  window.speechSynthesis.cancel();

  const fala =
    new SpeechSynthesisUtterance(
      mensagem
    );

  fala.lang = "pt-BR";
  fala.rate = 1;
  fala.pitch = 1;
  fala.volume = 1;

  fala.onstart = () => {
    console.log(
      "Assistente falando:",
      mensagem
    );
  };

  fala.onend = () => {
    // Pequena pausa para não abrir
    // o microfone imediatamente.
    setTimeout(() => {
      proximaEtapa();
    }, 350);
  };

  fala.onerror = (
    erro
  ) => {
    console.error(
      "Erro na fala:",
      erro
    );
  };

  window.speechSynthesis.speak(
    fala
  );
}


// ========================================
// APENAS FALAR
// ========================================

function falarMensagemCadastro(
  mensagem
) {
  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const fala =
    new SpeechSynthesisUtterance(
      mensagem
    );

  fala.lang = "pt-BR";
  fala.rate = 1;
  fala.pitch = 1;

  window.speechSynthesis.speak(
    fala
  );
}


// ========================================
// RECONHECER VOZ
// ========================================

function reconhecerVoz(
  aoReconhecer
) {
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

  reconhecimento.lang = "pt-BR";
  reconhecimento.continuous = false;
  reconhecimento.interimResults = false;

  reconhecimento.onstart = () => {
    setOuvindoCadastro(true);
  };

  reconhecimento.onend = () => {
    setOuvindoCadastro(false);
  };

  reconhecimento.onerror = (
    erroVoz
  ) => {
    console.error(
      "Erro no reconhecimento de voz:",
      erroVoz
    );

    setOuvindoCadastro(false);
  };

  reconhecimento.onresult = (
    evento
  ) => {
    const texto =
      evento.results[0][0]
        .transcript;

    aoReconhecer(
      texto
    );
  };

  reconhecimento.start();
}

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
  ref={senhaRef}
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

          <button
  type="button"
  className="cadastro-voice-accessibility"
  onClick={
    iniciarAcessibilidadePorVoz
  }
>
  <span aria-hidden="true">
    🎤
  </span>

  <span>
    Preencher acessibilidade por voz
  </span>
</button>


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