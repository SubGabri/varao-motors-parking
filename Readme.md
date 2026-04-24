# 🚗 Varão Motors - Parking System v2.5

Sistema de gerenciamento de estacionamento profissional desenvolvido para controlar o fluxo de veículos, cálculo automático de tarifas e inteligência de dados com exportação de relatórios.

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Atualização-blue)
![JavaScript](https://img.shields.io/badge/JS-ES6+-yellow)
![Version](https://img.shields.io/badge/Version-2.5-orange)

## 📋 Sobre o Projeto

Este projeto integra meu portfólio de desenvolvedor Front-end, focado em resolver problemas reais de logística e faturamento. A aplicação é uma **SPA (Single Page Application)** construída com JavaScript puro (Vanilla JS), aplicando conceitos avançados de manipulação de DOM e arquitetura modular.

Originalmente criado para a loja **Varão Motors**, o sistema evoluiu de um simples controle de entrada para uma ferramenta de gestão com simulador financeiro e exportação de dados para contabilidade.

## 🚀 Novas Funcionalidades (v2.5)

- **📈 Simulador de Estadia:** Card exclusivo para simulação de valores. Permite calcular orçamentos rapidamente antes mesmo da entrada do veículo.
- **📊 Exportação para Excel:** Integração com a biblioteca SheetJS para gerar relatórios profissionais `.xlsx` do histórico de veículos, incluindo placa, entrada, saída e valor pago.
- **💰 Gestão de Faturamento:** Dashboard com cálculo de lucro diário e fechamento mensal automático.
- **👁️ Modo de Privacidade:** Função "olhinho" para ocultar/exibir o faturamento total, garantindo discrição no ambiente de trabalho.

## ⚙️ Funcionalidades Core

- **Controle de Entrada:** Validação rigorosa de placas (Padrão Mercosul e Antigo) via Regex.
- **Regras de Negócio Complexas:** - 15 min de tolerância (Grátis).
  - Tarifação progressiva (Preço fixo inicial + horas adicionais).
- **Persistência de Dados:** Uso de `localStorage` com tratamento de erros (Versão Blindada).
- **Dashboard em Tempo Real:** Atualização automática do tempo de permanência a cada minuto.

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3** (CSS Variables, Flexbox, Grid e Design Responsivo)
- **JavaScript (ES6+)**
  - **ES Modules:** Arquitetura modular separando `core`, `storage`, `main` e `ui`.
  - **SheetJS (XLSX):** Biblioteca externa para geração de planilhas.
  - **LocalStorage API:** Para persistência de dados local.

## 📦 Como rodar o projeto

1. Clone este repositório:

   ```bash
   git clone [https://github.com/SubGabri/varao-motors-parking.git](https://github.com/SubGabri/varao-motors-parking.git)

   👨‍💻 Autor
   Desenvolvido por Gabriel Messias.
   ```
