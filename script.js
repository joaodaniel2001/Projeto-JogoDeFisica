    const carro = document.getElementById('carro');
    const resultado = document.getElementById('resultado');
    const btn = document.getElementById('startBtn');

    let posicao = 0;         // posição horizontal do carro (px)
    let velocidade = 0;      // velocidade em px/s (inicial 0)
    let aceleracao = 0;      // aceleração em px/s²
    let ultimaHora = null;
    let animando = false;

    const fatorEscala = 0.05;

    // Cria explosão maior de partículas
    function criarExplosao(x, y) {
      const cores = ['#ff3b3b', '#ff7f3b', '#ffbb3b', '#ffa500', '#ff4500'];
      const particulas = [];
      const qtdParticulas = 30;

      for(let i = 0; i < qtdParticulas; i++) {
        const p = document.createElement('div');
        p.classList.add('explosao-particula');
        p.style.width = p.style.height = (Math.random() * 15 + 10) + 'px';
        p.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];

        // Posição inicial (centro da explosão)
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        // Direção e distância da explosão
        const angulo = (i / qtdParticulas) * 2 * Math.PI + (Math.random() * 0.5);
        const distancia = Math.random() * 120 + 60;

        // Animação via Web Animations API
        p.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${Math.cos(angulo)*distancia}px, ${Math.sin(angulo)*distancia}px) scale(4)`, opacity: 0 }
        ], {
          duration: 800,
          easing: 'ease-out',
          fill: 'forwards'
        });

        document.body.appendChild(p);
        particulas.push(p);
      }

      // Remove as partículas depois da animação
      setTimeout(() => {
        particulas.forEach(p => p.remove());
      }, 850);
    }

    // Cria fragmentos do carro e anima eles se afastando e girando
    function explodirCarro(x, y) {
      const fragmentos = [];
      const numFragmentosX = 4; // 4 pedaços horizontal
      const numFragmentosY = 2; // 2 pedaços vertical
      const fragWidth = carro.offsetWidth / numFragmentosX;
      const fragHeight = carro.offsetHeight / numFragmentosY;

      for(let i=0; i < numFragmentosX; i++) {
        for(let j=0; j < numFragmentosY; j++) {
          const frag = document.createElement('div');
          frag.classList.add('fragmento');
          frag.style.width = fragWidth + 'px';
          frag.style.height = fragHeight + 'px';

          // Posição inicial igual ao fragmento no carro
          frag.style.left = (x + i * fragWidth) + 'px';
          frag.style.top = (y + j * fragHeight) + 'px';

          document.body.appendChild(frag);
          fragmentos.push(frag);
        }
      }

      // Animação dos fragmentos: se afastando com rotação e queda
      fragmentos.forEach((frag, idx) => {
        const angulo = Math.random() * 2 * Math.PI;
        const distancia = Math.random() * 200 + 100;
        const rotacao = (Math.random() * 720) * (Math.random() < 0.5 ? -1 : 1);
        const queda = 150 + Math.random() * 100;

        frag.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${Math.cos(angulo)*distancia}px, ${Math.sin(angulo)*distancia + queda}px) rotate(${rotacao}deg)`, opacity: 0 }
        ], {
          duration: 1500,
          easing: 'ease-in',
          fill: 'forwards'
        });
      });

      // Remove os fragmentos após a animação
      setTimeout(() => {
        fragmentos.forEach(frag => frag.remove());
      }, 1600);
    }

    function animar(hora) {
      if (!ultimaHora) {
        ultimaHora = hora;
        requestAnimationFrame(animar);
        return;
      }

      const delta = (hora - ultimaHora) / 1000; // delta em segundos
      ultimaHora = hora;

      velocidade += aceleracao * delta;
      posicao += velocidade * delta;

      const larguraTela = window.innerWidth;
      if (posicao + carro.offsetWidth > larguraTela) {
        posicao = larguraTela - carro.offsetWidth;
        velocidade = 0;
        animando = false;

        resultado.textContent = 'O carro chegou ao final da tela e explodiu!';
        resultado.style.color = '#d32f2f';

        // Posição do carro para explosão (topo esquerdo do carro)
        const xCarro = posicao;
        const yCarro = window.innerHeight - 100; // bottom: 100px do carro

        // Esconde o carro
        carro.style.visibility = 'hidden';

        // Cria fragmentos e explosão maior
        explodirCarro(xCarro, yCarro);
        criarExplosao(xCarro + carro.offsetWidth/2, yCarro + carro.offsetHeight/2);

        return; // Para a animação
      }

      carro.style.left = posicao + 'px';

      if (animando) {
        requestAnimationFrame(animar);
      }
    }

    btn.addEventListener('click', () => {
      const massa = parseFloat(document.getElementById('massa').value);
      const forca = parseFloat(document.getElementById('forca').value);

      if (isNaN(massa) || massa <= 0) {
        resultado.style.color = 'red';
        resultado.textContent = 'Insira uma massa válida (maior que zero).';
        return;
      }

      if (isNaN(forca)) {
        resultado.style.color = 'red';
        resultado.textContent = 'Insira uma força válida.';
        return;
      }

      const aceleracaoFisica = forca / massa;

      aceleracao = aceleracaoFisica * fatorEscala;

      posicao = 0;
      velocidade = 0;
      carro.style.left = '0px';
      carro.style.visibility = 'visible';

      resultado.style.color = '#004d40';
      resultado.textContent = `Aceleração: ${aceleracaoFisica.toFixed(2)} m/s²`;

      animando = true;
      ultimaHora = null;
      requestAnimationFrame(animar);
    });