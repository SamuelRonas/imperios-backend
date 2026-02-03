import { Atributos, Classe } from "../types";

export class Status {

    static calculateStatus = (classe: Classe, atributos: Atributos, np: number, modificador?: number) => {
            console.log("DEBUG → Entrada para calcular status:", JSON.stringify({classe, atributos, np, modificador}, null, 2));
       return {
              pv: Status.pv(classe, atributos, np, modificador),
              pe: Status.pe(classe, atributos, np, modificador),
              ps: Status.ps(classe, np)
       }
    }
    
    
    static pv(classe: Classe, atributos: Atributos, np: number, modificador?: number): number {
        switch (classe) {
            case "combatente":
                return Math.floor(20 + atributos.vigor + (atributos.vigor + 4) * np / 5) + (modificador || 0);
            case "inumano":
                return Math.floor(14 + atributos.vigor + (atributos.vigor + 3) * np / 5) + (modificador || 0);
            case "especialista":
                return Math.floor(16 + atributos.vigor + (atributos.vigor + 3) * np / 5) + (modificador || 0);
            default:
                throw new Error(`Classe inválida: ${classe}`);
        }
    }

    static pe(classe: Classe, atributos: Atributos, np: number, modificador?: number): number {
        switch (classe) {
            case "combatente":
                return Math.floor(20 + atributos.presenca + (atributos.presenca + 2) * np / 5) + (modificador || 0);
            case "inumano":
                return Math.floor(4 + atributos.presenca + (atributos.presenca + 4) * np / 5) + (modificador || 0);
            case "especialista":
                return Math.floor(3 + atributos.presenca + (atributos.presenca + 3) * np / 5) + (modificador || 0);
            default:
                throw new Error(`Classe inválida: ${classe}`);
        }

    }

    static ps(classe: Classe, np: number): number {
        switch (classe) {
            case "combatente":
                return 12 + Math.floor((np / 5)*3);
            case "inumano":
                return 18 + Math.floor((np / 5)*5);
            case "especialista":
                return 16 + Math.floor((np / 5)*4);
            default:
                throw new Error(`Classe inválida: ${classe}`);
        }
    }

}