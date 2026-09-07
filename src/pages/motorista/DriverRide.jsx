import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "../../css/driver-ride.css";

import DriverNavigationMap from "../../components/DriverNavigationMap";


function DriverRide() {
  const navigate =
    useNavigate();

  const corridaSalva =
    sessionStorage.getItem(
      "corridaMotoristaAtual"
    );

  const corrida =
    corridaSalva
      ? JSON.parse(
          corridaSalva
        )
      : null;


  const [
    etapa,
    setEtapa
  ] = useState(
    "buscar"
  );

  const [
    chegouDestino,
    setChegouDestino
  ] = useState(false);


  // ========================================
  // AVANÇAR CORRIDA
  // ========================================

  function avancarCorrida() {
    if (
      etapa === "buscar"
    ) {
      setEtapa(
        "chegou"
      );

      return;
    }

    if (
      etapa === "chegou"
    ) {
      setChegouDestino(
        false
      );

      setEtapa(
        "andamento"
      );

      return;
    }

    if (
      etapa === "andamento" &&
      chegouDestino
    ) {
      finalizarCorrida();
    }
  }
//finalizar corrida
function finalizarCorrida() {
  const usuarioSalvo =
    localStorage.getItem(
      "acessivelJaUsuario"
    );

  if (usuarioSalvo) {
    const usuario =
      JSON.parse(
        usuarioSalvo
      );

    const corridasAtuais =
      usuario.motorista
        ?.corridasRealizadas ||
      0;

    const ganhosAtuais =
      usuario.motorista
        ?.ganhosHoje ||
      0;

    const valorCorrida =
      Number(
        corrida.valor
          .replace(
            "R$",
            ""
          )
          .replace(
            ".",
            ""
          )
          .replace(
            ",",
            "."
          )
          .trim()
      );

    const usuarioAtualizado = {
      ...usuario,

      motorista: {
        ...usuario.motorista,

        corridasRealizadas:
          corridasAtuais + 1,

        ganhosHoje:
          ganhosAtuais +
          valorCorrida,

        disponivel: true
      }
    };

    localStorage.setItem(
      "acessivelJaUsuario",
      JSON.stringify(
        usuarioAtualizado
      )
    );
  }


  // Salva os dados para a tela
  // de corrida concluída

  sessionStorage.setItem(
    "ultimaCorridaMotorista",
    JSON.stringify({
      passageiro:
        corrida.passageiro,

      destino:
        corrida.destino,

      embarque:
        corrida.embarque,

      distancia:
        corrida.distancia,

      duracao:
        corrida.duracao,

      valor:
        corrida.valor
    })
  );


  // Remove a corrida ativa

  sessionStorage.removeItem(
    "corridaMotoristaAtual"
  );


  // Vai para a tela de conclusão

  navigate(
    "/motorista/corrida/concluida"
  );
}


  // ========================================
  // SEM CORRIDA ATIVA
  // ========================================

  if (!corrida) {
    return (
      <main className="driver-ride-page">

        <div className="driver-ride-empty">

          <h1>
            Nenhuma corrida ativa
          </h1>

          <p>
            Volte para a área do motorista
            para receber novas solicitações.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/motorista"
              )
            }
          >
            Voltar
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="driver-ride-page">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="driver-ride-header">

        <div>

          <span>
            CORRIDA ATIVA
          </span>

          <h1>

            {etapa === "buscar" &&
              "Busque o passageiro"}

            {etapa === "chegou" &&
              "Passageiro encontrado"}

            {etapa === "andamento" &&
              (
                chegouDestino
                  ? "Você chegou ao destino"
                  : "Corrida em andamento"
              )}

          </h1>

        </div>

      </header>


      {/* ========================================
          MAPA / NAVEGAÇÃO
      ======================================== */}

      <section className="driver-ride-navigation">

        <div className="driver-navigation-header">

          <div>

            <span>
              NAVEGAÇÃO
            </span>

            <h2>

              {etapa === "buscar" &&
                `Vá buscar ${corrida.passageiro}`}

              {etapa === "chegou" &&
                `${corrida.passageiro} está no embarque`}

              {etapa === "andamento" &&
                (
                  chegouDestino
                    ? `Você chegou em ${corrida.destino}`
                    : `Siga para ${corrida.destino}`
                )}

            </h2>

          </div>


          <div className="driver-navigation-info">

            <strong>
              {corrida.duracao}
            </strong>

            <span>
              {corrida.distancia}
            </span>

          </div>

        </div>


        <DriverNavigationMap
          corrida={
            corrida
          }
          etapa={
            etapa
          }
          onChegouPassageiro={() => {
            if (
              etapa === "buscar"
            ) {
              setEtapa(
                "chegou"
              );
            }
          }}
          onChegouDestino={() => {
            if (
              etapa === "andamento"
            ) {
              setChegouDestino(
                true
              );
            }
          }}
        />

      </section>


      {/* ========================================
          PASSAGEIRO
      ======================================== */}

      <section className="driver-ride-passenger">

        <div className="driver-passenger-avatar">
          {corrida.passageiro
            .charAt(0)}
        </div>

        <div>

          <span>
            PASSAGEIRO
          </span>

          <h2>
            {corrida.passageiro}
          </h2>

          <p>
            ★ {corrida.avaliacao}
          </p>

        </div>

      </section>


      {/* ========================================
          ROTA
      ======================================== */}

      <section className="driver-ride-route">

        <div className="driver-ride-route-item">

          <div className="driver-ride-marker">
            A
          </div>

          <div>

            <span>
              EMBARQUE
            </span>

            <strong>
              {corrida.embarque}
            </strong>

          </div>

        </div>


        <div className="driver-ride-line"></div>


        <div className="driver-ride-route-item">

          <div className="driver-ride-marker">
            B
          </div>

          <div>

            <span>
              DESTINO
            </span>

            <strong>
              {corrida.destino}
            </strong>

          </div>

        </div>

      </section>


      {/* ========================================
          INFORMAÇÕES
      ======================================== */}

      <section className="driver-ride-info">

        <div>

          <span>
            DISTÂNCIA
          </span>

          <strong>
            {corrida.distancia}
          </strong>

        </div>


        <div>

          <span>
            TEMPO
          </span>

          <strong>
            {corrida.duracao}
          </strong>

        </div>


        <div>

          <span>
            VALOR
          </span>

          <strong>
            {corrida.valor}
          </strong>

        </div>

      </section>


      {/* ========================================
          ACESSIBILIDADE
      ======================================== */}

      <section className="driver-ride-accessibility">

        <span>
          NECESSIDADE DE ACESSIBILIDADE
        </span>

        <strong>
          ♿ {corrida.acessibilidade}
        </strong>

      </section>


      {/* ========================================
          STATUS
      ======================================== */}

      <section className="driver-ride-status">

        <div className="driver-ride-status-icon">

          {etapa === "buscar" &&
            "⌖"}

          {etapa === "chegou" &&
            "✓"}

          {etapa === "andamento" &&
            (
              chegouDestino
                ? "✓"
                : "→"
            )}

        </div>


        <div>

          <span>
            STATUS
          </span>

          <h2>

            {etapa === "buscar" &&
              "Indo até o passageiro"}

            {etapa === "chegou" &&
              "Aguardando passageiro"}

            {etapa === "andamento" &&
              (
                chegouDestino
                  ? "Destino alcançado"
                  : "Indo para o destino"
              )}

          </h2>


          <p>

            {etapa === "buscar" &&
              "Siga até o endereço de embarque."}

            {etapa === "chegou" &&
              "Confirme quando o passageiro estiver no veículo."}

            {etapa === "andamento" &&
              (
                chegouDestino
                  ? "A corrida chegou ao destino. Finalize após o desembarque do passageiro."
                  : "Siga até o destino informado."
              )}

          </p>

        </div>

      </section>


      {/* ========================================
          BOTÃO PRINCIPAL
      ======================================== */}

      <button
        type="button"
        className="driver-ride-main-button"
        onClick={
          avancarCorrida
        }
        disabled={
          etapa === "andamento" &&
          !chegouDestino
        }
      >

        {etapa === "buscar" &&
          "Cheguei ao embarque"}

        {etapa === "chegou" &&
          "Iniciar corrida"}

        {etapa === "andamento" &&
          (
            chegouDestino
              ? "Finalizar corrida"
              : "A caminho do destino..."
          )}

      </button>

    </main>
  );
}

export default DriverRide;