/* ─────────────────────────────────────────────────────────────
   LÓGICA
   ───────────────────────────────────────────────────────────── */

const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function mostrar(el, texto) {
  if (!el) return;
  el.textContent = texto;
  el.classList.add('visivel');
}

function reanimar(el, classe, ms) {
  if (!el || semMovimento) return;
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
  if (ms) setTimeout(() => el.classList.remove(classe), ms);
}

/* ══════════ TRAVAS ══════════ */
const Travas = {
  estado: {},
  registrar(nome) { this.estado[nome] = false; },
  cumprir(nome, texto = 'pronto — pode continuar rolando') {
    if (this.estado[nome]) return;
    this.estado[nome] = true;
    const aviso = $(`[data-instrucao="${nome}"]`);
    if (aviso) {
      aviso.classList.add('instrucao--concluida');
      aviso.innerHTML = `${texto} <span class="instrucao__seta">↓</span>`;
    }
    Pista.atualizar();
  },
  pendente(nome) { return this.estado[nome] === false; }
};

/* ══════════ PISTA FIXA ══════════ */
const Pista = {
  el: null, texto: null, seta: null, capAtual: null,
  iniciar() {
    this.el = $('[data-pista]');
    this.texto = $('[data-pista-texto]');
    this.seta = $('[data-pista-seta]');
    if (!this.el) return;
    let tick = false;
    window.addEventListener('scroll', () => {
      if (!tick) { tick = true; requestAnimationFrame(() => { this.atualizar(); tick = false; }); }
    }, { passive: true });
    setTimeout(() => this.atualizar(), 1200);
  },
  definirCapitulo(sec) { this.capAtual = sec; this.atualizar(); },
  atualizar() {
    if (!this.el) return;
    const fim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
    const trava = this.capAtual && this.capAtual.dataset.trava;
    if (fim) { this.el.classList.remove('visivel'); return; }
    if (trava && Travas.pendente(trava)) {
      this.el.classList.add('aguardando');
      this.texto.textContent = 'tem um botão te esperando';
      this.seta.textContent = '✦';
    } else {
      this.el.classList.remove('aguardando');
      this.texto.textContent = 'continue rolando';
      this.seta.textContent = '↓';
    }
    this.el.classList.add('visivel');
  }
};

/* ══════════ AMBIENTE ══════════ */
const Ambiente = {
  raiz: document.documentElement,
  meta: null,
  aplicar(sec) {
    if (!sec) return;
    if (sec.dataset.tom) {
      this.raiz.style.setProperty('--ambiente', sec.dataset.tom);
      if (this.meta) this.meta.setAttribute('content', sec.dataset.tom);
    }
    if (sec.dataset.brilho) this.raiz.style.setProperty('--brilho', sec.dataset.brilho);
    if (sec.dataset.brilhoBaixo) this.raiz.style.setProperty('--brilho-baixo', sec.dataset.brilhoBaixo);
    Pista.definirCapitulo(sec);
  },
  iniciar() {
    this.meta = $('meta[name="theme-color"]');
    const secoes = $$('.cap');
    if (!('IntersectionObserver' in window)) { this.aplicar(secoes[0]); return; }
    const obs = new IntersectionObserver((entradas) => {
      let melhor = null;
      entradas.forEach(e => {
        if (e.isIntersecting && (!melhor || e.intersectionRatio > melhor.intersectionRatio)) melhor = e;
      });
      if (melhor) this.aplicar(melhor.target);
    }, { threshold: [0.35, 0.55, 0.75] });
    secoes.forEach(s => obs.observe(s));
    this.aplicar(secoes[0]);
  }
};

/* ══════════ ABALO E LUZ ══════════ */
function abalar(forca = 6) {
  if (semMovimento) return;
  const palco = $('main');
  palco.style.setProperty('--forca', forca + 'px');
  reanimar(palco, 'abalo', 620);
}

function acender(cor = '', suave = false) {
  if (semMovimento) return;
  const luz = $('[data-clarao]');
  if (!luz) return;
  luz.className = 'clarao' + (cor ? ' clarao--' + cor : '');
  void luz.offsetWidth;
  luz.classList.add('acende');
  if (suave) luz.classList.add('acende--suave');
  setTimeout(() => { luz.className = 'clarao' + (cor ? ' clarao--' + cor : ''); }, 1300);
}

