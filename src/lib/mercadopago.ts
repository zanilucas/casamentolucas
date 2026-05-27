import { MercadoPagoConfig } from "mercadopago";

export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Configure MERCADO_PAGO_ACCESS_TOKEN no .env.local.");
  }

  return new MercadoPagoConfig({ accessToken });
}
