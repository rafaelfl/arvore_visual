let timeValue = 500;
let animation = true;

criarArvore = () => {
    const a = {
      raiz: null,
    };
    
    return a;
}

/*
  Implementação simples que não reflete a implementação real do algoritmo.
  Se apoia no Garbage Collector do Javascript no navegador.
*/
destruirArvore = (arvore) => {
  arvore.raiz = null;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

arv = criarArvore();
  
inserirSubArvore = async (noRaiz, valor) => {
    if (noRaiz == null) {
      const no = {
        esq: null,
        dir: null,
        valor,
      };
      
      return no;
    }

    if (animation) {
      desenhaArvore(arv, noRaiz.valor);
      await timeout(timeValue);
    }
    
    if (valor <= noRaiz.valor) {
      noRaiz.esq = await inserirSubArvore(noRaiz.esq, valor);
    } else {
      noRaiz.dir = await inserirSubArvore(noRaiz.dir, valor);
    }
    
    return noRaiz;
}
  
inserirArvore = async (arvore, valor) => {
    arvore.raiz = await inserirSubArvore(arvore.raiz, valor);
}

alturaSubArvore = (noRaiz, altura) => {
    if (noRaiz == null) {
      return altura;
    }
    
    return Math.max(alturaSubArvore(noRaiz.esq, altura + 1), alturaSubArvore(noRaiz.dir, altura + 1));
}

alturaArvore = (arvore) => {
    return alturaSubArvore(arvore.raiz, 0)-1;
} 

maxFolhas = (altura) => {
    return Math.pow(2, altura);
}
  
desenhaNo = (noRaiz, altura, startX, endX, ctx, encontrado) => {
    const x = startX + (endX - startX) / 2 - 60;
    const y = altura * 100;

    if (encontrado == noRaiz.valor) {
      ctx.fillStyle = "yellow";
    } else {
      ctx.fillStyle = "red";
    }

    ctx.fillRect(x, y, 60, 60);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(noRaiz.valor.toString(), x+14, y+42);
}

desenhaSubArvore = (noRaiz, altura, startX, endX, ctx, encontrado) => {
    if (noRaiz == null) {
      return;
    }

    const meio = startX + (endX - startX) / 2;

    const xLinha = meio - 30;
    const yLinha = altura * 100  + 40;

    if (noRaiz.esq != null) {
        const xLinhaFilhoEsq = startX + (xLinha-startX)/2;
        const yLinhaFilhoEsq = (altura+1) * 100;

        ctx.beginPath();
        ctx.moveTo(xLinha, yLinha);
        ctx.lineTo(xLinhaFilhoEsq, yLinhaFilhoEsq);
        ctx.stroke();

        // console.log(`>>>> o nó ${noRaiz.valor} tem filho esquerdo: ${noRaiz.esq.valor}`);
        // console.log(`      --- ${startX} x ${endX} ===> ${xLinha} /// ${xLinhaFilhoEsq} `);
    }

    if (noRaiz.dir != null) {
        const xLinhaFilhoDir = endX - (xLinha-startX)/ 2 - 60;
        const yLinhaFilhoDir = (altura+1) * 100;

        ctx.beginPath();
        ctx.moveTo(xLinha, yLinha);
        ctx.lineTo(xLinhaFilhoDir, yLinhaFilhoDir);
        ctx.stroke();

        // console.log(`>>>> o nó ${noRaiz.valor} tem filho direito: ${noRaiz.dir.valor}`);
        // console.log(`      --- ${startX} x ${endX} ===> ${xLinha} /// ${xLinhaFilhoDir} `);
    }
    
    desenhaSubArvore(noRaiz.esq, altura + 1, startX, meio, ctx, encontrado);
    desenhaSubArvore(noRaiz.dir, altura + 1, meio, endX, ctx, encontrado);

    desenhaNo(noRaiz, altura, startX, endX, ctx, encontrado);
}

desenhaArvore = (arvore, encontrado) => {
    const c = document.getElementById("myCanvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    desenhaSubArvore(arvore.raiz, 0, 0, c.width, ctx, encontrado);
}

preOrdemSubArvore = async (noRaiz) => {
  if (noRaiz == null) {
    desenhaArvore(arv);
    return [];
  }

  const result = [];

  console.log(noRaiz.valor);

  if (animation) {
    desenhaArvore(arv, noRaiz.valor);
    await timeout(timeValue);
  }

  result.push(noRaiz.valor);
  result.push(...await preOrdemSubArvore(noRaiz.esq));
  result.push(...await preOrdemSubArvore(noRaiz.dir));

  return result;
}

emOrdemSubArvore = async (noRaiz) => {
  if (noRaiz == null) {
    desenhaArvore(arv);
    return [];
  }

  const result = [];
  
  result.push(...await emOrdemSubArvore(noRaiz.esq));

  if (animation) {
    desenhaArvore(arv, noRaiz.valor);
    await timeout(timeValue);
  }

  result.push(noRaiz.valor);

  result.push(...await emOrdemSubArvore(noRaiz.dir));

  return result;
}

posOrdemSubArvore = async (noRaiz) => {
  if (noRaiz == null) {
    desenhaArvore(arv);
    return [];
  }

  const result = [];

  result.push(...await posOrdemSubArvore(noRaiz.esq));
  result.push(...await posOrdemSubArvore(noRaiz.dir));

  if (animation) {
    desenhaArvore(arv, noRaiz.valor);
    await timeout(timeValue);
  }

  result.push(noRaiz.valor);

  return result;
}

preOrdem = async (arvore) => {
  const result = await preOrdemSubArvore(arvore.raiz);
  return result;
}

emOrdem = async (arvore) => {
  const result = await emOrdemSubArvore(arvore.raiz);
  return result;
}

posOrdem = async (arvore) => {
  const result = await posOrdemSubArvore(arvore.raiz);
  return result;
}

buscaSubArvore = async (noRaiz, valor) => {
  if (noRaiz == null) {
    desenhaArvore(arv);
    return null;
  }

  if (animation) {
    desenhaArvore(arv, noRaiz.valor);
    await timeout(timeValue);
  }

  if (noRaiz.valor == valor) {
    return noRaiz.valor;
  }

  if (valor < noRaiz.valor) {
    return await buscaSubArvore(noRaiz.esq, valor);
  } else {
    return await buscaSubArvore(noRaiz.dir, valor);
  }
}

buscaArvore = async (arvore, valor) => {
  return await buscaSubArvore(arvore.raiz, valor);
}

arvoreTeste = async () => {
    await inserirArvore(arv, 55);
    await inserirArvore(arv, 12);
    await inserirArvore(arv, 80);
    await inserirArvore(arv, 64);
    await inserirArvore(arv, 56);
    await inserirArvore(arv, 89);
    
    // console.log(arv);
    // console.log(alturaArvore(arv));
    // console.log(maxFolhas(alturaArvore(arv)));

    desenhaArvore(arv);
}

arvoreTeste();

async function onInsertClick () {
  try {
      const value = document.getElementById("valor").value;
      const result = parseInt(value);
      
      await inserirArvore(arv, result);
      desenhaArvore(arv);
  } catch (e) {
    console.log(e);
    alert('Informe um valor inteiro!');
  }
}

function onClearClick() {
  destruirArvore(arv);
  desenhaArvore(arv);
}

function keyDownInsert (event) {
  if (event.keyCode == 13) {
    onInsertClick();
  }
}

function keyDownSearch (event) {
  if (event.keyCode == 13) {
    onSearchClick();
  }
}

async function onPreorderClick() {
  const result = await preOrdem(arv);
  desenhaArvore(arv);
  alert(result.join(', '));
}

async function onInorderClick() {
  const result = await emOrdem(arv);
  desenhaArvore(arv);
  alert(result.join(', '));
}

async function onPostorderClick() {
  const result = await posOrdem(arv);
  desenhaArvore(arv);
  alert(result.join(', '));
}

async function onSearchClick() {
  try {
      const value = document.getElementById("buscaValor").value;
      const result = parseInt(value);
      
      const encontrado = await buscaArvore(arv, result);

      if (encontrado != null) {
        desenhaArvore(arv, encontrado);
      } else {
        desenhaArvore(arv);
        alert('Valor não encontrado!');
      }
  } catch (e) {
    console.log(e);
    alert('Informe um valor inteiro!');
  }
}

function onClearSearchClick() {
  desenhaArvore(arv);
}

function changeCheckAnimation(event) {
  if (event.currentTarget.checked) {
    animation = true;
  } else {
    animation = false;
  }
}