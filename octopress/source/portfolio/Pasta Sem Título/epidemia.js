//
// Automata Celular 2D 
//

AutomataCelular2D ac;

int alturaMatriz = 40;
int larguraMatriz = 60;
int tamCelula = 10;
int maxGen = 100;

void setup() {
    size(larguraMatriz * tamCelula, alturaMatriz * tamCelula);
    frameRate(1);
    background(0);
    ac = new AutomataCelular2D(larguraMatriz, alturaMatriz, tamCelula);
    ac.reinicia();
}
 
void draw() {
    if(ac.geracao > maxGen)
        ac.reinicia();
    ac.desenha();
    ac.gera();
}

void mouseDragged() {
    acaoMouse();
}
 
void mousePressed() {
    acaoMouse();
}
 
void mouseClicked() {
    acaoMouse();
}
 
void acaoMouse() {
    int x = int(mouseX / ac.tamCelula);
    int y = int(mouseY / ac.tamCelula);

    if (y < ac.alturaMatriz) {
        ac.celulas[y][x] = 2;
        ac.desenhaCelula(x, y);
    }
}

class AutomataCelular2D {
    int[][] celulas;
    int geracao;
    int alturaMatriz, larguraMatriz;
    int tamCelula;

    AutomataCelular2D (int larguraMatriz, int alturaMatriz, int tamCelula) {
        this.geracao = 0;
        this.alturaMatriz = alturaMatriz;
        this.larguraMatriz = larguraMatriz;
        this.tamCelula = tamCelula;
        this.celulas = new int[larguraMatriz][alturaMatriz];
    }

    void reinicia () {
        this.geracao = 0; 
        // aleatoriza população inicial
        for (int i = 0; i < this.alturaMatriz; i++) {
            for (int j = 0; j < this.larguraMatriz; j++) {
                this.celulas[i][j] = 1;
            }
        }
    }

    void gera () {
        this.geracao++;

        int[][] celulasNovas = new int[this.larguraMatriz][this.alturaMatriz];

        for (int i=0; i<this.alturaMatriz; i++) {
            for (int j=0; j<this.larguraMatriz; j++) {
                celulasNovas[i][j] = 1;

                // se for sucetivel
                if (conta(j, i) == 1) {
                    // se o numero de vizinhos infectados for maior ou igual a 3 entao vira infectado
                    if (contaI(j,i) >= 3)
                        celulasNovas[i][j] = 2;
                    else
                        celulasNovas[i][j] = 1;
                }

                // se for infectado 
                if (conta(j,i) == 2) {
                    // se o numero de vizinhos infectados for menor ou igual que 2 entao se recupera
                    if(contaI(j,i) <= 2)
                        celulasNovas[i][j] = 0;
                    // se o numero de vizinhos recuperados + sucetiveis + mortos for igual ou maior que 7  entao vira recuperado
                    else if(contaR(j,i) + contaS(j,i) + contaM(j,i) >= 7)
                        celulasNovas[i][j] = 0;
                    // se todos os vizinhos forem tambem infectados, morre
                    else if (contaI(j,i) >= 7)
                        celulasNovas[i][j] = 3;
                    else
                        celulasNovas[i][j] = 2;
                }
                // se for recuperado
                if (conta(j,i) == 0) {
                    celulasNovas[i][j] = 0;
                }
                // se for morto
                if (conta(j,i) == 3) {
                    celulasNovas[i][j] = 3;
                }
            }
        }
        copiaMatriz(celulasNovas, this.celulas);
    }

    void desenha () {
        background(0);
        stroke(0, 0, 0);
        fill(255, 255, 255);
    
        // desenha a grade:
        for (int i = 0; i < this.alturaMatriz; i++) {
            for (int j = 0; j < this.larguraMatriz; j++) {
                    this.desenhaCelula(j, i);
            }
        }
    }
    
    // métodos auxiliares
 
    void desenhaCelula(int x, int y) {
        if(conta(x,y) == 0) fill(0,0,255); // recuperado azul
        if(conta(x,y) == 1) fill(200);     // sucetivel cinza
        if(conta(x,y) == 2) fill(255,0,0); // infectado vermelho
        if(conta(x,y) == 3) fill(0);       // morto       

        rect(x * tamCelula, y * tamCelula, tamCelula, tamCelula);
    }
   
    int valor(int x, int y) {
        // qualquer célula fora das bordas está morta
        if ((x < 0) || (x >= this.larguraMatriz) || (y < 0) || (y >= this.alturaMatriz))
            return 0;

        return this.celulas[y][x];
    }

    int conta(int x, int y){
        return this.valor(x,y);
    }

    // O Estado de morto possui valor 3
    int contaMortos(int x, int y) {
        int v = this.valor(x, y);
        return (v==3) ? 1 : 0;
    }

    // O Estado de infectados possui valor 2
    int contaInfectados(int x, int y) {
        int v = this.valor(x, y);
        return (v==2) ? 1 : 0;
    }

    // O Estado de sucetiveis possui valor 1
    int contaSucetiveis(int x, int y) {
        int v = this.valor(x, y);
        return (v==1) ? 1 : 0;
    }

    // O Estado de recuperados possui valor 0
    int contaRecuperados(int x, int y) {
        int v = this.valor(x, y);
        return (v==0) ? 1 : 0;
    }


    // Calcula vizinhos de Moore

    int contaM(int x, int y) {
        return contaMortos(x, y - 1)      // N
            + contaMortos(x + 1, y - 1)  // NE
            + contaMortos(x + 1, y)      // E
            + contaMortos(x + 1, y + 1)  // SE
            + contaMortos(x, y + 1)      // S
            + contaMortos(x - 1, y + 1)  // SW
            + contaMortos(x - 1, y)      // W
            + contaMortos(x - 1, y - 1); // NW
    }

    int contaI(int x, int y) {
        return contaInfectados(x, y - 1)      // N
            + contaInfectados(x + 1, y - 1)  // NE
            + contaInfectados(x + 1, y)      // E
            + contaInfectados(x + 1, y + 1)  // SE
            + contaInfectados(x, y + 1)      // S
            + contaInfectados(x - 1, y + 1)  // SW
            + contaInfectados(x - 1, y)      // W
            + contaInfectados(x - 1, y - 1); // NW
    }

    int contaS(int x, int y) {
        return contaSucetiveis(x, y - 1)      // N
            + contaSucetiveis(x + 1, y - 1)  // NE
            + contaSucetiveis(x + 1, y)      // E
            + contaSucetiveis(x + 1, y + 1)  // SE
            + contaSucetiveis(x, y + 1)      // S
            + contaSucetiveis(x - 1, y + 1)  // SW
            + contaSucetiveis(x - 1, y)      // W
            + contaSucetiveis(x - 1, y - 1); // NW
    }

    int contaR(int x, int y) {
        return contaRecuperados(x, y - 1)      // N
            + contaRecuperados(x + 1, y - 1)  // NE
            + contaRecuperados(x + 1, y)      // E
            + contaRecuperados(x + 1, y + 1)  // SE
            + contaRecuperados(x, y + 1)      // S
            + contaRecuperados(x - 1, y + 1)  // SW
            + contaRecuperados(x - 1, y)      // W
            + contaRecuperados(x - 1, y - 1); // NW
    }

    void copiaMatriz(origem, destino) {
        for (i = 0; i < this.alturaMatriz; i++) {
            for (j = 0; j < this.larguraMatriz; j++) {
                destino[i][j] = origem[i][j];
            }
        }
    }
}