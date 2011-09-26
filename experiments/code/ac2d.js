//
// Autômato Celular 2D
//

AutomataCelular2D ac;

int alturaMatriz = 40;
int larguraMatriz = 60;
int tamCelula = 10;

// métodos processing

void setup() {
    size(larguraMatriz * tamCelula, alturaMatriz * tamCelula);
    frameRate(2);
    background(0);
    ac = new AutomataCelular2D(larguraMatriz, alturaMatriz, tamCelula);
    ac.reinicia();
}
 
void draw() {
    float a = (float) $('#val_velocidade').val();
    frameRate(a);
    ac.gera();
    ac.desenha();
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
        ac.celulas[y][x] = 1;
        ac.desenhaCelula(x, y);
    }
}

// classe principal

class AutomataCelular2D {
    int[][] celulas;
    int generacao;
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
        // aleatoriza população inicial
        for (int i = 0; i < this.alturaMatriz; i++) {
            for (int j = 0; j < this.larguraMatriz; j++) {
                this.celulas[i][j] = (random(1) > 0.5) ? 1 : 0;
            }
        }
    }

    void gera () {
        // Rules of Life:
        // --------------------
        // 1. die if neighbors < 2
        // 2. stay alive if 2 or 3 neighbors
        // 3. die if neigbors > 3
        // 4. come alive if exactly 3 live neighbors
        int[][] celulasNovas = new int[this.larguraMatriz][this.alturaMatriz];

        for (int i=0; i<this.alturaMatriz; i++) {
            for (int j=0; j<this.larguraMatriz; j++) {
                celulasNovas[i][j] = 0;
                int qtdVizinhos = contaVizinhos(j, i);
                
                // se vivo...
                if (conta(j, i) == 1) {
                    if ((qtdVizinhos < 2) || (qtdVizinhos > 3))
                        celulasNovas[i][j] = 0; // morre
                    else
                        celulasNovas[i][j] = 1;
                } else if (qtdVizinhos == 3) {
                    celulasNovas[i][j] = 1; // nasce
                }
            }
        }
        copiaMatriz(celulasNovas, this.celulas);
    }

    void desenha () {
        background(0);
        stroke(color(0, 0, 0));
        fill(color(255, 255, 255));
    
        // draw the grid:
        for (int i = 0; i < this.alturaMatriz; i++) {
            for (int j = 0; j < this.larguraMatriz; j++) {
                if (this.celulas[i][j]) {
                    this.desenhaCelula(j, i);
                }
            }
        }
    }
    
    // métodos auxiliares
 
    void desenhaCelula(int x, int y) {
        fill(255);
        rect(x * tamCelula, y * tamCelula, tamCelula, tamCelula);
    }
   
    int valor(int x, int y) {
        // qualquer célula fora das bordas está morta
        if ((x < 0) || (x >= this.larguraMatriz) || 
            (y < 0) || (y >= this.alturaMatriz))
            return 0;
        return this.celulas[y][x];
    }

    int conta(int x, int y) {
        int v = this.valor(x, y);
        return (v==0) ? 0 : 1;
    }

    int contaVizinhos(int x, int y) {
        return conta(x, y - 1)      // N
            + conta(x + 1, y - 1)  // NE
            + conta(x + 1, y)      // E
            + conta(x + 1, y + 1)  // SE
            + conta(x, y + 1)      // S
            + conta(x - 1, y + 1)  // SW
            + conta(x - 1, y)      // W
            + conta(x - 1, y - 1); // NW
    }

    void copiaMatriz(origem, destino) {
        for (i = 0; i < this.alturaMatriz; i++) {
            for (j = 0; j < this.larguraMatriz; j++) {
                destino[i][j] = origem[i][j];
            }
        }
    }
}