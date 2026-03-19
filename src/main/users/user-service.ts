import bcrypt from "bcryptjs"
import { randomUUID } from "node:crypto";

import { userSchema } from "./types";
import { UserRepository } from "./user-repository";



const repo = new UserRepository();

export const userService = {


    async createUser(input: { email: string, password: string }) {

        const password = passwordValidate(input.password);

        const passwordHash = await bcrypt.hash(password, 10);

        const user = userSchema.parse({
            userID: randomUUID(),
            email: input.email.toLowerCase(),
            passwordHash
        })
        const existing = await repo.getByEmail(input.email)

        if (existing) {
            throw new Error("Email já cadastrado")
        }


        await repo.create(user);

        const { passwordHash: _, ...safeUser } = user


        return safeUser;
    },

    async listUsers() {
        const users = await repo.list();
        return users.map(({ passwordHash: _, ...safeUser }) => safeUser);
    }
}

function passwordValidate(password: string): string {
    if (/^(.)\1+$/.test(password)) {
        throw new Error("A senha não pode conter todos os caracteres iguais.");
    }

    // qualquer caractere repetido três vezes seguidas
    if (/(.)\1\1/.test(password)) {
        throw new Error("A senha não pode conter três caracteres iguais em sequência.");
    }

    // verifica se há 3 ou mais caracteres em sequência ascendente/descendente
    const hasSequential = (str: string) => {
        for (let i = 0; i < str.length - 2; i++) {
            const a = str.charCodeAt(i);
            const b = str.charCodeAt(i + 1);
            const c = str.charCodeAt(i + 2);
            if (b === a + 1 && c === b + 1) return true;
            if (b === a - 1 && c === b - 1) return true;
        }
        return false;
    };
    if (hasSequential(password)) {
        throw new Error("A senha não pode ser uma sequência simples (ex.: 1234, abcd, dcba).");
    }

    return password;



}
