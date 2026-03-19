import { SignJWT } from "jose"
import bcrypt from "bcryptjs"


import { UserRepository } from "../users/user-repository";


const repo = new UserRepository();
export async function login(email: string, password: string) {

  const user = await repo.getByEmail(email)

  if (!user) {
    throw new Error("Email não encontrado")
  }



  const valid = await bcrypt.compare(password, user.passwordHash)

  if (!valid) {
    throw new Error("Senha Invalida")
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  const token = await new SignJWT({ userID: user.userID })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret)

  return token

}
