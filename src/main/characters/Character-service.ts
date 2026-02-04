import { Status } from "./status/status";
import { Character, Classe } from "./types";
import { randomUUID } from "node:crypto";

export class CharacterService {
    async create(data: any) {


        const allowedClasses: Classe[] = [
            "combatente",
            "inumano",
            "especialista",
        ];

        if (!allowedClasses.includes(data.classe)) {
            throw new Error(`Classe inválida: ${data.classe}`);
        }

        const nivel = normalizeNivel(data.np ?? 0);

        // TODO retirar isso
        function normalizeNivel(nivel: number): number {
            if (nivel < 0) return 0;
            if (nivel > 100) return 100;
            return Math.round(nivel / 5) * 5;
        }

        const status = Status.calculateStatus(data.classe, data.atributos, nivel);


        const character: Character = {
            id: randomUUID(),
            nome: data.nome,
            classe: data.classe,
            np: nivel,
            descricao: data.descricao,
            imagem: data.imagem,
            atributos: data.atributos,
            status: status,
        };

        return character;
    }
}


