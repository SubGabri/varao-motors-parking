// js/tests.js
import { calcularPagamento, TARIFAS } from "./core.js";

console.group("🧪 Testes do Sistema de Cobrança");

// Cenário 1: 10 minutos (Carência)
const t1 = new Date().getTime() - 10 * 60000; // 10 min atrás
const r1 = calcularPagamento(t1);
console.assert(
  r1.valor === 0,
  `ERRO: 10 min deveria ser R$0. Deu: ${r1.valor}`,
);
if (r1.valor === 0) console.log("✅ 10 min: Grátis (OK)");

// Cenário 2: 2 horas (Fixo)
const t2 = new Date().getTime() - 120 * 60000; // 120 min atrás
const r2 = calcularPagamento(t2);
console.assert(
  r2.valor === TARIFAS.VALOR_FIXO,
  `ERRO: 2h deveria ser ${TARIFAS.VALOR_FIXO}. Deu: ${r2.valor}`,
);
if (r2.valor === TARIFAS.VALOR_FIXO) console.log("✅ 2h: Valor Fixo (OK)");

// Cenário 3: 3h e 01 min (Fixo + 1h Extra)
// Isso testa se seu Math.ceil está funcionando para frações de hora
const t3 = new Date().getTime() - 181 * 60000;
const esperado = TARIFAS.VALOR_FIXO + TARIFAS.VALOR_HORA_EXTRA;
const r3 = calcularPagamento(t3);
console.assert(
  r3.valor === esperado,
  `ERRO: 3h01min deveria ser ${esperado}. Deu: ${r3.valor}`,
);
if (r3.valor === esperado) console.log("✅ 3h01min: Cobrou hora extra (OK)");

console.groupEnd();
