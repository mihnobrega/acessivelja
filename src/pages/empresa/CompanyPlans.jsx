import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../../css/company-plans.css";


function CompanyPlans() {
  const navigate =
    useNavigate();

  const [
    periodo,
    setPeriodo
  ] = useState(
    "mensal"
  );


  // ========================================
  // PLANOS
  // ========================================

  const planos = [
    {
      id: "simples",
      nome: "Simples",
      descricao:
        "Para empresas que querem começar a fazer parte da plataforma.",

      mensal: 99.90,
      anual: 999.00,

      recursos: [
        "Perfil da empresa",
        "Presença no Mapa Acessível",
        "Informações de acessibilidade"
      ]
    },

    {
      id: "intermediario",
      nome: "Intermediário",
      descricao:
        "Mais visibilidade e informações para acompanhar sua presença.",

      mensal: 199.90,
      anual: 1999.00,

      recursos: [
        "Tudo do plano Simples",
        "Mais destaque nas buscas",
        "Selo de Destaque",
        "Estatísticas da empresa"
      ]
    },

    {
      id: "premium",
      nome: "Premium",
      descricao:
        "A experiência mais completa para empresas parceiras.",

      mensal: 299.90,
      anual: 2999.00,

      recursos: [
        "Tudo do plano Intermediário",
        "Avaliações dos usuários",
        "Reputação da empresa",
        "Recursos avançados"
      ],

      destaque: true
    }
  ];


  // ========================================
  // FORMATAR PREÇO
  // ========================================

  function formatarPreco(
    valor
  ) {
    return valor.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
  }


  // ========================================
  // ESCOLHER PLANO
  // ========================================

  function escolherPlano(
    plano
  ) {
    const valor =
      periodo === "mensal"
        ? plano.mensal
        : plano.anual;

    const planoSelecionado = {
      id:
        plano.id,

      nome:
        plano.nome,

      periodo:
        periodo,

      valor:
        valor,

      recursos:
        plano.recursos
    };

    sessionStorage.setItem(
      "planoEmpresaSelecionado",
      JSON.stringify(
        planoSelecionado
      )
    );

    navigate(
      "/empresa/pagamento"
    );
  }


  return (
    <main className="company-plans-page">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="company-plans-header">

        <button
          type="button"
          className="company-plans-back"
          onClick={() =>
            navigate(
              "/empresa/cadastro"
            )
          }
        >
          ← Voltar
        </button>


        <div className="company-plans-heading">

          <span>
            PLANOS PARA EMPRESAS
          </span>

          <h1>
            Escolha como sua empresa
            vai participar.
          </h1>

          <p>
            Todos os planos permitem que seu
            estabelecimento faça parte do
            Acessível Já. Escolha os recursos
            ideais para sua empresa.
          </p>

        </div>


        {/* ========================================
            MENSAL / ANUAL
        ======================================== */}

        <div className="company-plans-period">

          <button
            type="button"
            className={
              periodo === "mensal"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriodo(
                "mensal"
              )
            }
          >
            Mensal
          </button>

          <button
            type="button"
            className={
              periodo === "anual"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriodo(
                "anual"
              )
            }
          >
            Anual

            <span>
              Economize
            </span>
          </button>

        </div>

      </header>


      {/* ========================================
          CARDS DOS PLANOS
      ======================================== */}

      <section className="company-plans-grid">

        {planos.map(
          (plano) => {
            const valor =
              periodo === "mensal"
                ? plano.mensal
                : plano.anual;

            return (
              <article
                key={
                  plano.id
                }
                className={
                  `company-plan-card ${
                    plano.destaque
                      ? "company-plan-featured"
                      : ""
                  }`
                }
              >

                {plano.destaque && (
                  <div className="company-plan-badge">
                    MAIS COMPLETO
                  </div>
                )}


                <div className="company-plan-top">

                  <span>
                    PLANO
                  </span>

                  <h2>
                    {plano.nome}
                  </h2>

                  <p>
                    {plano.descricao}
                  </p>

                </div>


                <div className="company-plan-price">

                  <strong>
                    {formatarPreco(
                      valor
                    )}
                  </strong>

                  <span>
                    {periodo === "mensal"
                      ? "/ mês"
                      : "/ ano"}
                  </span>

                </div>


                {periodo === "anual" && (
                  <p className="company-plan-equivalent">

                    Equivale a aproximadamente{" "}

                    <strong>
                      {formatarPreco(
                        valor / 12
                      )}
                    </strong>

                    {" "}por mês

                  </p>
                )}


                <div className="company-plan-divider"></div>


                <div className="company-plan-resources">

                  <span>
                    INCLUI
                  </span>

                  {plano.recursos.map(
                    (recurso) => (
                      <div
                        key={
                          recurso
                        }
                        className="company-plan-resource"
                      >

                        <div>
                          ✓
                        </div>

                        <p>
                          {recurso}
                        </p>

                      </div>
                    )
                  )}

                </div>


                <button
                  type="button"
                  className="company-plan-button"
                  onClick={() =>
                    escolherPlano(
                      plano
                    )
                  }
                >
                  Escolher {plano.nome}
                </button>

              </article>
            );
          }
        )}

      </section>


      {/* ========================================
          INFORMAÇÃO
      ======================================== */}

      <section className="company-plans-information">

        <div>
          ♿
        </div>

        <p>
          As informações de acessibilidade
          cadastradas devem representar os
          recursos realmente disponíveis no
          estabelecimento.
        </p>

      </section>


    </main>
  );
}

export default CompanyPlans;