export const couple = {
  names: "Adrieli & Lucas",
  brideFirstName: "Adrieli",
  groomFirstName: "Lucas",
  date: "21 de novembro de 2026",
  weekDay: "Sabado",
  time: "10h00",
  ceremony: "Paroquia Sagrada Familia",
  ceremonyAddress: "R. Manoel Lopes, 1585 - Centro, Lucelia - SP",
  party: "Recanto Uniao",
  partyAddress: "Bairro Uniao - Lucelia - SP",
  ceremonyMapsUrl: "https://maps.app.goo.gl/UGHZVb4AkggGjSRe8",
  partyMapsUrl: "https://maps.app.goo.gl/paaR7vce81LvbKXeA",
  rsvpDeadline: "20 de outubro de 2026",
  welcome:
    "Com o coracao cheio de alegria, convidamos voce para celebrar conosco o inicio da nossa vida a dois. Sera uma manha especial, preparada com amor, fe e gratidao, e a sua presenca tornara esse momento ainda mais inesquecivel.",
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
