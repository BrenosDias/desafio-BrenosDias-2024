class Recinto {
    constructor(cod, biomas, tamanhoTotal, animais) {
        this.cod = cod;
        this.biomas = biomas;
        this.tamanho = tamanhoTotal;
        this.animais = animais;


    }
}

class Animal {
    constructor(nome, biomas, tamanho, carnivoro) {
        this.nome = nome;
        this.biomas = biomas;
        this.tamanho = tamanho;
        this.carnivoro = carnivoro;
    }
}

class Macaco extends Animal {
    constructor() {
        super("MACACO", ["Savana", "Floresta"], 1, false);
    }


    acompanhado(recinto, quantidade) {
        if (recinto.animais.length > 0 || quantidade > 1) {
            return true;
        }

        return false;
    }
}

class Hipopotamo extends Animal {
    constructor() {
        super("HIPOPOTAMO", ["Savana", "Rio"], 4, false);
    }

    tolerancia(recinto) {
        if (recinto.animais.length > 0 && recinto.biomas != ["Savana", "Rio"]) {
            return false;
        }

        return true;
    }
}


class RecintosZoo {

    constructor() {
        this.animais = [
            new Animal("LEAO", ["Savana"], 3, true),
            new Animal("LEOPARDO", ["Savana"], 2, true),
            new Animal("CROCODILO", ["Rio"], 3, true),
            new Macaco(),
            new Animal("GAZELA", ["Savana"], 2, false),
            new Hipopotamo()
        ]

        this.recintos = [
            new Recinto(1, ["Savana"], 10, [this.animais[3], this.animais[3], this.animais[3]]),
            new Recinto(2, ["Floresta"], 5, []),
            new Recinto(3, ["Savana", "Rio"], 7, [this.animais[4]]),
            new Recinto(4, ["Rio"], 8, []),
            new Recinto(5, "Savana", 9, [this.animais[0]]),
        ]
    }

    analisaRecintos(animal, quantidade) {

        let animalNovo = null;

        if (quantidade <= 0) {
            return {
                erro: "Quantidade inválida"
            }
        }

        for (const especie of this.animais) {

            if (animal === especie.nome) {
                animalNovo = especie;
                break;
            }
        }

        if (animalNovo == null) {
            return {
                erro: "Animal inválido"
            }
        }

        const recintosPossiveis = [];

        for (const recinto in this.recintos) {

            for (const bioma of this.recintos[recinto].biomas) {
                if (animalNovo.biomas.includes(bioma)) {
                    recintosPossiveis.push(this.recintos[recinto]);
                    break;
                }
            }

        }

        for (const recinto in recintosPossiveis) {

            for (const especie of recintosPossiveis[recinto].animais) {

                if (especie.carnivoro == true) {
                    if (especie.nome != animalNovo.nome) {
                        recintosPossiveis.splice(recinto, 1);
                        break;
                    }
                }
                else {
                    if (animalNovo.carnivoro == true) {
                        recintosPossiveis.splice(recinto, 1);
                        break;
                    }
                }
            }
        }

        if (recintosPossiveis.length == 0) {
            return {
                erro: "Não há recinto viável"
            }
        }



        if (animalNovo.nome == 'MACACO') {
            for (const recinto in recintosPossiveis) {
                if (!animalNovo.acompanhado(recintosPossiveis[recinto], quantidade)) {
                    recintosPossiveis.splice(recinto, 1);
                }
            }
        }

        if (animalNovo.nome == 'HIPOPOTAMO') {
            for (recinto in recintosPossiveis) {
                if (!animalNovo.tolerancia(recintosPossiveis[recinto])) {
                    recintosPossiveis.splice(recinto, 1);
                }
            }
        }

        const recintosFinais = [];

        for (const recinto in recintosPossiveis) {
            let tamanhoOcupado = recintosPossiveis[recinto].animais.reduce((soma, animal) => soma + animal.tamanho, 0)
                + (animalNovo.tamanho * quantidade);

            for (const animal of recintosPossiveis[recinto].animais) {
                if (animal.nome != animalNovo.nome) {
                    tamanhoOcupado = tamanhoOcupado + 1;
                }
            }


            if (tamanhoOcupado > recintosPossiveis[recinto].tamanho) {
                recintosPossiveis.splice(recinto, 1);
                continue;
            }

            recintosFinais.push(`Recinto ${recintosPossiveis[recinto].cod} (espaço livre: ${recintosPossiveis[recinto].tamanho - tamanhoOcupado} total: ${recintosPossiveis[recinto].tamanho})`);
        }


        if (recintosFinais.length == 0) {
            return {
                erro: "Não há recinto viável"
            }
        }

        return {
            recintosViaveis: recintosFinais
        }

    }

}

console.log(new RecintosZoo().analisaRecintos("MACACO", 10));
export { RecintosZoo as RecintosZoo };
