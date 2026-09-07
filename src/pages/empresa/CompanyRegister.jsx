import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../../css/company-register.css";


function CompanyRegister() {
  const navigate =
    useNavigate();

  const [
    etapa,
    setEtapa
  ] = useState(1);

  const [
    dados,
    setDados
  ] = useState({
    nomeEmpresa: "",
    cnpj: "",
    categoria: "",
    descricao: "",
    telefone: "",
    emailComercial: "",

    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",

    acessibilidade: []
  });


  // ========================================
  // OPÇÕES
  // ========================================

  const recursosAcessibilidade = [
    "Entrada acessível",
    "Banheiro adaptado",
    "Vaga acessível",
    "Elevador",
    "Piso tátil",
    "Sinalização em braile",
    "Atendimento em Libras",
    "Espaço para cadeira de rodas"
  ];


  // ========================================
  // ALTERAR CAMPOS
  // ========================================

  function atualizarCampo(
    evento
  ) {
    const {
      name,
      value
    } = evento.target;

    setDados(
      (dadosAtuais) => ({
        ...dadosAtuais,
        [name]: value
      })
    );
  }


  // ========================================
  // ACESSIBILIDADE
  // ========================================

  function alternarAcessibilidade(
    recurso
  ) {
    setDados(
      (dadosAtuais) => {
        const selecionado =
          dadosAtuais.acessibilidade.includes(
            recurso
          );

        return {
          ...dadosAtuais,

          acessibilidade:
            selecionado
              ? dadosAtuais.acessibilidade.filter(
                  (item) =>
                    item !== recurso
                )
              : [
                  ...dadosAtuais.acessibilidade,
                  recurso
                ]
        };
      }
    );
  }


  // ========================================
  // VALIDAÇÃO
  // ========================================

  function validarEtapaAtual() {
    if (etapa === 1) {
      return (
        dados.nomeEmpresa.trim() &&
        dados.cnpj.trim() &&
        dados.categoria.trim() &&
        dados.descricao.trim() &&
        dados.telefone.trim() &&
        dados.emailComercial.trim()
      );
    }

    if (etapa === 2) {
      return (
        dados.cep.trim() &&
        dados.endereco.trim() &&
        dados.numero.trim() &&
        dados.bairro.trim() &&
        dados.cidade.trim() &&
        dados.estado.trim()
      );
    }

    if (etapa === 3) {
      return (
        dados.acessibilidade.length > 0
      );
    }

    return true;
  }


  // ========================================
  // PRÓXIMA ETAPA
  // ========================================

  function avancar() {
    if (
      !validarEtapaAtual()
    ) {
      alert(
        "Preencha todos os campos obrigatórios antes de continuar."
      );

      return;
    }

    if (
      etapa < 4
    ) {
      setEtapa(
        etapa + 1
      );
    }
  }


  // ========================================
  // VOLTAR ETAPA
  // ========================================

  function voltar() {
    if (
      etapa > 1
    ) {
      setEtapa(
        etapa - 1
      );

      return;
    }

    navigate(
      "/empresa"
    );
  }


  // ========================================
  // FINALIZAR CADASTRO
  // ========================================

  function finalizarCadastro() {
    const usuarioSalvo =
      localStorage.getItem(
        "acessivelJaUsuario"
      );

    if (!usuarioSalvo) {
      alert(
        "Usuário não encontrado."
      );

      navigate(
        "/login"
      );

      return;
    }

    const usuario =
      JSON.parse(
        usuarioSalvo
      );

    const usuarioAtualizado = {
      ...usuario,

      perfis: {
        ...usuario.perfis,
        usuario: true,
        empresa: true
      },

      empresa: {
        ...dados,

        plano: null,

        pagamentoAtivo:
          false,

        visivelPublicamente:
          false,

        cadastradaEm:
          new Date().toISOString()
      }
    };

    localStorage.setItem(
      "acessivelJaUsuario",
      JSON.stringify(
        usuarioAtualizado
      )
    );

    navigate(
      "/empresa/planos"
    );
  }


  // ========================================
  // PROGRESSO
  // ========================================

  const progresso =
    etapa * 25;


  return (
    <main className="company-register-page">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="company-register-sidebar">

        <div className="company-register-brand">

          <span>
            ACESSÍVEL JÁ
          </span>

          <h1>
            Área para empresas
          </h1>

          <p>
            Cadastre seu estabelecimento
            e mostre seus recursos de
            acessibilidade.
          </p>

        </div>


        <div className="company-register-progress">

          <div className="company-register-progress-top">

            <span>
              Etapa {etapa} de 4
            </span>

            <strong>
              {progresso}%
            </strong>

          </div>

          <div className="company-register-progress-bar">

            <div
              style={{
                width:
                  `${progresso}%`
              }}
            ></div>

          </div>

        </div>


        <div className="company-register-steps">

          <div
            className={
              `company-register-step ${
                etapa === 1
                  ? "active"
                  : etapa > 1
                    ? "completed"
                    : ""
              }`
            }
          >

            <div className="company-register-step-number">
              {etapa > 1 ? "✓" : "01"}
            </div>

            <div>

              <strong>
                Empresa
              </strong>

              <span>
                Dados principais
              </span>

            </div>

          </div>


          <div
            className={
              `company-register-step ${
                etapa === 2
                  ? "active"
                  : etapa > 2
                    ? "completed"
                    : ""
              }`
            }
          >

            <div className="company-register-step-number">
              {etapa > 2 ? "✓" : "02"}
            </div>

            <div>

              <strong>
                Localização
              </strong>

              <span>
                Endereço do local
              </span>

            </div>

          </div>


          <div
            className={
              `company-register-step ${
                etapa === 3
                  ? "active"
                  : etapa > 3
                    ? "completed"
                    : ""
              }`
            }
          >

            <div className="company-register-step-number">
              {etapa > 3 ? "✓" : "03"}
            </div>

            <div>

              <strong>
                Acessibilidade
              </strong>

              <span>
                Recursos disponíveis
              </span>

            </div>

          </div>


          <div
            className={
              `company-register-step ${
                etapa === 4
                  ? "active"
                  : ""
              }`
            }
          >

            <div className="company-register-step-number">
              04
            </div>

            <div>

              <strong>
                Revisão
              </strong>

              <span>
                Confirme os dados
              </span>

            </div>

          </div>

        </div>


        <div className="company-register-sidebar-note">

          <span>
            PARCERIA ACESSÍVEL JÁ
          </span>

          <p>
            Seu estabelecimento só ficará
            visível publicamente após a
            ativação de um plano.
          </p>

        </div>

      </aside>


      {/* ========================================
          CONTEÚDO
      ======================================== */}

      <section className="company-register-content">


        {/* ========================================
            ETAPA 1
        ======================================== */}

        {etapa === 1 && (
          <div className="company-register-panel">

            <div className="company-register-heading">

              <span>
                DADOS DA EMPRESA
              </span>

              <h2>
                Conte um pouco sobre
                seu estabelecimento.
              </h2>

              <p>
                Essas informações serão
                usadas para identificar
                sua empresa na plataforma.
              </p>

            </div>


            <div className="company-register-form">

              <div className="company-register-field company-register-field-full">

                <label>
                  Nome do estabelecimento
                </label>

                <input
                  type="text"
                  name="nomeEmpresa"
                  value={
                    dados.nomeEmpresa
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="Ex.: Café Central"
                />

              </div>


              <div className="company-register-field">

                <label>
                  CNPJ
                </label>

                <input
                  type="text"
                  name="cnpj"
                  value={
                    dados.cnpj
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="00.000.000/0000-00"
                />

              </div>


              <div className="company-register-field">

                <label>
                  Categoria
                </label>

                <select
                  name="categoria"
                  value={
                    dados.categoria
                  }
                  onChange={
                    atualizarCampo
                  }
                >

                  <option value="">
                    Selecione
                  </option>

                  <option value="Restaurante">
                    Restaurante
                  </option>

                  <option value="Cafeteria">
                    Cafeteria
                  </option>

                  <option value="Loja">
                    Loja
                  </option>

                  <option value="Mercado">
                    Mercado
                  </option>

                  <option value="Hotel">
                    Hotel
                  </option>

                  <option value="Transporte">
                    Transporte
                  </option>

                  <option value="Clínica">
                    Clínica
                  </option>

                  <option value="Academia">
                    Academia
                  </option>

                  <option value="Outro">
                    Outro
                  </option>

                </select>

              </div>


              <div className="company-register-field">

                <label>
                  Telefone comercial
                </label>

                <input
                  type="tel"
                  name="telefone"
                  value={
                    dados.telefone
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="(00) 00000-0000"
                />

              </div>


              <div className="company-register-field">

                <label>
                  E-mail comercial
                </label>

                <input
                  type="email"
                  name="emailComercial"
                  value={
                    dados.emailComercial
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="contato@empresa.com"
                />

              </div>


              <div className="company-register-field company-register-field-full">

                <label>
                  Descrição
                </label>

                <textarea
                  name="descricao"
                  value={
                    dados.descricao
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="Conte brevemente sobre seu estabelecimento..."
                  rows="5"
                />

              </div>

            </div>

          </div>
        )}


        {/* ========================================
            ETAPA 2
        ======================================== */}

        {etapa === 2 && (
          <div className="company-register-panel">

            <div className="company-register-heading">

              <span>
                LOCALIZAÇÃO
              </span>

              <h2>
                Onde seu estabelecimento
                está localizado?
              </h2>

              <p>
                O endereço será usado para
                posicionar sua empresa no
                Mapa Acessível.
              </p>

            </div>


            <div className="company-register-form">

              <div className="company-register-field">

                <label>
                  CEP
                </label>

                <input
                  type="text"
                  name="cep"
                  value={
                    dados.cep
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="00000-000"
                />

              </div>


              <div className="company-register-field">

                <label>
                  Estado
                </label>

                <input
                  type="text"
                  name="estado"
                  value={
                    dados.estado
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="SP"
                />

              </div>


              <div className="company-register-field company-register-field-full">

                <label>
                  Endereço
                </label>

                <input
                  type="text"
                  name="endereco"
                  value={
                    dados.endereco
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="Rua, avenida..."
                />

              </div>


              <div className="company-register-field">

                <label>
                  Número
                </label>

                <input
                  type="text"
                  name="numero"
                  value={
                    dados.numero
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="120"
                />

              </div>


              <div className="company-register-field">

                <label>
                  Bairro
                </label>

                <input
                  type="text"
                  name="bairro"
                  value={
                    dados.bairro
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="Centro"
                />

              </div>


              <div className="company-register-field company-register-field-full">

                <label>
                  Cidade
                </label>

                <input
                  type="text"
                  name="cidade"
                  value={
                    dados.cidade
                  }
                  onChange={
                    atualizarCampo
                  }
                  placeholder="Cidade"
                />

              </div>

            </div>

          </div>
        )}


        {/* ========================================
            ETAPA 3
        ======================================== */}

        {etapa === 3 && (
          <div className="company-register-panel">

            <div className="company-register-heading">

              <span>
                ACESSIBILIDADE
              </span>

              <h2>
                Quais recursos sua
                empresa oferece?
              </h2>

              <p>
                Selecione tudo que estiver
                realmente disponível no
                estabelecimento.
              </p>

            </div>


            <div className="company-accessibility-grid">

              {recursosAcessibilidade.map(
                (recurso) => {
                  const selecionado =
                    dados.acessibilidade.includes(
                      recurso
                    );

                  return (
                    <button
                      key={
                        recurso
                      }
                      type="button"
                      className={
                        `company-accessibility-card ${
                          selecionado
                            ? "selected"
                            : ""
                        }`
                      }
                      onClick={() =>
                        alternarAcessibilidade(
                          recurso
                        )
                      }
                    >

                      <div className="company-accessibility-check">
                        {selecionado
                          ? "✓"
                          : "+"}
                      </div>

                      <strong>
                        {recurso}
                      </strong>

                    </button>
                  );
                }
              )}

            </div>

          </div>
        )}


        {/* ========================================
            ETAPA 4
        ======================================== */}

        {etapa === 4 && (
          <div className="company-register-panel">

            <div className="company-register-heading">

              <span>
                REVISÃO
              </span>

              <h2>
                Confira os dados
                antes de continuar.
              </h2>

              <p>
                Depois do cadastro,
                você poderá escolher
                o plano da sua empresa.
              </p>

            </div>


            <div className="company-review">

              <section className="company-review-block">

                <div className="company-review-title">

                  <span>
                    EMPRESA
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEtapa(
                        1
                      )
                    }
                  >
                    Editar
                  </button>

                </div>

                <h3>
                  {dados.nomeEmpresa}
                </h3>

                <p>
                  {dados.categoria}
                </p>

                <div className="company-review-grid">

                  <div>

                    <span>
                      CNPJ
                    </span>

                    <strong>
                      {dados.cnpj}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Telefone
                    </span>

                    <strong>
                      {dados.telefone}
                    </strong>

                  </div>

                  <div>

                    <span>
                      E-mail
                    </span>

                    <strong>
                      {dados.emailComercial}
                    </strong>

                  </div>

                </div>

              </section>


              <section className="company-review-block">

                <div className="company-review-title">

                  <span>
                    LOCALIZAÇÃO
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEtapa(
                        2
                      )
                    }
                  >
                    Editar
                  </button>

                </div>

                <strong className="company-review-address">
                  {dados.endereco},{" "}
                  {dados.numero}
                </strong>

                <p>
                  {dados.bairro} —{" "}
                  {dados.cidade} /{" "}
                  {dados.estado}
                </p>

                <span className="company-review-cep">
                  CEP {dados.cep}
                </span>

              </section>


              <section className="company-review-block">

                <div className="company-review-title">

                  <span>
                    ACESSIBILIDADE
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEtapa(
                        3
                      )
                    }
                  >
                    Editar
                  </button>

                </div>

                <div className="company-review-tags">

                  {dados.acessibilidade.map(
                    (item) => (
                      <span
                        key={
                          item
                        }
                      >
                        ✓ {item}
                      </span>
                    )
                  )}

                </div>

              </section>

            </div>

          </div>
        )}


        {/* ========================================
            AÇÕES
        ======================================== */}

        <div className="company-register-actions">

          <button
            type="button"
            className="company-register-back"
            onClick={
              voltar
            }
          >
            ← Voltar
          </button>


          {etapa < 4 && (
            <button
              type="button"
              className="company-register-next"
              onClick={
                avancar
              }
            >
              Continuar →
            </button>
          )}


          {etapa === 4 && (
            <button
              type="button"
              className="company-register-next"
              onClick={
                finalizarCadastro
              }
            >
              Confirmar cadastro
            </button>
          )}

        </div>

      </section>

    </main>
  );
}

export default CompanyRegister;