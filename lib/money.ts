// Prices are stored in лв (BGN). During Bulgaria's euro transition we show both
// currencies side by side, e.g. "34.77 €/68 лв", using the official fixed rate.
export const BGN_PER_EUR = 1.95583;

const eur = (bgn: number) => (bgn / BGN_PER_EUR).toFixed(2);

// All amounts are shown in euro only, e.g. "98.68 €". Prices are stored in лв
// internally (and Stripe charges the euro equivalent), but лв is never displayed.
export const money = (bgn: number) => `${eur(bgn)} €`;

// Product prices, also euro only, e.g. "34.77 €".
export const price = (bgn: number) => `${eur(bgn)} €`;

// Product prices are entered in € in the admin, but stored/charged in лв.
// These convert between the two (rounded to stotinki).
export const eurToBgn = (e: number) => Math.round(e * BGN_PER_EUR * 100) / 100;
export const bgnToEur = (bgn: number) => Math.round((bgn / BGN_PER_EUR) * 100) / 100;

// A лв amount shown as a clean € figure, e.g. 100 лв → "51.13", 50 лв → "25.56".
// Whole euro values drop the decimals. Used for the free-shipping threshold.
export const eurAmount = (bgn: number) => {
  const n = bgnToEur(bgn);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};
