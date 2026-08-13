/* ─────────────────────────────────────────────────────────────
   CONTEÚDO DINÂMICO
   Tudo que aparece por interação mora aqui.
   O texto estático fica no index.html.
   ───────────────────────────────────────────────────────────── */

const CONTEUDO = {

  /* 02 — cartas de gênero musical */
  generos: {
    aprovadoFim: 'compatibilidade musical: irresponsavelmente alta',
    nota: '+1 ponto para a teoria de que você está facilitando demais eu gostar de você.'
  },

  /* 03 — chocolate */
  chocolate: {
    doce:   'Resposta extremamente previsível.',
    amargo: 'Quem é você e o que fez com a minha princesa?',
    dica:   'tenta o outro. eu sei que você quer.'
  },

  /* 05 — carinho no Chico */
  chico: [
    'ele permitiu. dessa vez.',
    'ronronou. considero isso uma vitória diplomática.',
    'ele está te olhando. eu deixei de existir.',
    'ok, ele ganhou. eu aceito ser o segundo.',
    'conquista desbloqueada: mãe de pet mais linda do mundo.'
  ],
  chicoCores: ['#C81E3C', '#B44A3F', '#8E7A42', '#5E9A57', '#3FAE7A'],

  /* 06 — o relógio que enlouquece */
  relogio: [
    { valor: '43 minutos',       nota: 'previsível.' },
    { valor: '1 h 20 min',       nota: 'começou a ver os "recomendados para você".' },
    { valor: '2 h 07 min',       nota: 'o carrinho tem 41 itens. você vai comprar 2.' },
    { valor: 'ainda escolhendo', nota: 'eu já aceitei. pode continuar, princesa.' }
  ],

  /* 08 — easter egg do dicionário */
  bebe: {
    acerto: 'pronto. agora eu vou passar o dia inteiro sorrindo sozinho.',
    quase:  'quase. tenta de novo.',
    palavras: ['bebe', 'bebê', 'meu bem', 'amorzinho', 'meu bebe', 'meu bebê']
  },

  /* 10 — pétalas da rosa */
  petalas: [
    'pelo seu sorriso',
    'pelo seu jeitinho',
    'pelas nossas conversas',
    'porque você me chama de bebê',
    'porque eu gosto de te ouvir',
    'porque conhecer você está sendo uma surpresa muito boa',
    'porque sim, minha princesa',
    'essa pétala era para ter uma frase romântica. aí eu lembrei de você e perdi o raciocínio.'
  ],
  petalasFim: 'acabaram as pétalas. os motivos não.',

  /* 11 — NÃO CLIQUE */
  proibido: [
    'Eu falei pra não clicar.',
    'bebê.',
    'você tem sérios problemas com autoridade.',
    'tá bom.',
    'já que você insiste...',
    'VOCÊ É MUITO LINDA.',
    'pronto. era isso. pode continuar.'
  ],

  /* 13 — o botão que foge */
  fuga: [
    'não.',
    'nem tenta.',
    'ainda não.'
  ],
  fugaFinal: 'Achou mesmo que ia se livrar de mim assim?',

  /* corações escondidos */
  cupons: {
    1: 'vale 1 beijo',
    2: 'vale 1 chocolate doce',
    3: 'vale 1 rosa vermelha',
    4: 'esse aqui não vale nada. você só perdeu tempo mesmo.'
  }
};
