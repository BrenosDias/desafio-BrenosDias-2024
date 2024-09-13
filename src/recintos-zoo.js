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

    //Testa se o macaco ficará sozinho no recinto
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

    //Testa se o hipopotamo não tolerará ficar neste recinto
    tolerancia(recinto) {
        if (recinto.animais.length > 0 && recinto.biomas != ["Savana", "Rio"]) {
            return false;
        }

        return true;
    }
}


class RecintosZoo {
    //Inicializa os animais possíveis
    constructor() {
        this.animais = [
            new Animal("LEAO", ["Savana"], 3, true),
            new Animal("LEOPARDO", ["Savana"], 2, true),
            new Animal("CROCODILO", ["Rio"], 3, true),
            new Macaco(),
            new Animal("GAZELA", ["Savana"], 2, false),
            new Hipopotamo()
        ]
    //Inicializa os recintos existentes
        this.recintos = [
            new Recinto(1, ["Savana"], 10, [this.animais[3], this.animais[3], this.animais[3]]),
            new Recinto(2, ["Floresta"], 5, []),
            new Recinto(3, ["Savana", "Rio"], 7, [this.animais[4]]),
            new Recinto(4, ["Rio"], 8, []),
            new Recinto(5, "Savana", 9, [this.animais[0]]),
        ]
    }

    analisaRecintos(animal, quantidade) {

        //Variavel que guardará o animal a ser verificado
        let animalNovo = null;
        //Verifica quantidade
        if (quantidade <= 0) {
            return {
                erro: "Quantidade inválida"
            }
        }
        //Encontra o animal passado e salva na vaiavel animalNovo
        for (const especie of this.animais) {

            if (animal === especie.nome) {
                animalNovo = especie;
                break;
            }
        }
        //Caso o animal passado não seja encontrado, retorna erro
        if (animalNovo == null) {
            return {
                erro: "Animal inválido"
            }
        }
        //Array que guardará os recintos possíveis para cada animal
        const recintosPossiveis = [];

        //Verifica se os bioma do animal são compatíveis aos do recinto
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

                //Verifica se os animais que já estão no recinto são carnivoros
                if (especie.carnivoro == true) {
                    //Verifica se a especie do animalNovo é a mesma do animal carnivoro que está no recinto
                    if (especie.nome != animalNovo.nome) {
                        recintosPossiveis.splice(recinto, 1); //Retiro o recinto incompativel do vetor de recintos possivéis
                        break;
                    }
                }
                else {//Verifica se o animalNovo é carnivoro
                    if (animalNovo.carnivoro == true) {
                        recintosPossiveis.splice(recinto, 1);  //Retiro o recinto incompativel do vetor de recintos possivéis
                        break;
                    }
                }
            }
        }

        //Verifica se não há recintos viaveis para este animal
        if (recintosPossiveis.length == 0) {
            return {
                erro: "Não há recinto viável"
            }
        }


        //Testa se o macaco ficaria sozinho neste recintos
        if (animalNovo.nome == 'MACACO') {
            for (const recinto in recintosPossiveis) {
                if (!animalNovo.acompanhado(recintosPossiveis[recinto], quantidade)) {
                    recintosPossiveis.splice(recinto, 1);
                }
            }
        }
        //Testa se o hipopotamo tolera ficar nestes recintos
        if (animalNovo.nome == 'HIPOPOTAMO') {
            for (const recinto in recintosPossiveis) {
                if (!animalNovo.tolerancia(recintosPossiveis[recinto])) {
                    recintosPossiveis.splice(recinto, 1);
                }
            }
        }

        //Vetor que será retornará ao final os recintos viáveis
        const recintosFinais = [];

        for (const recinto in recintosPossiveis) {
            //Calcula o tamanho ocupado pelos animais que estão sendo adicionados e os que já estavam no recinto antes
            let tamanhoOcupado = recintosPossiveis[recinto].animais.reduce((soma, animal) => soma + animal.tamanho, 0)
                + (animalNovo.tamanho * quantidade);
            //Caso o recinto possua mais de uma especie diferente o tamanho ocupado passa a ser 1 maior
            for (const animal of recintosPossiveis[recinto].animais) {
                if (animal.nome != animalNovo.nome) {
                    tamanhoOcupado = tamanhoOcupado + 1;
                }
            }

            //Verifica se o tamanho ocupado é maior que o tamanho total
            if (tamanhoOcupado > recintosPossiveis[recinto].tamanho) {
                recintosPossiveis.splice(recinto, 1);
                continue;
            }

            //Adiciona a array a string que será retornada ao fim, já de forma formatada com os dados necessários
            recintosFinais.push(`Recinto ${recintosPossiveis[recinto].cod} (espaço livre: ${recintosPossiveis[recinto].tamanho - tamanhoOcupado} total: ${recintosPossiveis[recinto].tamanho})`);
        }

        //Verifica mais uma vez se ainda existem recintos viáveis, caso não haja, retorna um erro
        if (recintosFinais.length == 0) {
            return {
                erro: "Não há recinto viável"
            }
        }

        //Retorna a array com as strings informando os recintos viáveis para o animal
        return {
            recintosViaveis: recintosFinais
        }

    }

}

export { RecintosZoo as RecintosZoo };
