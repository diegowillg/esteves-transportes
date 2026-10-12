// ------------------------------------------------------------------
// DADOS DO SITE - edite aqui. Tudo marcado como placeholder deve ser
// trocado pelos dados reais da Esteves Transportes.
// ------------------------------------------------------------------

import pantanalOnca from '../assets/pantanal-onca.webp'
import pantanalNome from '../assets/pantanal-nome.webp'
import sateliteLogoClaro from '../assets/satelite-norte-logo-claro.webp' // para fundo branco
import estrelaLogo from '../assets/estrela-logo.webp'
import estevesLogoH from '../assets/logo-esteves-h.png'
import pantanalNomeClaro from '../assets/pantanal-nome-claro.webp'

export const company = {
  name: 'Esteves Transportes',
  cnpj: '04.069.036/0001-82',
  phone: '(00) 0000-0000', // placeholder
  whatsappLabel: '(00) 00000-0000', // placeholder
  whatsapp: '5500000000000', // placeholder - formato internacional, só números
  email: 'contato@estevestransportes.com.br', // placeholder
  // E-mail que recebe os pedidos de cotação enviados pelo formulário.
  // No primeiro envio o FormSubmit manda um e-mail de ativação para este
  // endereço: basta clicar em "Activate" uma única vez.
  quoteEmail: 'cotacao@estevestransportes.com.br', // placeholder
  // E-mail que recebe as propostas de transportadoras interessadas em ter a Esteves como filial
  partnersEmail: 'comercial@estevestransportes.com.br', // placeholder
  // E-mail que recebe os currículos do "Trabalhe conosco"
  careersEmail: 'rh@estevestransportes.com.br', // placeholder
  hours: 'Seg a Sex · 9h às 18h · intervalo das 12h às 14h',
  founded: '2000',
}

// Assinatura de quem desenvolveu o site (rodapé).
export const developer = {
  name: '@diego.dev_',
  url: 'https://www.instagram.com/diego.dev_/',
}

export const whatsappTo = (number, text) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const whatsappLink = (text) => whatsappTo(company.whatsapp, text)

// Modos de transporte usados nas bases.
export const modes = {
  caminhao: { label: 'Caminhão', short: 'Caminhão', vehicle: 'carreta' },
  onibus: { label: 'Via ônibus', short: 'Ônibus', vehicle: 'onibus' },
  utilitario: { label: 'Utilitário dedicado', short: 'Utilitário', vehicle: 'strada' },
}

// own: true  -> operação da própria Esteves Transportes
// own: false -> transportadora atendida como filial comissionada
export const bases = [
  {
    id: '01',
    kind: 'Galpão',
    city: 'Uberaba',
    uf: 'MG',
    address: 'R. Adail Gomes Ferreira, 593 - Jardim Maracanã',
    cep: '38041-006',
    phone: '(00) 0000-0001', // placeholder
    hours: 'Seg a Sex · 9h às 18h',
    break: 'Intervalo das 12h às 14h',
    maps: 'https://www.google.com/maps/search/?api=1&query=R.+Adail+Gomes+Ferreira,+593,+Uberaba+-+MG,+38041-006',
    summary: 'Recebimento, conferência e expedição de cargas que seguem por caminhão e utilitário.',
    partners: [
      {
        code: 'ESV',
        name: 'Esteves Transportes',
        logo: estevesLogoH,
        own: true,
        mode: 'utilitario',
        scope: 'Utilitário dedicado e caminhão com rota própria',
      },
      {
        code: 'PAN',
        name: 'Pantanal',
        subtitle: 'Operador Multimodal',
        wordmark: true,
        whatsapp: '5500000000001', // placeholder - WhatsApp de atendimento da Pantanal
        whatsappLabel: '(00) 00000-0001', // placeholder
        logo: pantanalNomeClaro,
        // pintura da carreta com a identidade da Pantanal
        livery: { body: '#0b0c0a', accent: '#8cf52c', spots: '#18230f', mark: pantanalOnca, word: pantanalNome },
        own: false,
        mode: 'caminhao',
        scope: 'Cargas expedidas por caminhão',
      },
    ],
  },
  {
    id: '02',
    kind: 'Rodoviária',
    city: 'Uberaba',
    uf: 'MG',
    address: 'Terminal Rodoviário - Praça Dr. Carlos Terra, 1 · Box 00', // placeholder: número do box
    cep: '',
    phone: '(00) 0000-0002', // placeholder
    hours: 'Seg a Sex · 9h às 18h',
    break: 'Intervalo das 12h às 14h',
    maps: 'https://www.google.com/maps/search/?api=1&query=Terminal+Rodovi%C3%A1rio+Pra%C3%A7a+Dr.+Carlos+Terra,+1,+Uberaba+-+MG',
    summary: 'Despacho e retirada de encomendas que seguem no bagageiro dos ônibus de linha.',
    partners: [
      {
        code: 'SAT',
        name: 'Satélite Norte',
        whatsapp: '5500000000002', // placeholder
        whatsappLabel: '(00) 00000-0002', // placeholder
        logo: sateliteLogoClaro,
        wordmark: true, // a logo já traz o nome escrito
        own: false,
        mode: 'onibus',
        scope: 'Encomendas via ônibus',
        coach: { deck: 'double', paint: 'sateliteNorte' }, // double deck 3 eixos
        livery: { accent: '#2ba9c2' }, // usado só no brilho de fundo do card
      },
      {
        code: 'EST',
        name: 'Estrela',
        whatsapp: '5500000000003', // placeholder
        whatsappLabel: '(00) 00000-0003', // placeholder
        logo: estrelaLogo,
        wordmark: true,
        own: false,
        mode: 'onibus',
        scope: 'Encomendas via ônibus',
        coach: { deck: 'single', paint: 'estrela' }, // rodoviário de um andar, 2 eixos
        livery: { accent: '#f5b81c' }, // usado só no brilho de fundo do card
      },
    ],
  },
]

