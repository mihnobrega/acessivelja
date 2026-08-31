import kenguruImage from "../assets/kenguru.jpeg";
import compactAdaptImage from "../assets/compact-adapt.jpeg";
import comfortAccessImage from "../assets/comfort-access.jpeg";
import visualConnectImage from "../assets/visual-connect.jpeg";

export const veiculos = [
  {
    id: "kenguru",
    nome: "Kenguru",
    tipo: "Mobilidade adaptada",

    descricao:
      "Veículo desenvolvido para oferecer mais autonomia e segurança para pessoas que utilizam cadeira de rodas.",

    imagem: kenguruImage,
    icone: "♿",

    valor: "R$ 120",
    periodo: "por dia",

    recomendado: true,

    categoria: "Deficiência física",

    recursos: [
      "Acesso para cadeira de rodas",
      "Rampa traseira",
      "Espaço interno adaptado",
    ],

    detalhes: [
      {
        titulo: "Acesso para cadeira de rodas",
        descricao:
          "Espaço interno preparado para facilitar o acesso e a acomodação da cadeira de rodas.",
      },

      {
        titulo: "Rampa traseira",
        descricao:
          "Rampa de acesso para facilitar o embarque e o desembarque.",
      },

      {
        titulo: "Interior adaptado",
        descricao:
          "Espaço interno desenvolvido para proporcionar mais conforto e segurança.",
      },
    ],
  },

  {
    id: "compact-adapt",
    nome: "Compact Adapt",
    tipo: "Condução adaptada",

    descricao:
      "Veículo compacto com recursos adaptados para pessoas com limitações motoras que podem conduzir.",

    imagem: compactAdaptImage,
    icone: "🚗",

    valor: "R$ 95",
    periodo: "por dia",

    recomendado: false,

    categoria: "Mobilidade reduzida",

    recursos: [
      "Comandos manuais",
      "Câmbio automático",
      "Pomo giratório",
    ],

    detalhes: [
      {
        titulo: "Comandos manuais",
        descricao:
          "Controles adaptados para facilitar o uso do acelerador e do freio.",
      },

      {
        titulo: "Câmbio automático",
        descricao:
          "Reduz a necessidade de movimentos durante a condução.",
      },

      {
        titulo: "Pomo giratório",
        descricao:
          "Auxilia pessoas com limitação de movimento na utilização do volante.",
      },
    ],
  },

  {
    id: "comfort-access",
    nome: "Comfort Access",
    tipo: "Acessibilidade assistida",

    descricao:
      "Veículo pensado para passageiros cegos, com baixa visão ou que necessitam de assistência durante a viagem.",

    imagem: comfortAccessImage,
    icone: "🚐",

    valor: "R$ 145",
    periodo: "por dia",

    recomendado: false,

    categoria: "Deficiência visual",

    recursos: [
      "Orientações por áudio",
      "Espaço para cão-guia",
      "Assistência no embarque",
    ],

    detalhes: [
      {
        titulo: "Orientações por áudio",
        descricao:
          "Informações importantes da viagem podem ser apresentadas por áudio para facilitar a orientação.",
      },

      {
        titulo: "Espaço para cão-guia",
        descricao:
          "Espaço adequado para que o passageiro possa viajar acompanhado de cão-guia.",
      },

      {
        titulo: "Localização facilitada",
        descricao:
          "O aplicativo pode utilizar sinais sonoros e vibração para ajudar o passageiro a localizar o veículo.",
      },

      {
        titulo: "Assistência no embarque",
        descricao:
          "O serviço pode oferecer auxílio para localizar o veículo e realizar o embarque com mais segurança.",
      },
    ],
  },

  {
  id: "visual-connect",
  nome: "Visual Connect",
  tipo: "Acessibilidade visual",

  descricao:
    "Veículo com recursos visuais e comunicação facilitada para pessoas surdas ou com deficiência auditiva.",

  imagem: visualConnectImage,
  icone: "🚙",

  valor: "R$ 110",
  periodo: "por dia",

  recomendado: false,

  categoria: "Deficiência auditiva",

  recursos: [
    "Alertas visuais",
    "Comunicação por texto",
    "Informações da viagem na tela",
  ],

  detalhes: [
    {
      titulo: "Alertas visuais",
      descricao:
        "Avisos importantes da viagem podem ser apresentados visualmente para facilitar o acompanhamento do trajeto.",
    },

    {
      titulo: "Comunicação por texto",
      descricao:
        "O passageiro pode se comunicar pelo aplicativo utilizando mensagens de texto.",
    },

    {
      titulo: "Informações na tela",
      descricao:
        "Dados como chegada do veículo, início da viagem e destino podem ser apresentados de forma visual.",
    },

    {
      titulo: "Identificação facilitada",
      descricao:
        "O aplicativo destaca informações como modelo, placa e localização do veículo para facilitar a identificação.",
    },
  ],
},
];

export function buscarVeiculoPorId(id) {
  return veiculos.find(
    (veiculo) => veiculo.id === id
  );
}