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

import "../css/profile.css";
import "../index.css";
import useAlertaSonoro from "../hooks/useAlertaSonoro";


function Profile() {
  const navigate = useNavigate();

  // Necessidades de acessibilidade selecionadas.
  const [necessidades, setNecessidades] = useState([]);

  // Preferências gerais de acessibilidade.
  const [textoMaior, setTextoMaior] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);
  const [alertasSonoros, setAlertasSonoros] = useState(false);
  const [vibracao, setVibracao] = useState(false);

  // Controla a mensagem de confirmação.
  const [salvo, setSalvo] = useState(false);

 // Dados do usuário.
const usuario =
  obterUsuario();

const nome =
  usuario?.nome || "Usuário";

const fotoPerfil =
  usuario?.fotoPerfil || "";

    // ========================================
  // ALERTA SONORO
  // ========================================

  useAlertaSonoro(
    "Perfil e acessibilidade. Nesta página você pode configurar suas necessidades e preferências de acessibilidade."
  );

/*
  Quando a página abre:
  - carrega as preferências
  - restaura as configurações visuais
*/
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
      JSON.parse(preferenciasSalvas);

    setNecessidades(
      preferencias.necessidades || []
    );

    setTextoMaior(
      preferencias.textoMaior || false
    );

    setAltoContraste(
      preferencias.altoContraste || false
    );

    setAlertasSonoros(
      preferencias.alertasSonoros || false
    );

    setVibracao(
      preferencias.vibracao || false
    );

    document.documentElement.classList.toggle(
      "texto-maior",
      Boolean(preferencias.textoMaior)
    );

    document.documentElement.classList.toggle(
      "alto-contraste",
      Boolean(preferencias.altoContraste)
    );
  } catch (erro) {
    console.error(
      "Erro ao carregar preferências:",
      erro
    );
  }
}, []);