// Lista usada na janela "Com qual empresa quer falar?" dos botões de WhatsApp.
export const contacts = bases.flatMap((b) =>
  b.partners.map((p) => ({
    code: p.code,
    name: p.subtitle ? `${p.name} ${p.subtitle}` : p.name,
    logo: p.logo,
    own: p.own,
    base: `Base ${b.id} · ${b.kind}`,
    mode: p.mode,
    whatsapp: p.own ? company.whatsapp : p.whatsapp,
    whatsappLabel: p.own ? company.whatsappLabel : p.whatsappLabel,
  }))
)

// Acesso rápido a uma transportadora pelo código (ex.: partnerByCode.PAN.livery).
export const partnerByCode = Object.fromEntries(bases.flatMap((b) => b.partners.map((p) => [p.code, p])))

export const totalPartners = bases.reduce((n, b) => n + b.partners.length, 0)
export const commissioned = bases.reduce((n, b) => n + b.partners.filter((p) => !p.own).length, 0)

export const stats = [
  { value: String(bases.length).padStart(2, '0'), label: 'bases: galpão e rodoviária' },
  { value: String(commissioned).padStart(2, '0'), label: 'transportadoras atendidas como filial' },
  { value: String(new Date().getFullYear() - Number(company.founded)), label: `anos de estrada, desde ${company.founded}` },
  { value: 'PF·PJ', label: 'atendemos pessoas físicas e empresas' },
]

export const audiences = [
  {
    title: 'Pessoa física',
    tag: 'CPF',
    text: 'Envio de volumes, mudanças pequenas, compras e encomendas para família e amigos na região.',
  },
  {
    title: 'Distribuidoras de peças',
    tag: 'CNPJ',
    text: 'Autopeças, peças agrícolas e industriais com entrega recorrente para oficinas e revendas.',
  },
  {
    title: 'Comércio e indústria',
    tag: 'CNPJ',
    text: 'Reposição de lojas, materiais, insumos e carga fracionada com nota fiscal.',
  },
]

export const steps = [
  {
    n: '01',
    title: 'Peça a cotação',
    text: 'Preencha o formulário com cidade, mercadoria, peso e valor da nota.',
    icon: 'check',
  },
  {
    n: '02',
    title: 'Receba o valor',
    text: 'Um atendente retorna com preço e prazo pelo WhatsApp ou e-mail, como você preferir.',
    icon: 'chat',
  },
  {
    n: '03',
    title: 'Coleta ou entrega na base',
    text: 'Buscamos a mercadoria com você ou você entrega numa das nossas bases.',
    icon: 'dock',
  },
  {
    n: '04',
    title: 'Entrega no destino',
    text: 'A carga segue de ônibus, caminhão ou utilitário até o destinatário.',
    icon: 'pin',
  },
]

export const services = [
  { title: 'Encomendas via ônibus', text: 'Despacho na nossa base da rodoviária: volumes seguem no bagageiro dos ônibus de linha, com saídas diárias.' },
  { title: 'Carga fracionada', text: 'Você paga só pelo espaço que usa. Ideal para distribuidoras que enviam para vários clientes.' },
  { title: 'Rota própria dedicada', text: 'Strada / Fiorino e caminhão da Esteves fazendo rotas próprias, com o mesmo motorista e frequência fixa.' },
  { title: 'Coleta no endereço', text: 'Buscamos a mercadoria na sua casa, loja ou depósito e levamos até a base.' },
  { title: 'Autopeças e reposição', text: 'Rotas recorrentes para distribuidoras de peças atenderem oficinas e revendas da região.' },
  { title: 'Atendimento por pessoas', text: 'Cotação e acompanhamento da carga feitos por atendentes, pelo WhatsApp ou e-mail.' },
]

