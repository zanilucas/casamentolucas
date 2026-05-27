export const couple = {
  names: "Ana & Joao",
  brideFirstName: "Ana",
  groomFirstName: "Joao",
  date: "15 de Marco de 2025",
  weekDay: "Sabado",
  time: "17h00",
  ceremony: "Igreja Nossa Senhora das Gracas",
  party: "Espaco Villa Garden",
  address: "Rua das Flores, 123 - Osvaldo Cruz, SP",
  mapsUrl: "https://maps.google.com/?q=Espaco+Villa+Garden+Osvaldo+Cruz",
  rsvpDeadline: "28 de fevereiro",
  welcome:
    "Com imensa alegria, convidamos voce para celebrar conosco o inicio da nossa nova historia. Sera uma noite de amor, gratidao e muitas memorias inesqueciveis.",
};

export const fallbackGifts = [
  {
    id: "lua-de-mel",
    name: "Cota Lua de Mel",
    description: "Contribua para a viagem dos nossos sonhos.",
    priceCents: 20000,
    emoji: "✈",
    allowCustomAmount: false,
  },
  {
    id: "jantar-romantico",
    name: "Jantar Romantico",
    description: "Um jantar especial para dois no destino da lua de mel.",
    priceCents: 15000,
    emoji: "♡",
    allowCustomAmount: false,
  },
  {
    id: "moveis",
    name: "Ajuda para Moveis",
    description: "Ajude a mobiliar e decorar nosso primeiro lar.",
    priceCents: 35000,
    emoji: "⌂",
    allowCustomAmount: false,
  },
  {
    id: "passeio",
    name: "Passeio na Viagem",
    description: "Patrocine uma experiencia especial na nossa viagem.",
    priceCents: 25000,
    emoji: "✦",
    allowCustomAmount: false,
  },
  {
    id: "enxoval",
    name: "Enxoval & Cama",
    description: "Contribua para o enxoval elegante do nosso novo lar.",
    priceCents: 18000,
    emoji: "❀",
    allowCustomAmount: false,
  },
  {
    id: "contribuicao-livre",
    name: "Contribuicao Livre",
    description: "Qualquer valor e muito bem-vindo e apreciado de coracao.",
    priceCents: null,
    emoji: "♥",
    allowCustomAmount: true,
  },
];

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
