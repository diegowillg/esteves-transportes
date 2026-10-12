# Esteves Transportes — site

React + Vite, fonte Inter, logo oficial em `src/assets/` (self-hosted via @fontsource), ilustrações da frota em SVG próprio.

## Rodar

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # gera a pasta dist/ para hospedar

## Editar conteúdo

Todos os dados ficam em `src/data/site.js`:
- `company`: telefone, WhatsApp, e-mail, CNPJ, horário (placeholders)
- `bases`: Base 01 (galpão) e Base 02 (rodoviária), com endereço e as
  transportadoras de cada uma. Em cada transportadora, `own: true` marca a
  operação própria da Esteves e `own: false` as comissionadas; `mode` define
  o veículo mostrado (`caminhao`, `onibus`, `utilitario`).
- `audiences`, `stats`, `fleet`, `services`, `faq`: público, números, frota,
  serviços e perguntas

## Formulário de cotação

O formulário envia os pedidos para `company.quoteEmail` (em `src/data/site.js`)
usando o FormSubmit (formsubmit.co), sem precisar de servidor. No primeiro
envio chega um e-mail de ativação nesse endereço: clique em "Activate" uma
vez e os próximos pedidos chegam direto. Se o envio falhar, o site oferece
mandar pelo e-mail do cliente ou pelo WhatsApp.

Cores ficam no topo de `src/styles.css` (`--orange`, `--ink`...).