/* chuva de corações — usada no capítulo 08 */
function chuvaDeCoracoes(qtd = 16) {
  if (semMovimento) return;
  const palco = $('[data-coracoes]');
  if (!palco) return;
  const simbolos = ['♥', '♥', '♥', '❥', '♡'];
  for (let i = 0; i < qtd; i++) {
    const c = document.createElement('span');
    c.className = 'coracao';
    c.textContent = simbolos[i % simbolos.length];
    c.style.left = (8 + Math.random() * 84) + '%';
    c.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
    c.style.setProperty('--giro', (Math.random() * 50 - 25).toFixed(0) + 'deg');
    c.style.setProperty('--dur', (3.4 + Math.random() * 2.2).toFixed(2) + 's');
    c.style.setProperty('--atraso', (Math.random() * 1.1).toFixed(2) + 's');
    c.style.fontSize = (0.9 + Math.random() * 1.5).toFixed(2) + 'rem';
    c.style.opacity = 0;
    palco.appendChild(c);
    setTimeout(() => c.remove(), 7000);
  }
}

/* ══════════ REVEALS ══════════ */
function iniciarReveals() {
  const alvos = $$('.reveal');
  $$('.cap').forEach(cap => {
    $$('.reveal', cap).forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8)));
  });
  if (semMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(el => el.classList.add('dentro'));
    return;
  }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('dentro'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  alvos.forEach(el => obs.observe(el));
}

/* ══════════ PROGRESSO ══════════ */
function iniciarProgresso() {
  const linha = $('.progresso__linha');
  if (!linha) return;
  let tick = false;
  const atualizar = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    linha.style.width = Math.min(total > 0 ? (window.scrollY / total) * 100 : 0, 100) + '%';
    tick = false;
  };
  window.addEventListener('scroll', () => {
    if (!tick) { tick = true; requestAnimationFrame(atualizar); }
  }, { passive: true });
  atualizar();
}

