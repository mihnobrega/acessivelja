import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

function VoiceAssistant() {
  const navigate = useNavigate();

  // Controla quando o microfone está ouvindo.
  const [
    ouvindo,
    setOuvindo
  ] = useState(false);

  // ==================================================
  // ATIVA O ASSISTENTE POR EVENTO
  // ==================================================

  useEffect(() => {
    function ativarPorEvento() {
      ativarAssistenteVoz();
    }

    window.addEventListener(
      "ativarAssistenteVoz",
      ativarPorEvento
    );

    return () => {
      window.removeEventListener(
        "ativarAssistenteVoz",
        ativarPorEvento
      );
    };
  }, []);

  // ==================================================
  // RECONHECIMENTO DE VOZ
  // ==================================================

  function ativarAssistenteVoz() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    // Verifica se o navegador permite reconhecimento.
    if (!SpeechRecognition) {
      alert(
        "O reconhecimento de voz não é suportado neste navegador."
      );

      return;
    }

    const reconhecimento =
      new SpeechRecognition();

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;

    // Começou a ouvir.
    reconhecimento.onstart = () => {
      setOuvindo(true);
    };

    // Parou de ouvir.
    reconhecimento.onend = () => {
      setOuvindo(false);
    };

    // Trata erros do microfone.
    reconhecimento.onerror = (
      erro
    ) => {
      console.error(
        "Erro no reconhecimento de voz:",
        erro
      );

      setOuvindo(false);
    };

    // Recebe o comando falado.
    reconhecimento.onresult = (
      evento
    ) => {
      const comando =
        evento.results[0][0]
          .transcript
          .toLowerCase();

      // Página inicial.
      if (
        comando.includes("início") ||
        comando.includes("home") ||
        comando.includes("página inicial")
      ) {
        navigate("/home");
        return;
      }

      // Cadastro.
        if (
        comando.includes("começar") ||
        comando.includes("cadastro") ||
        comando.includes("criar conta")
        ) {
        sessionStorage.setItem(
            "iniciarCadastroPorVoz",
            "true"
        );

        navigate("/cadastro");
        return;
        }

      // Login.
        if (
        comando.includes("entrar") ||
        comando.includes("login") ||
        comando.includes("já tenho uma conta")
        ) {
        // Informa ao Login que a pessoa
        // chegou usando o assistente de voz.
        sessionStorage.setItem(
            "iniciarLoginPorVoz",
            "true"
        );

        navigate("/login");
        return;
        }

      // Corrida.
        if (
        comando.includes("corrida") ||
        comando.includes("pedir corrida")
        ) {
        sessionStorage.setItem(
            "iniciarCorridaPorVoz",
            "true"
        );

        navigate("/corrida");
        return;
        }

      // Mapa acessível.
      if (
        comando.includes("mapa") ||
        comando.includes("lugar acessível") ||
        comando.includes("lugares acessíveis")
      ) {
        navigate("/mapa-acessivel");
        return;
      }

      // Aluguel.
      if (
        comando.includes("alugar") ||
        comando.includes("aluguel") ||
        comando.includes("veículo")
      ) {
        navigate("/aluguel");
        return;
      }

      // Perfil.
      if (
        comando.includes("perfil") ||
        comando.includes("acessibilidade")
      ) {
        navigate("/perfil");
        return;
      }

      // Voltar.
      if (
        comando.includes("voltar") ||
        comando.includes("volte")
      ) {
        navigate(-1);
        return;
      }

      const eventoPagina =
  new CustomEvent(
    "comandoVozPagina",
    {
      detail: {
        comando,
        entendido: false
      }
    }
  );

window.dispatchEvent(
  eventoPagina
);

if (
  eventoPagina.detail
    .entendido
) {
  return;
}

      alert(
        `Não entendi o comando: "${comando}".`
      );
    };

    // Inicia o microfone.
    reconhecimento.start();
  }

  return (
    <button
      type="button"
      className={
        ouvindo
          ? "global-voice-button listening"
          : "global-voice-button"
      }
      onClick={
        ativarAssistenteVoz
      }
      aria-label="Ativar assistente por voz"
    >
      {ouvindo
        ? "🎙️"
        : "🎤"}
    </button>
  );
}

export default VoiceAssistant;