// Frota por transportadora (seção "Frota"). `vehicle` usa as ilustrações de
// Vehicles.jsx; `coach` usa o ônibus de Coach.jsx; `livery` aplica a pintura
// da parceira na carreta.
export const fleetByCompany = [
  {
    code: 'ESV',
    name: 'Esteves Transportes',
    shortName: 'Esteves',
    logo: estevesLogoH,
    base: 'Base 01 · Galpão',
    text: 'Operação própria da Esteves: utilitário dedicado e caminhão, cada um com sua rota.',
    vehicles: [
      {
        key: 'fiorino',
        vehicle: 'fiorino',
        brand: true,
        name: 'Fiat Fiorino',
        tag: 'Utilitário dedicado',
        payload: '650 kg',
        volume: '3,3 m³',
        use: 'Carro dedicado que faz rota própria, com entregas e coletas em casas, lojas e oficinas.',
      },
      {
        key: 'strada',
        vehicle: 'strada',
        brand: true,
        name: 'Fiat Strada',
        tag: 'Utilitário dedicado',
        payload: '700 kg',
        volume: 'Capota alta',
        use: 'Carro dedicado com capota alta, para rota própria em bairros, zona rural e estradas de terra.',
      },
      {
        key: 'caminhao',
        vehicle: 'delivery',
        brand: true,
        name: 'VW Delivery',
        tag: 'Caminhão leve com baú',
        payload: 'até 7,3 t',
        volume: '≈ 28 m³',
        use: 'Caminhão VW Delivery da Esteves, com baú, que faz uma rota própria saindo do galpão.',
      },
    ],
  },
  {
    code: 'PAN',
    name: 'Pantanal Operador Multimodal',
    shortName: 'Pantanal',
    logo: pantanalNomeClaro,
    base: 'Base 01 · Galpão',
    text: 'Cargas da Pantanal recebidas no galpão e expedidas por caminhão.',
    vehicles: [
      {
        key: 'pan-carreta',
        vehicle: 'carreta',
        brand: false,
        livery: 'PAN',
        name: 'Carreta baú',
        tag: 'Caminhão',
        payload: '27 t',
        volume: '90 m³',
        use: 'Carreta da Pantanal que leva as cargas despachadas no galpão da Esteves.',
      },
    ],
  },
  {
    code: 'SAT',
    name: 'Satélite Norte',
    shortName: 'Satélite Norte',
    logo: sateliteLogoClaro,
    base: 'Base 02 · Rodoviária',
    text: 'Encomendas despachadas na rodoviária e levadas no bagageiro dos ônibus da Satélite Norte.',
    vehicles: [
      {
        key: 'sat-dd',
        coach: { deck: 'double', paint: 'sateliteNorte' },
        name: 'Ônibus double deck',
        tag: 'Via ônibus',
        payload: 'Volumes até 30 kg',
        volume: 'Bagageiro',
        use: 'Ônibus de linha com saídas diárias; as encomendas viajam no bagageiro.',
      },
    ],
  },
  {
    code: 'EST',
    name: 'Estrela Encomendas',
    shortName: 'Estrela',
    logo: estrelaLogo,
    base: 'Base 02 · Rodoviária',
    text: 'Encomendas despachadas na rodoviária e levadas no bagageiro dos ônibus da Estrela.',
    vehicles: [
      {
        key: 'est-coach',
        coach: { deck: 'single', paint: 'estrela' },
        name: 'Ônibus rodoviário',
        tag: 'Via ônibus',
        payload: 'Volumes até 30 kg',
        volume: 'Bagageiro',
        use: 'Ônibus de linha com saídas diárias; as encomendas viajam no bagageiro.',
      },
    ],
  },
]

export const faq = [
  {
    q: 'Vocês atendem pessoa física?',
    a: 'Sim. Atendemos pessoas físicas (CPF) e empresas (CNPJ), como distribuidoras de peças, comércio e indústria.',
  },
  {
    q: 'Como localizo minha mercadoria?',
    a: 'A localização é feita pelos nossos atendentes. Chame no WhatsApp com o número da nota fiscal ou o nome do remetente e informamos onde está a sua carga.',
  },
  {
    q: 'O que preciso informar para cotar um frete?',
    a: 'Cidade de origem e destino, o que é a mercadoria, peso aproximado e valor da nota fiscal. Com isso o atendente calcula preço e prazo.',
  },
  {
    q: 'Em quanto tempo recebo a cotação?',
    a: 'Respondemos em horário comercial, normalmente no mesmo dia, pelo canal que você escolher no formulário: WhatsApp ou e-mail.',
  },
  {
    q: 'Quais veículos fazem o transporte?',
    a: 'Depende do destino: pela rodoviária as encomendas seguem no bagageiro de ônibus; pelo galpão a carga segue de caminhão ou no utilitário dedicado (Strada / Fiorino) da Esteves.',
  },
]