/* ══════════ NAVEGAÇÃO ══════════ */
function iniciarNavegacao() {
  $$('[data-ir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const alvo = $(btn.dataset.ir);
      if (alvo) alvo.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ══════════════════════════════════════════════════════
   02 · CARTAS DE GÊNERO
   ══════════════════════════════════════════════════════ */
function iniciarCartas() {
  Travas.registrar('generos');
  const cartas = $$('[data-genero]');
  const painel = $('[data-veredito-final]');
  const valor = $('[data-veredito-valor]');
  if (!cartas.length) return;

  let viradas = 0;

  cartas.forEach(carta => {
    carta.addEventListener('click', () => {
      if (carta.classList.contains('virada')) return;
      carta.classList.add('virada', carta.dataset.veredito);
      viradas++;

      if (carta.dataset.veredito === 'aprovado') acender('verde');
      else abalar(5);

      if (viradas === cartas.length) {
        setTimeout(() => {
          painel.hidden = false;
          void painel.offsetWidth;
          painel.classList.add('visivel');
          valor.textContent = CONTEUDO.generos.aprovadoFim;
          acender('verde', true);
          Travas.cumprir('generos', 'combinamos até demais. continue rolando');
        }, 500);
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   03 · CHOCOLATE
   ══════════════════════════════════════════════════════ */
function iniciarChocolate() {
  Travas.registrar('chocolate');

  const caixa = $('[data-contador]');
  const num = $('[data-contador-num]');
  const rotulo = $('[data-contador-rotulo]');
  const resposta = $('[data-chocolate-resposta]');
  const dica = $('[data-chocolate-dica]');
  const btnDoce = $('[data-chocolate="doce"]');
  let caiu = false;

  const derrubar = () => {
    if (caiu || !num) return;
    caiu = true;
    let v = 100;
    const passo = () => {
      v -= 1;
      num.textContent = v;
      if (v > 98) setTimeout(passo, 260);
      else {
        caixa.classList.add('caiu');
        if (rotulo) rotulo.textContent = 'compatibilidade geral · revisada';
      }
    };
    setTimeout(passo, 700);
  };

  if (caixa) {
    if (semMovimento || !('IntersectionObserver' in window)) derrubar();
    else {
      const obs = new IntersectionObserver(e => {
        if (e[0].isIntersecting) { derrubar(); obs.disconnect(); }
      }, { threshold: 0.6 });
      obs.observe(caixa);
    }
  }

  $$('[data-chocolate]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.chocolate;
      $$('[data-chocolate]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      resposta.classList.remove('visivel');
      dica.classList.remove('visivel');

      if (tipo === 'doce') {
        // pop + piscada verde
        reanimar(btn, 'pop', 700);
        btn.classList.add('aprovado');
        acender('verde');
        if (btnDoce) btnDoce.classList.remove('chamando');
        setTimeout(() => mostrar(resposta, CONTEUDO.chocolate.doce), 140);
        Travas.cumprir('chocolate', 'previsível e perfeita. continue rolando');
      } else {
        // shake + sugere o outro botão
        abalar(9);
        setTimeout(() => {
          mostrar(resposta, CONTEUDO.chocolate.amargo);
          setTimeout(() => {
            mostrar(dica, CONTEUDO.chocolate.dica);
            if (btnDoce) btnDoce.classList.add('chamando');
          }, 900);
        }, 140);
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   04 · ALTURAS
   ══════════════════════════════════════════════════════ */
function iniciarAlturas() {
  const alvo = $('[data-alturas]');
  if (!alvo) return;
  if (semMovimento || !('IntersectionObserver' in window)) { alvo.classList.add('animou'); return; }
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { alvo.classList.add('animou'); obs.disconnect(); }
  }, { threshold: 0.4 });
  obs.observe(alvo);
}

/* ══════════════════════════════════════════════════════
   05 · CHICO — balanço suave + botão que cresce e esverdeia
   ══════════════════════════════════════════════════════ */
function iniciarChico() {
  Travas.registrar('chico');
  const btn = $('[data-chico]');
  const resposta = $('[data-chico-resposta]');
  const cabeca = $('[data-chico-cabeca]');
  const svg = $('[data-chico-svg]');
  const secao = $('#cap-05');
  if (!btn) return;

  let i = 0;
  const total = CONTEUDO.chico.length;

  btn.addEventListener('click', () => {
    reanimar(cabeca, 'balanca', 1200);

    const cor = CONTEUDO.chicoCores[Math.min(i, CONTEUDO.chicoCores.length - 1)];
    btn.style.backgroundColor = cor;
    btn.style.borderColor = cor;
    if (!semMovimento) btn.style.transform = `scale(${(1 + i * 0.05).toFixed(3)})`;

    resposta.classList.remove('visivel');
    setTimeout(() => {
      mostrar(resposta, CONTEUDO.chico[i]);

      if (i === total - 1) {
        btn.disabled = true;
        btn.textContent = 'o Chico já foi conquistado';

        // ele é loiro: a luz abre e o capítulo clareia
        acender('loiro', true);
        if (svg) svg.classList.add('loiro');
        if (secao) {
          secao.dataset.tom = '#2A1B10';
          secao.dataset.brilho = 'rgba(232,194,122,.20)';
          secao.dataset.brilhoBaixo = 'rgba(201,162,39,.16)';
          Ambiente.aplicar(secao);
        }
        Travas.cumprir('chico', 'ele te aceitou. continue rolando');
      }
      i = Math.min(i + 1, total - 1);
    }, 130);
  });
}

/* ══════════════════════════════════════════════════════
   06 · RELÓGIO
   ══════════════════════════════════════════════════════ */
function iniciarRelogio() {
  Travas.registrar('relogio');
  const valor = $('[data-relogio]');
  const nota = $('[data-relogio-nota]');
  const btn = $('[data-relogio-btn]');
  if (!btn) return;
  let i = 0;

  btn.addEventListener('click', () => {
    const etapa = CONTEUDO.relogio[i];
    if (!etapa) return;
    valor.textContent = etapa.valor;
    reanimar(valor, 'pulou', 320);
    nota.textContent = etapa.nota;
    abalar(5 + i * 3);
    i++;
    if (i >= CONTEUDO.relogio.length) {
      btn.disabled = true;
      btn.textContent = 'tá bom, pode olhar';
      Travas.cumprir('relogio', 'eu espero. continue rolando');
    }
  });
}

/* ══════════════════════════════════════════════════════
   08 · DICIONÁRIO + o "bebê"
   ══════════════════════════════════════════════════════ */
function iniciarDicionario() {
  $$('[data-verbete]').forEach(v => {
    const abrir = () => v.classList.toggle('aberto');
    v.setAttribute('tabindex', '0');
    v.addEventListener('click', abrir);
    v.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
    });
  });

  const campo = $('[data-campo-bebe]');
  const resposta = $('[data-resposta-bebe]');
  const ovo = $('[data-ovo]');
  if (!campo) return;

  campo.addEventListener('input', () => {
    const v = campo.value.trim().toLowerCase();

    if (CONTEUDO.bebe.palavras.includes(v)) {
      campo.disabled = true;
      resposta.classList.remove('errou');
      ovo.classList.add('apaixonado');
      acender('', true);
      chuvaDeCoracoes(18);
      setTimeout(() => mostrar(resposta, CONTEUDO.bebe.acerto), 250);
    } else if (v.length > 6) {
      resposta.classList.add('errou');
      mostrar(resposta, CONTEUDO.bebe.quase);
    } else {
      resposta.classList.remove('visivel');
    }
  });
}

/* ══════════════════════════════════════════════════════
   09 · 404
   ══════════════════════════════════════════════════════ */
function iniciarPolaroid() {
  Travas.registrar('resolver');
  const btn = $('[data-resolver]');
  const passos = $('[data-passos]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    passos.hidden = false;
    btn.disabled = true;
    btn.textContent = 'plano definido';
    abalar(7);
    Travas.cumprir('resolver', 'combinado. continue rolando');
  });
}

/* ══════════════════════════════════════════════════════
   10 · ROSA — some e vira lista
   ══════════════════════════════════════════════════════ */
function iniciarRosa() {
  Travas.registrar('rosa');
  const palco = $('[data-rosa-palco]');
  const frase = $('[data-rosa-frase]');
  const contagem = $('[data-rosa-contagem]');
  const porques = $('[data-porques]');
  const lista = $('[data-porques-lista]');
  const fecho = $('[data-porques-fecho]');
  const petalas = $$('.petala');
  if (!petalas.length) return;

  let abertas = 0;

  const revelarLista = () => {
    palco.classList.add('sumindo');
    setTimeout(() => {
      palco.hidden = true;
      porques.hidden = false;

      CONTEUDO.petalas.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        lista.appendChild(li);
      });
      fecho.textContent = CONTEUDO.petalasFim;

      const itens = $$('li', lista);
      itens.forEach((li, k) => {
        setTimeout(() => li.classList.add('dentro'), semMovimento ? 0 : 90 + k * 130);
      });

      acender('', true);
      Travas.cumprir('rosa', 'eram esses. continue rolando');
    }, semMovimento ? 0 : 900);
  };

  petalas.forEach((p, idx) => {
    const soltar = () => {
      if (p.classList.contains('usada')) return;
      p.classList.add('usada');
      abertas++;

      frase.classList.remove('visivel');
      setTimeout(() => {
        mostrar(frase, CONTEUDO.petalas[idx]);
        if (abertas === petalas.length) setTimeout(revelarLista, 2600);
      }, 160);

      contagem.textContent = `${abertas} / ${petalas.length}`;

      if (!semMovimento) {
        const dir = idx % 2 === 0 ? -1 : 1;
        p.style.transform = `translate(${dir * 14}px, 26px) rotate(${dir * 9}deg)`;
      }
    };
    p.addEventListener('click', soltar);
    p.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); soltar(); }
    });
  });
}

/* ══════════════════════════════════════════════════════
   11 · NÃO CLIQUE — texto digitado ao vivo
   ══════════════════════════════════════════════════════ */
function iniciarProibido() {
  Travas.registrar('proibido');
  const btn = $('[data-proibido]');
  const alvo = $('[data-digitado]');
  const cursor = $('[data-cursor]');
  if (!btn || !alvo) return;

  let i = 0;
  let ocupado = false;
  let timer = null;

  const digitar = (texto, aoFim) => {
    clearTimeout(timer);
    ocupado = true;
    cursor.classList.remove('oculto');

    const apagar = () => {
      if (alvo.textContent.length > 0) {
        alvo.textContent = alvo.textContent.slice(0, -1);
        timer = setTimeout(apagar, 16);
      } else {
        timer = setTimeout(escrever, 260);
      }
    };

    let k = 0;
    const escrever = () => {
      if (k < texto.length) {
        alvo.textContent += texto[k++];
        // pausa maior na pontuação, como quem pensa antes de mandar
        const c = texto[k - 1];
        timer = setTimeout(escrever, /[.,!?]/.test(c) ? 260 : 34 + Math.random() * 26);
      } else {
        ocupado = false;
        if (aoFim) aoFim();
      }
    };

    if (semMovimento) {
      alvo.textContent = texto;
      ocupado = false;
      if (aoFim) aoFim();
      return;
    }
    apagar();
  };

  btn.addEventListener('click', () => {
    if (ocupado) return;
    const texto = CONTEUDO.proibido[i];
    if (texto === undefined) return;

    reanimar(btn, 'reacao-' + Math.min(i + 1, 6), 1000);

    const revelacao = i === CONTEUDO.proibido.length - 2;   // "VOCÊ É MUITO LINDA."
    if (revelacao) acender('', true);

    i++;
    const acabou = i >= CONTEUDO.proibido.length;

    digitar(texto, () => {
      if (acabou) {
        cursor.classList.add('oculto');
        btn.disabled = true;
        btn.textContent = 'tá, agora vai';
        Travas.cumprir('proibido', 'era isso mesmo. continue rolando');
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   13 · BOTÃO QUE FOGE — some e dá lugar ao texto
   ══════════════════════════════════════════════════════ */
function iniciarFuga() {
  Travas.registrar('fuga');
  const area = $('[data-fuga-area]');
  const btn = $('[data-fuga]');
  const resposta = $('[data-fuga-resposta]');
  const final = $('[data-fuga-final]');
  if (!btn) return;
  let fugas = 0;

  const fugir = (e) => {
    if (fugas >= CONTEUDO.fuga.length) return;
    if (e) e.preventDefault();

    const dx = (fugas % 2 === 0 ? -1 : 1) * (60 + fugas * 18);
    const dy = fugas * -10;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
    mostrar(resposta, CONTEUDO.fuga[fugas]);
    abalar(6 + fugas * 3);

    fugas++;
    if (fugas >= CONTEUDO.fuga.length) {
      setTimeout(() => {
        area.classList.add('sumindo');
        resposta.classList.remove('visivel');
        setTimeout(() => {
          area.hidden = true;
          final.hidden = false;
          final.textContent = CONTEUDO.fugaFinal;
          void final.offsetWidth;
          final.classList.add('visivel');
          acender('', true);
          Travas.cumprir('fuga', 'não adianta fugir. continue rolando');
        }, semMovimento ? 0 : 520);
      }, 700);
    }
  };

  btn.addEventListener('pointerenter', fugir);
  btn.addEventListener('click', (e) => { if (fugas < CONTEUDO.fuga.length) fugir(e); });
}

/* ══════════════════════════════════════════════════════
   SEGREDOS
   ══════════════════════════════════════════════════════ */
function iniciarSegredos() {
  const painel = $('[data-cupons]');
  const total = $('[data-cupons-total]');
  const lista = $('[data-cupons-lista]');
  const achados = new Set();

  $$('[data-segredo]').forEach(s => {
    const achar = () => {
      const id = s.dataset.segredo;
      if (achados.has(id)) return;
      achados.add(id);
      s.classList.add('achado');
      painel.hidden = false;
      total.textContent = achados.size;
      const li = document.createElement('li');
      li.textContent = CONTEUDO.cupons[id];
      lista.appendChild(li);
      chuvaDeCoracoes(4);
    };
    s.addEventListener('click', achar);
    s.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); achar(); }
    });
  });
}

/* ══════════ INÍCIO ══════════ */
document.addEventListener('DOMContentLoaded', () => {
  iniciarReveals();
  iniciarProgresso();
  iniciarNavegacao();
  iniciarCartas();
  iniciarChocolate();
  iniciarAlturas();
  iniciarChico();
  iniciarRelogio();
  iniciarDicionario();
  iniciarPolaroid();
  iniciarRosa();
  iniciarProibido();
  iniciarFuga();
  iniciarSegredos();
  Ambiente.iniciar();
  Pista.iniciar();
});
