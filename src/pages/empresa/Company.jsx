import {
  useNavigate
} from "react-router-dom";

import "../../css/company.css";


function Company() {
  const navigate =
    useNavigate();


  // ========================================
  // VERIFICAR SE JÁ EXISTE EMPRESA
  // ========================================

  const usuarioSalvo =
    localStorage.getItem(
      "acessivelJaUsuario"
    );

  const usuario =
    usuarioSalvo
      ? JSON.parse(
          usuarioSalvo
        )
      : null;

  const possuiEmpresa =
    Boolean(
      usuario?.empresa
    );


  // ========================================
  // ABRIR ÁREA DA EMPRESA
  // ========================================

  function abrirAreaEmpresa() {
    if (
      possuiEmpresa
    ) {
      navigate(
        "/empresa/painel"
      );

      return;
    }

    navigate(
      "/empresa/cadastro"
    );
  }


  return (
    <main className="company-page">

      <button
        type="button"
        className="company-back-button"
        onClick={() =>
          navigate(
            "/home"
          )
        }
      >
        ← Voltar
      </button>


      {/* ========================================
          HERO
      ======================================== */}

      <section className="company-hero">

        <div className="company-hero-content">

          <span className="company-label">
            ACESSÍVEL JÁ PARA EMPRESAS
          </span>

          <h1>
            Torne seu estabelecimento
            <span> mais acessível e mais visível.</span>
          </h1>

          <p>
            Cadastre sua empresa no Acessível Já,
            apresente seus recursos de acessibilidade
            e ajude mais pessoas a encontrarem lugares
            preparados para recebê-las.
          </p>

          <button
            type="button"
            className="company-primary-button"
            onClick={
              abrirAreaEmpresa
            }
          >
            {possuiEmpresa
              ? "Ver minha empresa"
              : "Cadastrar minha empresa"}
          </button>

        </div>


        <div className="company-hero-card">

          <div className="company-hero-icon">
            ♿
          </div>

          <span>
            ESTABELECIMENTO ACESSÍVEL
          </span>

          <h2>
            Sua empresa mais próxima
            de quem precisa.
          </h2>

          <div className="company-hero-detail">

            <div>
              ✓
            </div>

            <p>
              Destaque os recursos de
              acessibilidade disponíveis.
            </p>

          </div>

          <div className="company-hero-detail">

            <div>
              ✓
            </div>

            <p>
              Faça parte do nosso
              Mapa Acessível.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================
          BENEFÍCIOS
      ======================================== */}

      <section className="company-benefits">

        <div className="company-section-heading">

          <span>
            POR QUE FAZER PARTE?
          </span>

          <h2>
            Acessibilidade também conecta pessoas.
          </h2>

          <p>
            Mostre aos usuários que seu
            estabelecimento está preparado
            para recebê-los.
          </p>

        </div>


        <div className="company-benefits-grid">

          <article className="company-benefit-card">

            <div className="company-benefit-icon">
              ♿
            </div>

            <h3>
              Mostre sua acessibilidade
            </h3>

            <p>
              Informe rampas, banheiros adaptados,
              estacionamento acessível e outros
              recursos disponíveis.
            </p>

          </article>


          <article className="company-benefit-card">

            <div className="company-benefit-icon">
              📍
            </div>

            <h3>
              Apareça no Mapa Acessível
            </h3>

            <p>
              Facilite a descoberta do seu
              estabelecimento por pessoas que
              procuram locais acessíveis.
            </p>

          </article>


          <article className="company-benefit-card">

            <div className="company-benefit-icon">
              ★
            </div>

            <h3>
              Construa sua reputação
            </h3>

            <p>
              Empresas com plano Premium poderão
              receber avaliações dos usuários
              da plataforma.
            </p>

          </article>

        </div>

      </section>


      {/* ========================================
          COMO FUNCIONA
      ======================================== */}

      <section className="company-how">

        <div className="company-section-heading">

          <span>
            COMO FUNCIONA
          </span>

          <h2>
            Comece em poucos passos.
          </h2>

        </div>


        <div className="company-steps">

          <div className="company-step">

            <strong>
              01
            </strong>

            <div>

              <h3>
                Cadastre sua empresa
              </h3>

              <p>
                Informe os dados do seu
                estabelecimento.
              </p>

            </div>

          </div>


          <div className="company-step">

            <strong>
              02
            </strong>

            <div>

              <h3>
                Informe a acessibilidade
              </h3>

              <p>
                Selecione os recursos disponíveis
                no local.
              </p>

            </div>

          </div>


          <div className="company-step">

            <strong>
              03
            </strong>

            <div>

              <h3>
                Escolha seu plano
              </h3>

              <p>
                Selecione o plano que melhor
                atende sua empresa.
              </p>

            </div>

          </div>


          <div className="company-step">

            <strong>
              04
            </strong>

            <div>

              <h3>
                Entre para a plataforma
              </h3>

              <p>
                Após a ativação, seu estabelecimento
                poderá aparecer para os usuários.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CHAMADA FINAL
      ======================================== */}

      <section className="company-cta">

        <span>
          FAÇA PARTE
        </span>

        <h2>
          Sua empresa pode ajudar a tornar
          a cidade mais acessível.
        </h2>

        <p>
          Cadastre seu estabelecimento e faça
          parte da rede Acessível Já.
        </p>

        <button
          type="button"
          onClick={
            abrirAreaEmpresa
          }
        >
          {possuiEmpresa
            ? "Acessar minha empresa"
            : "Quero ser parceiro"}
        </button>

      </section>


    </main>
  );
}

export default Company;