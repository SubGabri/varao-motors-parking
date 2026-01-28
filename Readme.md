# 🚗 Varão Motors - Parking System

Sistema de gerenciamento de estacionamento desenvolvido para controlar o fluxo de veículos, cálculo de tarifas e histórico de pátio.

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo-green)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte do meu portfólio de desenvolvedor Front-end. O objetivo foi criar uma aplicação **Single Page (SPA)** funcional, sem uso de frameworks, focando na lógica pura do JavaScript e manipulação do DOM.

A aplicação simula o dia a dia da loja **Varão Motors**, permitindo entrada de veículos, consulta de valores com regras de negócio complexas e saída.

## 🚀 Funcionalidades

- **Controle de Entrada:** Validação de placas (Padrão Mercosul e Antigo) via Regex.
- **Cálculo de Tarifas:** - 15 min de tolerância (Grátis).
  - Preço fixo para as primeiras 3 horas.
  - Tarifação adicional por hora excedente.
- **Persistência de Dados:** Uso de `localStorage` para manter os dados salvos mesmo após fechar o navegador.
- **Dashboard em Tempo Real:** Tabela que atualiza automaticamente o tempo de permanência dos veículos.

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3** (Design Responsivo e Clean UI)
- **JavaScript (ES6+)**
  - ES Modules (Arquitetura modular: `core`, `storage`, `main`)
  - Arrow Functions
  - Array Methods (`filter`, `map`, `find`)
  - Intl.NumberFormat para formatação monetária

## 📦 Como rodar o projeto

1. Clone este repositório:
   \`\`\`bash
   git clone https://github.com/SEU-USUARIO/varao-motors-parking.git
   \`\`\`
2. Como o projeto utiliza **ES Modules**, é necessário rodá-lo através de um servidor local (para evitar bloqueio de CORS do navegador).
   - Se usar VS Code, instale a extensão **Live Server**.
   - Clique com botão direito no `index.html` e escolha "Open with Live Server".

## 👨‍💻 Autor

Desenvolvido por **[Gabriel Messias]**.
Entre em contato: [Seu LinkedIn]
