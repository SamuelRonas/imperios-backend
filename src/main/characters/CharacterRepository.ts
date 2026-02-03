import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { Character } from "./types";
import { Status } from "./status/status";






const isOffline = process.env.IS_OFFLINE === "true";

export const client = new DynamoDBClient({
  region: isOffline ? "localhost" : "us-east-1",
  endpoint: isOffline ? "http://localhost:8000" : undefined,
  credentials: isOffline
    ? {
        accessKeyId: "LOCAL_FAKE_KEY",
        secretAccessKey: "LOCAL_FAKE_SECRET",
      }
    : undefined,
});


const docClient = DynamoDBDocumentClient.from(client);

const TABLE = "characters-table";

export class CharacterRepository {

  async create(character: Character) {
    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: character,
      })
    );
    return character;
  }

  async getById(id: string) {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: { id },
      })
    );
    return result.Item as Character | undefined;
  }

  async list() {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE,
      })
    );
    return result.Items as Character[];
  }


  async update(id: string, updates: Partial<Character>) {

    if ("id" in updates) delete updates.id;


    // 1) Buscar o personagem atual
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error("Personagem não encontrado");
    }

    // 2) Mesclar dados de forma segura
    const merged = {
      ...existing,
      ...updates,
      atributos: {
        ...existing.atributos,
        ...(updates.atributos ?? {})  // <- evita undefined
      }
    };
    const toNum = (v: any) => (typeof v === "string" ? Number(v) : v ?? 0);

    // Garantir que todos os atributos estejam presentes e sejam números
    const safeAtributos = {
      forca: toNum(merged.atributos.forca) ?? 0,
      vigor: toNum(merged.atributos.vigor) ?? 0,
      intelecto: toNum(merged.atributos.intelecto) ?? 0,
      agilidade: toNum(merged.atributos.agilidade) ?? 0,
      presenca: toNum(merged.atributos.presenca) ?? 0,
    };

    // 3) Recalcular status automaticamente
    const np = toNum(merged.np ?? existing.np);



    merged.status = {
      pv: Status.pv(merged.classe, safeAtributos, np),
      pe: Status.pe(merged.classe, safeAtributos, np),
      ps: Status.ps(merged.classe, np)
    };
    console.log("DEBUG → Status calculado antes do put:", JSON.stringify(merged.status, null, 2));



    // 4) PUT do objeto inteiro
    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: merged
      })
    );

    return merged;
  }




  async delete(id: string) {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { id },
      })
    );
  }
}
