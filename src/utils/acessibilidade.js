export function obterPreferenciasAcessibilidade() {
  const dadosSalvos =
    localStorage.getItem(
      "acessivelJaPreferencias"
    );

  if (!dadosSalvos) {
    return {};
  }

  try {
    return JSON.parse(
      dadosSalvos
    );
  } catch (erro) {
    console.error(
      "Erro ao carregar preferências:",
      erro
    );

    return {};
  }
}

export function falarMensagem(mensagem) {
  const preferencias =
    obterPreferenciasAcessibilidade();

  if (
    !preferencias.alertasSonoros ||
    !mensagem
  ) {
    return;
  }

  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const fala =
    new SpeechSynthesisUtterance(
      mensagem
    );

  fala.lang = "pt-BR";
  fala.rate = 1;
  fala.pitch = 1;

  window.speechSynthesis.speak(
    fala
  );
}

export function pararFala() {
  if (
    "speechSynthesis" in window
  ) {
    window.speechSynthesis.cancel();
  }
}