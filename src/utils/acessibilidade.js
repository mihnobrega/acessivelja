export function obterPreferenciasAcessibilidade() {
  const dadosSalvos =
    localStorage.getItem(
      "acessivelJaPreferencias"
    );

  if (!dadosSalvos) {
    return null;
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

    return null;
  }
}

export function falarMensagem(mensagem) {
  const preferencias =
    obterPreferenciasAcessibilidade();

  if (!preferencias?.alertasSonoros) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const fala =
    new SpeechSynthesisUtterance(
      mensagem
    );

  fala.lang = "pt-BR";
  fala.rate = 0.95;
  fala.pitch = 1;
  fala.volume = 1;

  window.speechSynthesis.speak(
    fala
  );
}