function sairDaConta() {
  localStorage.removeItem(
    "acessivelJaLogado"
  );

  navigate("/login");
}

  /*
    Lista das necessidades disponíveis.
  */
  const opcoesNecessidades = [
    {
      id: "cadeira-rodas",
      icone: "♿",
      nome: "Cadeira de rodas",
      descricao:
        "Veículos e locais com acesso adaptado",
    },
    {
      id: "mobilidade-reduzida",
      icone: "🚶",
      nome: "Mobilidade reduzida",
      descricao:
        "Embarque facilitado e menos deslocamento",
    },
    {
      id: "deficiencia-visual",
      icone: "👁️",
      nome: "Deficiência visual",
      descricao:
        "Recursos para pessoas cegas ou com baixa visão",
    },
    {
      id: "deficiencia-auditiva",
      icone: "🦻",
      nome: "Deficiência auditiva",
      descricao:
        "Comunicação visual e informações em texto",
    },
    {
      id: "cao-guia",
      icone: "🦮",
      nome: "Cão-guia",
      descricao:
        "Preferência por transporte adequado para cão-guia",
    },
  ];

  /*
    Adiciona ou remove uma necessidade.
  */
  function alternarNecessidade(id) {
    setSalvo(false);

    setNecessidades((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores.filter(
          (necessidade) =>
            necessidade !== id
        );
      }

      return [
        ...anteriores,
        id
      ];
    });
  }

  /*
    Aplica as preferências visuais
    diretamente no HTML.
  */
  function aplicarPreferencias(preferencias) {
    const raiz =
      document.documentElement;

    raiz.classList.toggle(
      "texto-maior",
      Boolean(preferencias.textoMaior)
    );

    raiz.classList.toggle(
      "alto-contraste",
      Boolean(preferencias.altoContraste)
    );
  }

  /*
    Salva todas as preferências no navegador.
  */
  function salvarPreferencias() {
    const preferencias = {
      necessidades,
      textoMaior,
      altoContraste,
      alertasSonoros,
      vibracao,
    };

    localStorage.setItem(
      "acessivelJaPreferencias",
      JSON.stringify(preferencias)
    );

    aplicarPreferencias(
      preferencias
    );

    setSalvo(true);
  }

  return (
    <main className="profile-page">

      {/* Cabeçalho */}
      <header className="profile-header">
        <button
          type="button"
          className="profile-back"
          onClick={() =>
            navigate("/home")
          }
          aria-label="Voltar para o início"
        >
          ←
        </button>

        <div>
          <span>
            ACESSÍVEL JÁ
          </span>

          <h1>
            Perfil e acessibilidade
          </h1>

          <p>
            Personalize o aplicativo de acordo
            com suas necessidades.
          </p>
        </div>
      </header>

      {/* Informações do perfil */}
      <section className="profile-user-card">

        <div className="profile-avatar">
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt={`Foto de perfil de ${nome}`}
            />
          ) : (
            <span>
              {nome.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <span>
            MEU PERFIL
          </span>

          <h2>
            {nome}
          </h2>

          <p>
            Configure suas preferências
            e recursos de acessibilidade.
          </p>
        </div>

      </section>

      {/* Necessidades de acessibilidade */}
      <section className="profile-section">

        <div className="profile-section-title">
          <span>
            ACESSIBILIDADE
          </span>

          <h2>
            Quais são suas necessidades?
          </h2>

          <p>
            Você pode selecionar mais de uma opção.
          </p>
        </div>

        <div className="profile-needs">

          {opcoesNecessidades.map(
            (opcao) => {
              const selecionado =
                necessidades.includes(
                  opcao.id
                );

              return (
                <button
                  key={opcao.id}
                  type="button"
                  className={
                    selecionado
                      ? "profile-need active"
                      : "profile-need"
                  }
                  onClick={() =>
                    alternarNecessidade(
                      opcao.id
                    )
                  }
                  aria-pressed={
                    selecionado
                  }
                >
                  <div className="profile-need-icon">
                    {opcao.icone}
                  </div>

                  <div className="profile-need-text">
                    <strong>
                      {opcao.nome}
                    </strong>

                    <span>
                      {opcao.descricao}
                    </span>
                  </div>

                  <div className="profile-check">
                    {selecionado
                      ? "✓"
                      : ""}
                  </div>
                </button>
              );
            }
          )}

        </div>
      </section>

      {/* Preferências */}
      <section className="profile-section">

        <div className="profile-section-title">
          <span>
            PREFERÊNCIAS
          </span>

          <h2>
            Experiência no aplicativo
          </h2>
        </div>

        <div className="profile-settings">

          {/* Texto maior */}
          <label className="profile-setting">
            <div>
              <strong>
                Texto maior
              </strong>

              <span>
                Aumenta o tamanho dos textos
                principais do aplicativo.
              </span>
            </div>

            <input
              type="checkbox"
              checked={textoMaior}
              onChange={(evento) => {
                const ativo =
                  evento.target.checked;

                setTextoMaior(
                  ativo
                );

                setSalvo(false);

                document.documentElement.classList.toggle(
                  "texto-maior",
                  ativo
                );
              }}
            />
          </label>

          {/* Alto contraste */}
          <label className="profile-setting">
            <div>
              <strong>
                Alto contraste
              </strong>

              <span>
                Aumenta o contraste entre
                textos e elementos da interface.
              </span>
            </div>

            <input
              type="checkbox"
              checked={altoContraste}
              onChange={(evento) => {
                const ativo =
                  evento.target.checked;

                setAltoContraste(
                  ativo
                );

                setSalvo(false);

                document.documentElement.classList.toggle(
                  "alto-contraste",
                  ativo
                );
              }}
            />
          </label>

          {/* Alertas sonoros */}
          <label className="profile-setting">
            <div>
              <strong>
                Alertas sonoros
              </strong>

              <span>
                Reforça informações importantes
                utilizando avisos sonoros.
              </span>
            </div>

            <input
              type="checkbox"
              checked={alertasSonoros}
              onChange={(evento) => {
                setAlertasSonoros(
                  evento.target.checked
                );

                setSalvo(false);
              }}
            />
          </label>

          {/* Vibração */}
          <label className="profile-setting">
            <div>
              <strong>
                Vibração
              </strong>

              <span>
                Usa vibração em avisos importantes
                quando o dispositivo permitir.
              </span>
            </div>

            <input
              type="checkbox"
              checked={vibracao}
              onChange={(evento) => {
                setVibracao(
                  evento.target.checked
                );

                setSalvo(false);
              }}
            />
          </label>

        </div>
      </section>

      {/* Confirmação */}
      {salvo && (
        <div className="profile-saved-area">

          <div
            className="profile-saved-message"
            role="status"
          >
            ✓ Preferências salvas com sucesso
          </div>

          <button
            type="button"
            className="profile-return"
            onClick={() =>
              navigate("/home")
            }
          >
            <span>
              Voltar para o início
            </span>

            <span>
              →
            </span>
          </button>

        </div>
      )}

      {/* Salvar */}
      <button
        type="button"
        className="profile-save"
        onClick={salvarPreferencias}
      >
        <span>
          Salvar preferências
        </span>

        <span>
          →
        </span>
      </button>

      <section className="profile-logout-section">

  <button
    type="button"
    className="profile-logout-button"
    onClick={sairDaConta}
  >
    <span>
      Sair da conta
    </span>

    <span aria-hidden="true">
      →
    </span>
  </button>

</section>

    </main>
  );
}

export default Profile;