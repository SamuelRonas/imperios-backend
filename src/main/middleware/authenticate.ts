import { jwtVerify } from "jose"

export async function authenticate(event: any) {

  const authHeader =
    event.headers?.authorization || event.headers?.Authorization

  if (!authHeader) {
    throw new Error("Unauthorized")
  }

  const token = authHeader.replace("Bearer ", "")

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  const { payload } = await jwtVerify(token, secret)

  return payload
}