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
  Para destruir a árvore, utilize o percurso pós-ordem (destrua a árvore
  da esquerda, depois a da direita e finalmente a raiz).
*/
destruirArvore = (arvore) => {
  arvore.raiz = null;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// árvore global que será usada para o desenho
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
  
desenhaNo = (noRaiz, altura, startX, endX, ctx, encontrado, elemento_remover) => {
    const x = startX + (endX - startX) / 2 - 60;
    const y = altura * 100;

    if (encontrado == noRaiz.valor) {
      ctx.fillStyle = "yellow";
    } else {
      if (elemento_remover == noRaiz.valor) {
        ctx.fillStyle = "orange";
      } else {
        ctx.fillStyle = "red";
      }
    }

    ctx.fillRect(x, y, 60, 60);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(noRaiz.valor.toString(), x+14, y+42);
}

desenhaSubArvore = (noRaiz, altura, startX, endX, ctx, encontrado, elemento_remover) => {
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
    
    desenhaSubArvore(noRaiz.esq, altura + 1, startX, meio, ctx, encontrado, elemento_remover);
    desenhaSubArvore(noRaiz.dir, altura + 1, meio, endX, ctx, encontrado, elemento_remover);

    desenhaNo(noRaiz, altura, startX, endX, ctx, encontrado, elemento_remover);
}

desenhaArvore = (arvore, encontrado, elemento_remover) => {
    const treeDiv = document.getElementById("tree-container");
    const c = document.getElementById("myCanvas");
    // c.width = window.innerWidth;
    // c.height = window.innerHeight;
    c.width = treeDiv.offsetWidth
    c.height = treeDiv.offsetHeight;
  
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    desenhaSubArvore(arvore.raiz, 0, 0, c.width, ctx, encontrado, elemento_remover);
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

maxSubArvore = (noRaiz) => {
  if (noRaiz == null) {
    return noRaiz;
  }

  // se o nó não tiver um filho direito, significa que eu encontrei o nó mais à direita
  if (noRaiz.dir == null) {
    return noRaiz;
  }

  return maxSubArvore(noRaiz.dir);
}

removerSubArvore = async (noRaiz, valor) => {
  if (noRaiz == null) {
    desenhaArvore(arv);
    return noRaiz;
  }

  if (animation) {
    desenhaArvore(arv, noRaiz.valor);
    await timeout(timeValue);
  }

  // se valor é menor que o valor da raiz, continua a busca na SAE
  if (valor < noRaiz.valor) {
    noRaiz.esq = await removerSubArvore(noRaiz.esq, valor);

  // se valor for maior que o valor da raiz, continua a busca na SAD
  } else if (valor > noRaiz.valor) {
    noRaiz.dir = await removerSubArvore(noRaiz.dir, valor);

  // se valor for igual ao elemento raiz, eu encontrei o nó e preciso removê-lo
  } else {
    /*
     * Os próximos dois casos, contemplam sub-árvores que
     * só tenham um dos dois filhos.
     */
    // se eu não tiver um filho esquerdo...
    if (noRaiz.esq == null) {
      const filhoDir = noRaiz.dir;

      // ... retorna o meu filho direito como a nova raiz da árvore
      return filhoDir;
    
    // caso eu tenha um filho esquerdo, mas não tenha um filho direito...
    } else if (noRaiz.dir == null) {
      const filhoEsq = noRaiz.esq;

      // ... retorna o meu filho esquerdo como a nova raiz da árvore
      return filhoEsq;

    // o nó raiz tem os dois filhos (esquerdo e direito)
    } else {
      // encontra o maior valor da SAE
      const maxSAE = maxSubArvore(noRaiz.esq);

      if (animation) {
        desenhaArvore(arv, noRaiz.valor, maxSAE.valor);
        await timeout(timeValue);
      }

      noRaiz.valor = maxSAE.valor;

      noRaiz.esq = await removerSubArvore(noRaiz.esq, maxSAE.valor);
    }
  }

  return noRaiz;
}

removerArvore = async (arvore, valor) => {
  arvore.raiz = await removerSubArvore(arvore.raiz, valor);
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

// constrói a árvore inicial
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

async function onDeleteClick() {
  try {
    const value = document.getElementById("buscaValor").value;
    const result = parseInt(value);
    
    await removerArvore(arv, result);
    desenhaArvore(arv);
  } catch (e) {
    console.log(e);
    alert('Informe um valor inteiro!');
  }
}

function changeCheckAnimation(event) {
  if (event.currentTarget.checked) {
    animation = true;
  } else {
    animation = false;
  }
}