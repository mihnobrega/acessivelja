import {
  useNavigate
} from "react-router-dom";

import "../css/welcome.css";
import logo from "../assets/logo.png";

function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">

      <div className="welcome-decoration welcome-decoration-one"></div>
      <div className="welcome-decoration welcome-decoration-two"></div>
      <div className="welcome-decoration welcome-decoration-three"></div>

      <section className="welcome-brand">

        <div className="welcome-logo-box">
          <img
            src={logo}
            alt="Logo Acessível Já"
          />
        </div>

        <span>
          MOBILIDADE PARA TODOS
        </span>

      </section>

      <section className="welcome-card">

        <div className="welcome-card-detail"></div>

        <div className="welcome-card-header">

          <span>
            BEM-VINDO
          </span>

          <h1>
            Acessível Já
          </h1>

          <p>
            Corridas, lugares acessíveis e
            mobilidade com mais autonomia,
            segurança e inclusão.
          </p>

        </div>

        <div className="welcome-actions">

          <button
            className="welcome-primary-button"
            type="button"
            onClick={() =>
              navigate("/cadastro")
            }
          >
            <span>
              Começar
            </span>

            <span aria-hidden="true">
              →
            </span>
          </button>

          <button
            className="welcome-secondary-button"
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            <span>
              Já tenho uma conta
            </span>

            <span aria-hidden="true">
              👤
            </span>
          </button>

        </div>

        <div className="welcome-divider">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="welcome-accessibility">

          <p>
            Uma experiência pensada para
            diferentes necessidades.
          </p>

        </div>

      </section>

      <p className="welcome-footer">
        Acessibilidade, autonomia e mobilidade.
      </p>

    </main>
  );
}

export default Welcome;