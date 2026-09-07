import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../../css/company-dashboard.css";


function CompanyDashboard() {
  const navigate =
    useNavigate();

  const [
    empresa,
    setEmpresa
  ] = useState(null);


  useEffect(() => {
    const usuarioSalvo =
      localStorage.getItem(
        "acessivelJaUsuario"
      );

    if (!usuarioSalvo) {
      navigate(
        "/login"
      );

      return;
    }

    const usuario =
      JSON.parse(
        usuarioSalvo
      );

    if (!usuario.empresa) {
      navigate(
        "/empresa"
      );

      return;
    }

    setEmpresa(
      usuario.empresa
    );
  }, [
    navigate
  ]);


  if (!empresa) {
    return (
      <main className="company-dashboard-loading">
        Carregando painel...
      </main>
    );
  }


  return (
    <main className="company-dashboard-page">

      <header className="company-dashboard-header">

        <div>

          <span>
            PAINEL DA EMPRESA
          </span>

          <h1>
            {empresa.nomeEmpresa}
          </h1>

          <p>
            Gerencie sua presença no
            Acessível Já.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          Voltar ao início
        </button>

      </header>


      <section className="company-dashboard-status">

        <div>

          <span>
            STATUS
          </span>

          <strong>
            {empresa.pagamentoAtivo
              ? "Empresa ativa"
              : "Aguardando ativação"}
          </strong>

        </div>

        <div>

          <span>
            PLANO
          </span>

          <strong>
            {empresa.plano?.nome ||
              "Nenhum plano"}
          </strong>

        </div>

        <div>

          <span>
            VISIBILIDADE
          </span>

          <strong>
            {empresa.visivelPublicamente
              ? "Visível no Acessível Já"
              : "Não publicada"}
          </strong>

        </div>

      </section>


      <section className="company-dashboard-grid">


        <article className="company-dashboard-card">

          <div className="company-dashboard-card-icon">
            🏢
          </div>

          <span>
            PERFIL DA EMPRESA
          </span>

          <h2>
            Informações cadastradas
          </h2>

          <div className="company-dashboard-info">

            <div>
              <span>
                Categoria
              </span>

              <strong>
                {empresa.categoria}
              </strong>
            </div>

            <div>
              <span>
                Telefone
              </span>

              <strong>
                {empresa.telefone}
              </strong>
            </div>

            <div>
              <span>
                E-mail
              </span>

              <strong>
                {empresa.emailComercial}
              </strong>
            </div>

            <div>
              <span>
                Endereço
              </span>

              <strong>
                {empresa.endereco},{" "}
                {empresa.numero}
              </strong>
            </div>

          </div>

        </article>


        <article className="company-dashboard-card">

          <div className="company-dashboard-card-icon">
            ♿
          </div>

          <span>
            ACESSIBILIDADE
          </span>

          <h2>
            Recursos disponíveis
          </h2>

          <div className="company-dashboard-tags">

            {empresa.acessibilidade?.map(
              (item) => (
                <span
                  key={
                    item
                  }
                >
                  {item}
                </span>
              )
            )}

          </div>

        </article>


        <article className="company-dashboard-card">

          <div className="company-dashboard-card-icon">
            ◈
          </div>

          <span>
            ASSINATURA
          </span>

          <h2>
            Plano {empresa.plano?.nome}
          </h2>

          <div className="company-dashboard-plan">

            <div>

              <span>
                Período
              </span>

              <strong>
                {empresa.plano?.periodo ===
                "mensal"
                  ? "Mensal"
                  : "Anual"}
              </strong>

            </div>

            <div>

              <span>
                Valor
              </span>

              <strong>
                {Number(
                  empresa.plano?.valor ||
                    0
                ).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL"
                  }
                )}
              </strong>

            </div>

          </div>

        </article>


        <article className="company-dashboard-card">

          <div className="company-dashboard-card-icon">
            📊
          </div>

          <span>
            DESEMPENHO
          </span>

          <h2>
            Visibilidade da empresa
          </h2>

          <div className="company-dashboard-metrics">

            <div>

              <strong>
                128
              </strong>

              <span>
                Visualizações
              </span>

            </div>

            <div>

              <strong>
                34
              </strong>

              <span>
                Acessos ao perfil
              </span>

            </div>

          </div>

          <small>
            Dados simulados para o
            protótipo.
          </small>

        </article>

      </section>


      {empresa.plano?.id ===
        "premium" && (

        <section className="company-dashboard-reviews">

          <div>

            <span>
              AVALIAÇÕES
            </span>

            <h2>
              O que os usuários dizem
            </h2>

            <p>
              O plano Premium permite
              acompanhar avaliações e a
              reputação da empresa.
            </p>

          </div>

          <div className="company-dashboard-rating">

            <strong>
              4,8
            </strong>

            <span>
              ★★★★★
            </span>

            <p>
              26 avaliações
            </p>

          </div>

        </section>

      )}

    </main>
  );
}

export default CompanyDashboard;