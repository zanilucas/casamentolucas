export type Gift = {
  id: string;
  name: string;
  description: string;
  price_cents: number | null;
  emoji: string | null;
  allow_custom_amount: boolean;
  active: boolean;
};

export type RsvpPayload = {
  fullName: string;
  whatsapp?: string;
  attending: "sim" | "nao";
  companionsCount: number;
  companionsNames?: string;
  notes?: string;
};
