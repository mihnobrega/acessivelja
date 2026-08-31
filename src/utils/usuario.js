export function obterUsuario() {
  const dadosSalvos =
    localStorage.getItem(
      "acessivelJaUsuario"
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
      "Erro ao carregar usuário:",
      erro
    );

    return null;
  }
}