// js/core.js

export const TARIFAS = {
  CARENCIA_MIN: 15, // Até 15 min não paga
  PERIODO_FIXO_H: 3, // Primeiras 3 horas
  VALOR_FIXO: 15.0, // Valor fechado das 3h
  VALOR_HORA_EXTRA: 5.0, // Valor por hora adicional
};

/**
 * Formata um número para moeda brasileira (BRL).
 * @param {number} valor - O valor numérico (ex: 15.5)
 * @returns {string} - O valor formatado (ex: "R$ 15,50")
 */
export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Calcula o valor a ser pago com base na hora de entrada.
 * Regra: 15min carência | 3h fixas | Horas adicionais (fração conta como cheia).
 * * @param {number} horaEntrada - Timestamp (ms) da entrada
 * @returns {Object} { minutos: number, valor: number, resumo: string }
 */
export function calcularPagamento(horaEntrada) {
  const agora = new Date().getTime();

  // Proteção contra datas futuras (relógio desajustado)
  if (agora < horaEntrada) {
    console.warn("Atenção: Hora de entrada no futuro. Ajustando para agora.");
    return { minutos: 0, valor: 0, resumo: "Erro Relógio" };
  }

  const diffMs = agora - horaEntrada;
  const minutosTotais = Math.ceil(diffMs / 60000); // Arredonda min para cima

  // Regra 1: Carência (Grátis)
  if (minutosTotais <= TARIFAS.CARENCIA_MIN) {
    return {
      minutos: minutosTotais,
      valor: 0,
      resumo: `Grátis (${minutosTotais} min)`,
    };
  }

  // Regra 2: Período Fixo
  const minutosFixo = TARIFAS.PERIODO_FIXO_H * 60;
  if (minutosTotais <= minutosFixo) {
    return {
      minutos: minutosTotais,
      valor: TARIFAS.VALOR_FIXO,
      resumo: `Fixo ${TARIFAS.PERIODO_FIXO_H}h`,
    };
  }

  // Regra 3: Hora Extra
  const tempoExtra = minutosTotais - minutosFixo;
  // Math.ceil aplica a regra de cobrança por hora cheia iniciada.
  // Ex: 3h e 01min = Paga 3h + 1h extra. É o padrão de mercado.
  const horasExtras = Math.ceil(tempoExtra / 60);
  const total = TARIFAS.VALOR_FIXO + horasExtras * TARIFAS.VALOR_HORA_EXTRA;

  return {
    minutos: minutosTotais,
    valor: total,
    resumo: `${TARIFAS.PERIODO_FIXO_H}h + ${horasExtras}h ex.`,
  };
}
