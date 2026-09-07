import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  QRCodeSVG
} from "qrcode.react";

import "../../css/company-payment.css";


function CompanyPayment() {
  const navigate =
    useNavigate();

  const [
    plano,
    setPlano
  ] = useState(null);

  const [
    pagamentoConcluido,
    setPagamentoConcluido
  ] = useState(false);


  // ========================================
  // CARREGAR PLANO ESCOLHIDO
  // ========================================

  useEffect(() => {
    const planoSalvo =
      sessionStorage.getItem(
        "planoEmpresaSelecionado"
      );

    if (!planoSalvo) {
      navigate(
        "/empresa/planos"
      );

      return;
    }

    setPlano(
      JSON.parse(
        planoSalvo
      )
    );
  }, [
    navigate
  ]);


  // ========================================
  // FORMATAR PREÇO
  // ========================================

  function formatarPreco(
    valor
  ) {
    return Number(
      valor
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
  }


  // ========================================
  // SIMULAR PAGAMENTO
  // ========================================

  function simularPagamento() {
    const usuarioSalvo =
      localStorage.getItem(
        "acessivelJaUsuario"
      );

    if (!usuarioSalvo) {
      alert(
        "Usuário não encontrado."
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
        ...usuario.empresa,

        plano: {
          id:
            plano.id,

          nome:
            plano.nome,

          periodo:
            plano.periodo,

          valor:
            plano.valor,

          recursos:
            plano.recursos
        },

        pagamentoAtivo:
          true,

        visivelPublicamente:
          true,

        pagamento: {
          metodo:
            "pix",

          status:
            "aprovado",

          pagoEm:
            new Date().toISOString()
        }
      }
    };

    localStorage.setItem(
      "acessivelJaUsuario",
      JSON.stringify(
        usuarioAtualizado
      )
    );

    setPagamentoConcluido(
      true
    );
  }


  // ========================================
  // IR PARA O PAINEL
  // ========================================

  function abrirPainel() {
    sessionStorage.removeItem(
      "planoEmpresaSelecionado"
    );

    navigate(
      "/empresa/painel"
    );
  }


  if (!plano) {
    return (
      <main className="company-payment-loading">
        Carregando pagamento...
      </main>
    );
  }


  return (
    <main className="company-payment-page">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="company-payment-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/empresa/planos"
            )
          }
        >
          ← Voltar aos planos
        </button>

        <div>

          <span>
            PAGAMENTO
          </span>

          <h1>
            Ative sua empresa no
            Acessível Já
          </h1>

          <p>
            Conclua o pagamento para
            liberar os recursos do plano
            escolhido.
          </p>

        </div>

      </header>


      {!pagamentoConcluido ? (

        <section className="company-payment-container">


          {/* ========================================
              RESUMO
          ======================================== */}

          <aside className="company-payment-summary">

            <span className="company-payment-label">
              SUA ASSINATURA
            </span>

            <h2>
              Plano {plano.nome}
            </h2>

            <p>
              {plano.periodo === "mensal"
                ? "Assinatura mensal"
                : "Assinatura anual"}
            </p>


            <div className="company-payment-price">

              <strong>
                {formatarPreco(
                  plano.valor
                )}
              </strong>

              <span>
                {plano.periodo === "mensal"
                  ? "/ mês"
                  : "/ ano"}
              </span>

            </div>


            <div className="company-payment-divider"></div>


            <div className="company-payment-benefits">

              <span>
                RECURSOS INCLUÍDOS
              </span>

              {plano.recursos.map(
                (recurso) => (
                  <div
                    key={
                      recurso
                    }
                  >

                    <span>
                      ✓
                    </span>

                    <p>
                      {recurso}
                    </p>

                  </div>
                )
              )}

            </div>

          </aside>


          {/* ========================================
              PIX
          ======================================== */}

          <section className="company-payment-pix">

            <div className="company-payment-pix-title">

              <div>
                PIX
              </div>

              <section>

                <span>
                  PAGAMENTO VIA PIX
                </span>

                <h2>
                  Escaneie o QR Code
                </h2>

                <p>
                  Este pagamento é apenas
                  uma simulação para o
                  protótipo.
                </p>

              </section>

            </div>


            {/* QR CODE FICTÍCIO */}

            <div className="company-payment-qr">

  <QRCodeSVG
 value="https://acessivelja.vercel.app/empresa/pagamento-confirmado"
  size={180}
  level="H" />

</div>

            {/* CÓDIGO PIX */}

            <div className="company-payment-code">

              <label>
                Pix copia e cola
              </label>

              <div>

                <span>
                  00020126360014BR.GOV.BCB.PIX.ACESSIVELJA
                </span>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      "00020126360014BR.GOV.BCB.PIX.ACESSIVELJA"
                    );

                    alert(
                      "Código Pix copiado."
                    );
                  }}
                >
                  Copiar
                </button>

              </div>

            </div>


            <div className="company-payment-notice">

              <span>
                ℹ
              </span>

              <p>
                No aplicativo real, a
                confirmação seria feita
                automaticamente após o
                processamento do pagamento.
              </p>

            </div>


            <button
              type="button"
              className="company-payment-confirm"
              onClick={
                simularPagamento
              }
            >
              Simular pagamento aprovado
            </button>

          </section>

        </section>

      ) : (

        /* ========================================
           PAGAMENTO APROVADO
        ======================================== */

        <section className="company-payment-success">

          <div className="company-payment-success-icon">
            ✓
          </div>

          <span>
            PAGAMENTO APROVADO
          </span>

          <h2>
            Sua empresa está ativa!
          </h2>

          <p>
            O plano{" "}
            <strong>
              {plano.nome}
            </strong>{" "}
            foi ativado com sucesso.
            Agora você já pode acessar
            o painel da empresa.
          </p>


          <div className="company-payment-success-plan">

            <div>

              <span>
                PLANO
              </span>

              <strong>
                {plano.nome}
              </strong>

            </div>


            <div>

              <span>
                VALOR
              </span>

              <strong>
                {formatarPreco(
                  plano.valor
                )}
              </strong>

            </div>


            <div>

              <span>
                STATUS
              </span>

              <strong>
                Ativo
              </strong>

            </div>

          </div>


          <button
            type="button"
            onClick={
              abrirPainel
            }
          >
            Ir para o painel da empresa
          </button>

        </section>

      )}

    </main>
  );
}

export default CompanyPayment;
