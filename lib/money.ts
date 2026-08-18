// Prices are stored in лв (BGN). During Bulgaria's euro transition we show both
// currencies side by side, e.g. "34.77 €/68 лв", using the official fixed rate.
export const BGN_PER_EUR = 1.95583;

const eur = (bgn: number) => (bgn / BGN_PER_EUR).toFixed(2);

// Totals and any amount that may have stotinki, e.g. "98.68 €/193,00 лв".
export const money = (bgn: number) => `${eur(bgn)} €/${bgn.toFixed(2).replace(".", ",")} лв`;

// Whole-number product prices, e.g. "34.77 €/68 лв".
export const price = (bgn: number) =>
  `${eur(bgn)} €/${Math.round(bgn).toLocaleString("bg-BG")} лв`;

// Product prices are entered in € in the admin, but stored/charged in лв.
// These convert between the two (rounded to stotinki).
export const eurToBgn = (e: number) => Math.round(e * BGN_PER_EUR * 100) / 100;
export const bgnToEur = (bgn: number) => Math.round((bgn / BGN_PER_EUR) * 100) / 100;
