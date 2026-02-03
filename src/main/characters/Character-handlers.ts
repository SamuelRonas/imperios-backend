import { CharacterService } from "./Character-service";
import { CharacterRepository } from "./CharacterRepository";
import { Status } from "./status/status";




const repo = new CharacterRepository();

export const createCharacter = async (event: any) => {
  const body = JSON.parse(event.body || "{}");

  const character = await new CharacterService().create(body);

  await repo.create(character);

  return {
    statusCode: 201,
    body: JSON.stringify(character)
  };
};

export const listCharacters = async () => {
  const characters = await repo.list();

  return {
    statusCode: 200,
    body: JSON.stringify(characters),
  };
};

export const updateCharacter = async (event: any) => {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body || "{}");

  const character = await repo.getById(id);

    const updated = {
    ...character,
    ...body,                                // 2. Atualiza só o enviado pelo usuário
  };

  updated.status = Status.calculateStatus(
    updated.classe,
    updated.atributos,
    updated.np
  );

   await repo.update(id, updated);

  return {
    statusCode: 200,
    body: JSON.stringify(updated),
  };
  
}
export const deleteCharacter = async (event: any) => {
  const id = event.pathParameters.id;

  await repo.delete(id);

  return {
    statusCode: 204,
    body: "",
  };
};