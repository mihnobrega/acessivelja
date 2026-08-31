import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessiblePlacesMap from "../components/AccessiblePlacesMap";
import useAlertaSonoro from "../hooks/useAlertaSonoro";
/* ========================================
   CALCULAR E FORMATAR DISTÂNCIA
======================================== */

function calcularDistancia(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const raioTerra = 6371;

  const paraRadianos = (graus) =>
    graus * (Math.PI / 180);

  const diferencaLatitude =
    paraRadianos(latitude2 - latitude1);

  const diferencaLongitude =
    paraRadianos(longitude2 - longitude1);

  const a =
    Math.sin(diferencaLatitude / 2) ** 2 +
    Math.cos(paraRadianos(latitude1)) *
      Math.cos(paraRadianos(latitude2)) *
      Math.sin(diferencaLongitude / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return raioTerra * c;
}

function formatarDistancia(distanciaKm) {
  if (distanciaKm < 1) {
    return `${Math.round(distanciaKm * 1000)} m`;
  }

  return `${distanciaKm
    .toFixed(1)
    .replace(".", ",")} km`;
}

function AccessibleMap() {
  const navigate = useNavigate();
  
  // ALERTA SONORO

  useAlertaSonoro(
    "Mapa acessível. Encontre lugares próximos com recursos de acessibilidade."
  );


  /* ========================================
     LOCALIZAÇÃO REAL DO USUÁRIO
  ======================================== */

  const [localizacao, setLocalizacao] =
    useState(null);

  const [carregandoLocalizacao, setCarregandoLocalizacao] =
    useState(true);

  const [erroLocalizacao, setErroLocalizacao] =
    useState("");


  /* ========================================
     FILTRO SELECIONADO
  ======================================== */

  const [filtroSelecionado, setFiltroSelecionado] =
    useState("todos");


  /* ========================================
     LOCAL SELECIONADO
  ======================================== */

  const [localSelecionado, setLocalSelecionado] =
    useState(null);


  /* ========================================
     ESTABELECIMENTOS DEMONSTRATIVOS
  ======================================== */

  const locaisBase = [
    {
      id: 1,
      nome: "Café Aurora",
      categoria: "Café",
      icone: "☕",
      recursos: [
        "mobilidade",
        "visual",
        "auditiva"
      ],
      acessibilidade: [
        "Entrada sem degraus",
        "Banheiro acessível",
        "Cardápio em braile",
        "Atendimento inclusivo"
      ],
      deslocamentoLatitude: 0.003,
      deslocamentoLongitude: -0.002
    },
    {
      id: 2,
      nome: "Shopping Horizonte",
      categoria: "Shopping",
      icone: "🛍️",
      recursos: [
        "mobilidade",
        "visual",
        "auditiva",
        "cognitiva"
      ],
      acessibilidade: [
        "Elevadores acessíveis",
        "Banheiros adaptados",
        "Vagas reservadas",
        "Piso tátil",
        "Sinalização acessível"
      ],
      deslocamentoLatitude: -0.005,
      deslocamentoLongitude: 0.004
    },
    {
      id: 3,
      nome: "Centro Cultural Harmonia",
      categoria: "Cultura",
      icone: "🎭",
      recursos: [
        "mobilidade",
        "auditiva"
      ],
      acessibilidade: [
        "Entrada acessível",
        "Espaços para cadeira de rodas",
        "Eventos com intérprete de Libras"
      ],
      deslocamentoLatitude: 0.007,
      deslocamentoLongitude: 0.006
    },
    {
      id: 4,
      nome: "Biblioteca Caminhos",
      categoria: "Biblioteca",
      icone: "📖",
      recursos: [
        "mobilidade",
        "visual",
        "cognitiva"
      ],
      acessibilidade: [
        "Piso tátil",
        "Livros em braile",
        "Audiolivros",
        "Espaço para cadeira de rodas",
        "Sinalização simplificada"
      ],
      deslocamentoLatitude: -0.003,
      deslocamentoLongitude: -0.006
    },
    {
      id: 5,
      nome: "Restaurante Sabor & Acesso",
      categoria: "Restaurante",
      icone: "🍴",
      recursos: [
        "mobilidade",
        "visual"
      ],
      acessibilidade: [
        "Entrada sem degraus",
        "Mesas acessíveis",
        "Cardápio em braile",
        "Banheiro adaptado"
      ],
      deslocamentoLatitude: 0.005,
      deslocamentoLongitude: -0.007
    },
    {
      id: 6,
      nome: "Farmácia Vida",
      categoria: "Farmácia",
      icone: "💊",
      recursos: [
        "mobilidade",
        "auditiva",
        "cognitiva"
      ],
      acessibilidade: [
        "Entrada acessível",
        "Balcão rebaixado",
        "Atendimento inclusivo",
        "Sinalização simplificada"
      ],
      deslocamentoLatitude: -0.007,
      deslocamentoLongitude: -0.002
    },
    {
      id: 7,
      nome: "Parque das Flores",
      categoria: "Lazer",
      icone: "🌳",
      recursos: [
        "mobilidade",
        "visual",
        "cognitiva"
      ],
      acessibilidade: [
        "Caminhos acessíveis",
        "Piso tátil",
        "Banheiro adaptado",
        "Sinalização de fácil compreensão"
      ],
      deslocamentoLatitude: 0.009,
      deslocamentoLongitude: 0.002
    },
    {
      id: 8,
      nome: "Centro de Saúde Bem-Estar",
      categoria: "Saúde",
      icone: "🏥",
      recursos: [
        "mobilidade",
        "visual",
        "auditiva",
        "cognitiva"
      ],
      acessibilidade: [
        "Rampa de acesso",
        "Banheiro adaptado",
        "Piso tátil",
        "Atendimento em Libras",
        "Sinalização acessível"
      ],
      deslocamentoLatitude: -0.009,
      deslocamentoLongitude: 0.007
    }
  ];


  /* ========================================
     CRIAR LOCAIS PRÓXIMOS AO USUÁRIO
  ======================================== */

  const locais = localizacao
    ? locaisBase.map((local) => {
        const latitudeLocal =
          localizacao.latitude +
          local.deslocamentoLatitude;

        const longitudeLocal =
          localizacao.longitude +
          local.deslocamentoLongitude;

        const distanciaKm =
          calcularDistancia(
            localizacao.latitude,
            localizacao.longitude,
            latitudeLocal,
            longitudeLocal
          );

        return {
          ...local,
          latitude: latitudeLocal,
          longitude: longitudeLocal,
          distancia:
            formatarDistancia(distanciaKm)
        };
      })
    : [];


  /* ========================================
     PEGAR LOCALIZAÇÃO
  ======================================== */

  useEffect(() => {

    /*
      Aqui verificamos se o navegador
      consegue acessar o GPS.
    */

    if (!navigator.geolocation) {

      setErroLocalizacao(
        "Seu dispositivo não oferece suporte à localização."
      );

      setCarregandoLocalizacao(false);

      return;
    }


    /*
      getCurrentPosition pede ao navegador
      a localização atual do usuário.
    */

    navigator.geolocation.getCurrentPosition(

      /*
        Se funcionar:
      */

      (posicao) => {

        setLocalizacao({
          latitude:
            posicao.coords.latitude,

          longitude:
            posicao.coords.longitude,

          precisao:
            posicao.coords.accuracy
        });


        setCarregandoLocalizacao(false);
      },


      /*
        Se acontecer algum erro:
      */

      (erro) => {

        console.error(
          "Erro de localização:",
          erro
        );


        setErroLocalizacao(
          "Não foi possível acessar sua localização."
        );


        setCarregandoLocalizacao(false);
      },


      /*
        Configurações do GPS.
      */

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );

  }, []);


  /* ========================================
     FILTRAR OS LOCAIS
  ======================================== */

  const locaisFiltrados =
    filtroSelecionado === "todos"

      ? locais

      : locais.filter(
          (local) =>
            local.recursos.includes(
              filtroSelecionado
            )
        );


  return (
    <main className="accessible-map-page">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="accessible-map-header">

        <button
          type="button"
          className="accessible-map-back"
          onClick={() =>
            navigate("/home")
          }
          aria-label="Voltar para o início"
        >
          ←
        </button>


        <div>

          <span>
            Acessível Já
          </span>

          <h1>
            Mapa Acessível
          </h1>

          <p>
            Encontre lugares com recursos
            de acessibilidade.
          </p>

        </div>

      </header>


      {/* ========================================
          LOCALIZAÇÃO
      ======================================== */}

      <section className="accessible-location-card">

        <div className="accessible-location-icon">
          ◎
        </div>


        <div>

          <span>
            Sua localização
          </span>


          {carregandoLocalizacao && (
            <strong>
              Localizando você...
            </strong>
          )}


          {!carregandoLocalizacao &&
            localizacao && (
              <>
                <strong>
                  Localização encontrada
                </strong>

                <small>
                  Precisão aproximada de{" "}
                  {Math.round(
                    localizacao.precisao
                  )} metros
                </small>
              </>
            )}


          {erroLocalizacao && (
            <strong>
              {erroLocalizacao}
            </strong>
          )}

        </div>

      </section>


      {/* ========================================
          FILTROS
      ======================================== */}

      <section className="accessible-filter-section">

        <div className="accessible-section-title">

          <span>
            Explorar
          </span>

          <h2>
            Filtrar acessibilidade
          </h2>

        </div>


        <div className="accessible-filters">

          <button
            type="button"
            className={
              filtroSelecionado === "todos"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado("todos")
            }
          >
            Todos
          </button>


          <button
            type="button"
            className={
              filtroSelecionado === "mobilidade"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado("mobilidade")
            }
          >
            ♿ Mobilidade
          </button>


          <button
            type="button"
            className={
              filtroSelecionado === "visual"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado("visual")
            }
          >
            👁 Visual
          </button>


          <button
            type="button"
            className={
              filtroSelecionado === "auditiva"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado("auditiva")
            }
          >
            🦻 Auditiva
          </button>


          <button
            type="button"
            className={
              filtroSelecionado === "cognitiva"
                ? "accessible-filter active"
                : "accessible-filter"
            }
            onClick={() =>
              setFiltroSelecionado("cognitiva")
            }
          >
            Cognitiva
          </button>

        </div>

      </section>


      {/* ========================================
          ESPAÇO DO MAPA
      ======================================== */}

      <section className="accessible-map-container">

  {carregandoLocalizacao && (
    <div className="accessible-map-loading">

      <div className="map-loading-circle"></div>

      <strong>
        Preparando mapa acessível...
      </strong>

      <p>
        Aguarde enquanto acessamos
        sua localização.
      </p>

    </div>
  )}


  {!carregandoLocalizacao &&
    localizacao && (
      <AccessiblePlacesMap
        latitude={
          localizacao.latitude
        }

        longitude={
          localizacao.longitude
        }

        locais={
          locaisFiltrados
        }

        localSelecionado={
          localSelecionado
        }

        onSelecionarLocal={
          setLocalSelecionado
        }
      />
    )}


  {!carregandoLocalizacao &&
    erroLocalizacao && (
      <div className="accessible-map-loading">

        <strong>
          Não foi possível mostrar o mapa.
        </strong>

        <p>
          Verifique a permissão de localização.
        </p>

      </div>
    )}

</section>


      {/* ========================================
          LUGARES
      ======================================== */}

      <section className="accessible-places-section">

        <div className="accessible-section-title">

          <span>
            Próximos de você
          </span>

          <h2>
            Lugares acessíveis
          </h2>

        </div>


        <div className="accessible-places-list">

          {locaisFiltrados.map((local) => (
              <button
                key={local.id}
                type="button"
                className="accessible-place-card"
                onClick={() =>
                  setLocalSelecionado(local)
                }
              >
                <div className="accessible-place-icon">
                  {local.icone}
                </div>

                <div className="accessible-place-content">
                  <span>
                    {local.categoria}
                  </span>

                  <strong>
                    {local.nome}
                  </strong>

                  <small>
                    {local.distancia}
                  </small>
                </div>

                <div className="accessible-place-arrow">
                  →
                </div>
              </button>
            ))}

        </div>

      </section>


      {/* ========================================
          DETALHES DO LOCAL
      ======================================== */}

      {localSelecionado && (

        <div className="accessible-place-overlay">

          <section className="accessible-place-modal">

            <button
              type="button"
              className="accessible-modal-close"
              onClick={() =>
                setLocalSelecionado(null)
              }
              aria-label="Fechar detalhes"
            >
              ×
            </button>


            <div className="accessible-modal-icon">
              {localSelecionado.icone}
            </div>


            <span>
              {localSelecionado.categoria}
            </span>


            <h2>
              {localSelecionado.nome}
            </h2>


            <p>
              {localSelecionado.distancia}
              {" "}da sua localização
            </p>


            <div className="accessible-modal-divider">
            </div>


            <h3>
              Recursos de acessibilidade
            </h3>


            <div className="accessible-features">

              {localSelecionado
                .acessibilidade
                .map(
                  (recurso) => (

                    <div
                      key={recurso}
                      className="accessible-feature"
                    >

                      <span>
                        ✓
                      </span>

                      {recurso}

                    </div>

                  )
                )}

            </div>


            <small className="accessible-data-warning">
              Informações demonstrativas
              para o protótipo.
            </small>

          </section>

        </div>

      )}

    </main>
  );
}

export default AccessibleMap;