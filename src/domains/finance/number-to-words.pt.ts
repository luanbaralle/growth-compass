const UNITS = [
  "",
  "um",
  "dois",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
  "dez",
  "onze",
  "doze",
  "treze",
  "quatorze",
  "quinze",
  "dezesseis",
  "dezessete",
  "dezoito",
  "dezenove",
];

const TENS = [
  "",
  "",
  "vinte",
  "trinta",
  "quarenta",
  "cinquenta",
  "sessenta",
  "setenta",
  "oitenta",
  "noventa",
];

const HUNDREDS = [
  "",
  "cento",
  "duzentos",
  "trezentos",
  "quatrocentos",
  "quinhentos",
  "seiscentos",
  "setecentos",
  "oitocentos",
  "novecentos",
];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";

  const hundred = Math.floor(n / 100);
  const remainder = n % 100;
  const parts: string[] = [];

  if (hundred > 0) parts.push(HUNDREDS[hundred]);

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(UNITS[remainder]);
    } else {
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;
      parts.push(unit > 0 ? `${TENS[ten]} e ${UNITS[unit]}` : TENS[ten]);
    }
  }

  return parts.join(" e ");
}

function integerToWords(n: number): string {
  if (n === 0) return "zero";

  const scales = [
    { value: 1_000_000, singular: "milhão", plural: "milhões" },
    { value: 1_000, singular: "mil", plural: "mil" },
  ];

  let remaining = n;
  const parts: string[] = [];

  for (const scale of scales) {
    const count = Math.floor(remaining / scale.value);
    if (count === 0) continue;

    const label = count === 1 ? scale.singular : scale.plural;
    if (scale.value === 1_000 && count === 1) {
      parts.push("mil");
    } else {
      parts.push(`${chunkToWords(count)} ${label}`.trim());
    }
    remaining %= scale.value;
  }

  if (remaining > 0) {
    parts.push(chunkToWords(remaining));
  }

  return parts.join(" e ");
}

export function centsToWordsPt(cents: number): string {
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;

  const reaisPart =
    reais === 1 ? "um real" : `${integerToWords(reais)} reais`;

  if (centavos === 0) return reaisPart;

  const centavosPart =
    centavos === 1
      ? "um centavo"
      : `${integerToWords(centavos)} centavos`;

  return `${reaisPart} e ${centavosPart}`;
}
