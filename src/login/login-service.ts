
import { User } from "../users/types";


const userAdm: User = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    password: "1234",
    email: "adm@email.com"
} 
const userMatheusHml: User = {
    id: "df29242b-4b29-4c4e-b03e-a63059a28ab8",
    password: "1234",
    email: "matheus@gmail.com"
} 
const userPauloHml: User = {
    id: "f981d904-a9a3-4e3d-bd4f-2fff94cd3c24",
    password: "Hay123588",
    email: "hanamy513@gmail.com"
} 

const users: User[] = [userAdm, userMatheusHml, userPauloHml];

export function validaUser(email: string, password: string): User["id"] {
    const foundUser = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
        throw new Error("Email ou senha inválidos");
    }

    return foundUser.id;
}


