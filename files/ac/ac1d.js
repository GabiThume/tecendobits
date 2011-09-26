//
// Automata Celular 1D
//

AutomataCelular1D ca;

int tamanho = 600;

void setup() {
    size(600,400);
    frameRate(20);
    background(255);
    strokeWeight(0.4);
    int[] regras = {1,1,1,1,1,1,1,0};
    ca = new AutomataCelular1D(regras);
}

void draw() {
    ca.desenha();
    ca.gera();  
}

void mousePressed() {
    background(255);
    ca.randomizaRegras();
    ca.reinicia();
}

class AutomataCelular1D {
    int[] celulas; // linha de células
    int geracao; // número da iteração
    int tamCelula; // tamanho de cada célula
    int[] regras; // regras para o autômato celular
    
    AutomataCelular1D (int[] regras) {
        this.regras = regras;
        this.tamCelula = 10;
        this.celulas = new int[tamanho/this.tamCelula];
        this.reinicia();
    }
    
    AutomataCelular1D () {
        this.tamCelula = 10;
        this.celulas = new int[tamanho/this.tamCelula];
        this.randomizaRegras();
        this.reinicia();
    }
    
    int aplicaRegras (int a, int b, int c) {
        if (a == 1 && b == 1 && c == 1) return regras[0];
        if (a == 1 && b == 1 && c == 0) return regras[1];
        if (a == 1 && b == 0 && c == 1) return regras[2];
        if (a == 1 && b == 0 && c == 0) return regras[3];
        if (a == 0 && b == 1 && c == 1) return regras[4];
        if (a == 0 && b == 1 && c == 0) return regras[5];
        if (a == 0 && b == 0 && c == 1) return regras[6];
        if (a == 0 && b == 0 && c == 0) return regras[7];
        return 0;
    }
    
    void randomizaRegras () {
        for (int i = 0; i < 8; i++) {
            this.regras[i] = int(random(2));
        }
    }
    
    void reinicia () {
        for (int i = 0; i < this.celulas.length; i++) {
            this.celulas[i] = 0;
        }
        this.celulas[this.celulas.length/2] = 1; // ao menos uma semente
        this.geracao = 0;
    }
    
    void gera () {
        int[] celulasNovas = new int[this.celulas.length];
        
        for (int i = 0; i < this.celulas.length; i++) {
            int esquerda, atual, direita;
            
            // vizinho esquerda
            if(i==0){ 
                esquerda = this.celulas[this.celulas.length-1];
            }
            else{
                esquerda = this.celulas[i-1];   
            }
            
            // estado corrente
            atual = this.celulas[i];       
            
            // vizinha direita
            if(i==this.celulas.length-1){ 
                direita = this.celulas[0];
            }
            else{
                direita = this.celulas[i+1]; 
            }
            
            // computa proxima geracao
            celulasNovas[i] = this.aplicaRegras(esquerda,atual,direita); 
        }
        this.celulas = celulasNovas;
        this.geracao++;
    }
    
    void desenha() {
        for (int i = 0; i < this.celulas.length; i++) {
            if (this.celulas[i] == 1) {
                stroke(255);
                fill(0);
            } else {
                stroke(0);
                fill(255);
            }
            
            rect(i*this.tamCelula, this.geracao*this.tamCelula, 
                 this.tamCelula, this.tamCelula);
        }
    }
    
    boolean terminou() {
        if (this.geracao > height/this.tamCelula) {
            return true;
        } else {
            return false;
        }
    }
}