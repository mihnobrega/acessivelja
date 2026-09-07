import {
  useNavigate
} from "react-router-dom";

import "../../css/company-payment-confirmed.css";


function CompanyPaymentConfirmed() {
  const navigate =
    useNavigate();


  return (
    <main className="company-payment-confirmed-page">

      <section className="company-payment-confirmed-card">

        <div className="company-payment-confirmed-icon">
          ✓
        </div>

        <span>
          ACESSÍVEL JÁ
        </span>

        <h1>
          Pagamento simulado
        </h1>

        <p>
          Este QR Code faz parte do
          protótipo do Acessível Já.
        </p>

        <p>
          Nenhuma cobrança real foi
          realizada.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/empresa"
            )
          }
        >
          Voltar ao Acessível Já
        </button>

      </section>

    </main>
  );
}

export default CompanyPaymentConfirmed;