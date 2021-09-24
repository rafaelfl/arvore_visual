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
  
inserirSubArvore = (noRaiz, valor) => {
    if (noRaiz == null) {
      const no = {
        esq: null,
        dir: null,
        valor,
      };
      
      return no;
    }
    
    if (valor <= noRaiz.valor) {
      noRaiz.esq = inserirSubArvore(noRaiz.esq, valor);
    } else {
      noRaiz.dir = inserirSubArvore(noRaiz.dir, valor);
    }
    
    return noRaiz;
}
  
inserirArvore = (arvore, valor) => {
    arvore.raiz = inserirSubArvore(arvore.raiz, valor);
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

preOrdemSubArvore = (noRaiz) => {
  if (noRaiz == null) {
    return [];
  }

  const result = [];

  result.push(noRaiz.valor);
  result.push(...preOrdemSubArvore(noRaiz.esq));
  result.push(...preOrdemSubArvore(noRaiz.dir));

  return result;
}

emOrdemSubArvore = (noRaiz) => {
  if (noRaiz == null) {
    return [];
  }

  const result = [];
  
  result.push(...emOrdemSubArvore(noRaiz.esq));
  result.push(noRaiz.valor);
  result.push(...emOrdemSubArvore(noRaiz.dir));

  return result;
}

posOrdemSubArvore = (noRaiz) => {
  if (noRaiz == null) {
    return [];
  }

  const result = [];

  result.push(...posOrdemSubArvore(noRaiz.esq));
  result.push(...posOrdemSubArvore(noRaiz.dir));
  result.push(noRaiz.valor);

  return result;
}

preOrdem = (arvore) => {
  const result = preOrdemSubArvore(arvore.raiz);
  return result;
}

emOrdem = (arvore) => {
  const result = emOrdemSubArvore(arvore.raiz);
  return result;
}

posOrdem = (arvore) => {
  const result = posOrdemSubArvore(arvore.raiz);
  return result;
}

buscaSubArvore = (noRaiz, valor) => {
  if (noRaiz == null) {
    return null;
  }

  if (noRaiz.valor == valor) {
    return noRaiz.valor;
  }

  const resultEsq = buscaSubArvore(noRaiz.esq, valor);
  const resultDir = buscaSubArvore(noRaiz.dir, valor);

  if (resultEsq != null) {
    return resultEsq;
  }

  if (resultDir != null) {
    return resultDir;
  }
}

buscaArvore = (arvore, valor) => {
  return buscaSubArvore(arvore.raiz, valor);
}

arvoreTeste = () => {
    inserirArvore(arv, 55);
    inserirArvore(arv, 12);
    inserirArvore(arv, 80);
    inserirArvore(arv, 64);
    inserirArvore(arv, 56);
    inserirArvore(arv, 89);
    
    // console.log(arv);
    // console.log(alturaArvore(arv));
    // console.log(maxFolhas(alturaArvore(arv)));

    desenhaArvore(arv);
}


arv = criarArvore();

arvoreTeste();

function onInsertClick () {
  try {
      const value = document.getElementById("valor").value;
      const result = parseInt(value);
      
      inserirArvore(arv, result);
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

function onPreorderClick() {
  const result = preOrdem(arv);
  alert(result.join(', '));
}

function onInorderClick() {
  const result = emOrdem(arv);
  alert(result.join(', '));
}

function onPostorderClick() {
  const result = posOrdem(arv);
  alert(result.join(', '));
}

function onSearchClick() {
  try {
      const value = document.getElementById("buscaValor").value;
      const result = parseInt(value);
      
      const encontrado = buscaArvore(arv, result);

      if (encontrado != null) {
        desenhaArvore(arv, encontrado);
      } else {
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