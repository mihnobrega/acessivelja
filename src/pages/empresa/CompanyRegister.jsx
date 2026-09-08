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


  // ========================================
  // RECUPERAR USUÁRIO E EMPRESA SALVA
  // ========================================

  const usuarioSalvo =
    localStorage.getItem(
      "acessivelJaUsuario"
    );

  const usuarioInicial =
    usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : null;

  const empresaSalva =
    usuarioInicial?.empresa;


  // ========================================
  // ETAPA ATUAL
  // ========================================

  const [
    etapa,
    setEtapa
  ] = useState(1);


  // ========================================
  // DADOS DA EMPRESA
  // ========================================

  const [
    dados,
    setDados
  ] = useState({
    nomeEmpresa:
      empresaSalva?.nomeEmpresa || "",

    cnpj:
      empresaSalva?.cnpj || "",

    categoria:
      empresaSalva?.categoria || "",

    descricao:
      empresaSalva?.descricao || "",

    telefone:
      empresaSalva?.telefone || "",

    emailComercial:
      empresaSalva?.emailComercial || "",

    cep:
      empresaSalva?.cep || "",

    endereco:
      empresaSalva?.endereco || "",

    numero:
      empresaSalva?.numero || "",

    bairro:
      empresaSalva?.bairro || "",

    cidade:
      empresaSalva?.cidade || "",

    estado:
      empresaSalva?.estado || "",

    acessibilidade:
      empresaSalva?.acessibilidade || []
  });


  // ========================================
  // OPÇÕES DE ACESSIBILIDADE
  // ========================================

  const opcoesAcessibilidade = [
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
  // ATUALIZAR CAMPOS
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

        [name]:
          value
      })
    );
  }


  // ========================================
  // SELECIONAR ACESSIBILIDADE
  // ========================================

  function alternarAcessibilidade(
    recurso
  ) {
    setDados(
      (dadosAtuais) => {
        const jaSelecionado =
          dadosAtuais.acessibilidade.includes(
            recurso
          );

        return {
          ...dadosAtuais,

          acessibilidade:
            jaSelecionado
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
  // VALIDAR ETAPAS
  // ========================================

  function validarEtapa() {
    if (etapa === 1) {
      if (
        !dados.nomeEmpresa ||
        !dados.cnpj ||
        !dados.categoria ||
        !dados.descricao ||
        !dados.telefone ||
        !dados.emailComercial
      ) {
        alert(
          "Preencha todos os dados da empresa."
        );

        return false;
      }
    }


    if (etapa === 2) {
      if (
        !dados.cep ||
        !dados.endereco ||
        !dados.numero ||
        !dados.bairro ||
        !dados.cidade ||
        !dados.estado
      ) {
        alert(
          "Preencha todos os dados de localização."
        );

        return false;
      }
    }


    if (etapa === 3) {
      if (
        dados.acessibilidade.length === 0
      ) {
        alert(
          "Selecione pelo menos um recurso de acessibilidade."
        );

        return false;
      }
    }


    return true;
  }


  // ========================================
  // AVANÇAR
  // ========================================

  function avancar() {
    if (!validarEtapa()) {
      return;
    }

    if (etapa < 4) {
      setEtapa(
        etapa + 1
      );
    }
  }


  // ========================================
  // VOLTAR
  // ========================================

  function voltar() {
    if (etapa > 1) {
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
  // FINALIZAR / SALVAR CADASTRO
  // ========================================

  function finalizarCadastro() {
    const usuarioAtualSalvo =
      localStorage.getItem(
        "acessivelJaUsuario"
      );

    if (!usuarioAtualSalvo) {
      alert(
        "Usuário não encontrado."
      );

      navigate(
        "/login"
      );

      return;
    }


    const usuarioAtual =
      JSON.parse(
        usuarioAtualSalvo
      );


    const empresaAnterior =
      usuarioAtual.empresa || {};


    const usuarioAtualizado = {
      ...usuarioAtual,

      perfis: {
        ...usuarioAtual.perfis,

        usuario:
          true,

        empresa:
          true
      },

      empresa: {

        localizacao: {
          latitude:
            empresaAnterior.localizacao?.latitude ||
            -21.4678,

          longitude:
            empresaAnterior.localizacao?.longitude ||
            -47.0046
        },
        // Mantém informações antigas,
        // como plano e pagamento.
        ...empresaAnterior,

        // Atualiza os dados do cadastro.
        ...dados,

        plano:
          empresaAnterior.plano ||
          null,

        pagamentoAtivo:
          empresaAnterior.pagamentoAtivo ||
          false,

        visivelPublicamente:
          empresaAnterior.visivelPublicamente ||
          false,

        cadastradaEm:
          empresaAnterior.cadastradaEm ||
          new Date().toISOString(),

        atualizadaEm:
          new Date().toISOString()

      }
    };


    localStorage.setItem(
      "acessivelJaUsuario",
      JSON.stringify(
        usuarioAtualizado
      )
    );


    // ========================================
    // SE JÁ TEM PLANO, VOLTA AO PAINEL
    // ========================================

    if (
      usuarioAtualizado.empresa
        .pagamentoAtivo
    ) {
      navigate(
        "/empresa/painel"
      );

      return;
    }


    // ========================================
    // PRIMEIRO CADASTRO
    // ========================================

    navigate(
      "/empresa/planos"
    );
  }


  return (
    <main className="company-register-page">



      {/* ========================================
          BARRA LATERAL
      ======================================== */}

      <aside className="company-register-sidebar">

        <div className="company-register-brand">

          <span>
            ACESSÍVEL JÁ
          </span>

          <h2>
            Cadastro da empresa
          </h2>

          <p>
            Complete as informações para
            divulgar seu estabelecimento.
          </p>

        </div>


        {/* PROGRESSO */}

        <div className="company-register-progress">

          <div className="company-register-progress-top">

            <span>
              PROGRESSO
            </span>

            <strong>
              {etapa * 25}%
            </strong>

          </div>

          <div className="company-register-progress-bar">

            <div
              style={{
                width:
                  `${etapa * 25}%`
              }}
            ></div>

          </div>

        </div>


        {/* ETAPAS */}

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

            <div>
              1
            </div>

            <span>
              Empresa
            </span>

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

            <div>
              2
            </div>

            <span>
              Localização
            </span>

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

            <div>
              3
            </div>

            <span>
              Acessibilidade
            </span>

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

            <div>
              4
            </div>

            <span>
              Revisão
            </span>

          </div>

        </div>


        <div className="company-register-sidebar-note">

          <span>
            ♿
          </span>

          <p>
            Sua empresa será exibida
            publicamente após a ativação
            de um plano.
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
          <>

            <div className="company-register-heading">

              <span>
                ETAPA 1 DE 4
              </span>

              <h1>
                Sobre sua empresa
              </h1>

              <p>
                Informe os principais dados
                do estabelecimento.
              </p>

            </div>


            <div className="company-register-form">

              <div className="company-register-field company-register-full">

                <label>
                  Nome da empresa
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
                  placeholder="Ex.: Café Central Mococa"
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

                  <option value="Hotel">
                    Hotel
                  </option>

                  <option value="Loja">
                    Loja
                  </option>

                  <option value="Clínica">
                    Clínica
                  </option>

                  <option value="Academia">
                    Academia
                  </option>

                  <option value="Transporte">
                    Transporte
                  </option>

                  <option value="Outro">
                    Outro
                  </option>

                </select>

              </div>


              <div className="company-register-field company-register-full">

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
                  placeholder="Conte um pouco sobre sua empresa..."
                ></textarea>

              </div>


              <div className="company-register-field">

                <label>
                  Telefone
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
                  placeholder="empresa@email.com"
                />

              </div>

            </div>

          </>
        )}


        {/* ========================================
            ETAPA 2
        ======================================== */}

        {etapa === 2 && (
          <>

            <div className="company-register-heading">

              <span>
                ETAPA 2 DE 4
              </span>

              <h1>
                Localização
              </h1>

              <p>
                Informe onde seu
                estabelecimento está
                localizado.
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
                  placeholder="123"
                />

              </div>


              <div className="company-register-field company-register-full">

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
                  placeholder="Bairro"
                />

              </div>


              <div className="company-register-field">

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

            </div>

          </>
        )}


        {/* ========================================
            ETAPA 3
        ======================================== */}

        {etapa === 3 && (
          <>

            <div className="company-register-heading">

              <span>
                ETAPA 3 DE 4
              </span>

              <h1>
                Recursos de acessibilidade
              </h1>

              <p>
                Selecione os recursos
                realmente disponíveis no
                estabelecimento.
              </p>

            </div>


            <div className="company-register-accessibility">

              {opcoesAcessibilidade.map(
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
                        `company-register-accessibility-card ${
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

                      <div>
                        {selecionado
                          ? "✓"
                          : "♿"}
                      </div>

                      <span>
                        {recurso}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          </>
        )}


        {/* ========================================
            ETAPA 4
        ======================================== */}

        {etapa === 4 && (
          <>

            <div className="company-register-heading">

              <span>
                ETAPA 4 DE 4
              </span>

              <h1>
                Revise as informações
              </h1>

              <p>
                Confira os dados antes de
                salvar sua empresa.
              </p>

            </div>


            <div className="company-register-review">


              {/* EMPRESA */}

              <div className="company-register-review-block">

                <div className="company-register-review-title">

                  <h3>
                    Empresa
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setEtapa(1)
                    }
                  >
                    Editar
                  </button>

                </div>


                <div className="company-register-review-grid">

                  <div>

                    <span>
                      Nome
                    </span>

                    <strong>
                      {dados.nomeEmpresa}
                    </strong>

                  </div>


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
                      Categoria
                    </span>

                    <strong>
                      {dados.categoria}
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

              </div>


              {/* LOCALIZAÇÃO */}

              <div className="company-register-review-block">

                <div className="company-register-review-title">

                  <h3>
                    Localização
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setEtapa(2)
                    }
                  >
                    Editar
                  </button>

                </div>


                <div className="company-register-review-grid">

                  <div>

                    <span>
                      Endereço
                    </span>

                    <strong>
                      {dados.endereco},{" "}
                      {dados.numero}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Bairro
                    </span>

                    <strong>
                      {dados.bairro}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Cidade
                    </span>

                    <strong>
                      {dados.cidade}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Estado
                    </span>

                    <strong>
                      {dados.estado}
                    </strong>

                  </div>


                  <div>

                    <span>
                      CEP
                    </span>

                    <strong>
                      {dados.cep}
                    </strong>

                  </div>

                </div>

              </div>


              {/* ACESSIBILIDADE */}

              <div className="company-register-review-block">

                <div className="company-register-review-title">

                  <h3>
                    Acessibilidade
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setEtapa(3)
                    }
                  >
                    Editar
                  </button>

                </div>


                <div className="company-register-review-tags">

                  {dados.acessibilidade.map(
                    (recurso) => (
                      <span
                        key={
                          recurso
                        }
                      >
                        {recurso}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

          </>
        )}


        {/* ========================================
            BOTÕES
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


          {etapa < 4 ? (

            <button
              type="button"
              className="company-register-next"
              onClick={
                avancar
              }
            >
              Continuar →
            </button>

          ) : (

            <button
              type="button"
              className="company-register-next"
              onClick={
                finalizarCadastro
              }
            >
              {empresaSalva
                ? "Salvar alterações"
                : "Confirmar cadastro"}
            </button>

          )}

        </div>

      </section>

    </main>
  );
}

export default CompanyRegister;