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
import { Users } from "./types";


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

const TABLE = "users";

export class UserRepository {

  async create(user: Users): Promise<Users> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: user,
      })
    );
    return user;
  }

  async getById(id: string) {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: { id },
      })
    );
    return result.Item as Users | undefined;
  }


  async getByEmail(email: string) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );
    return result.Items?.[0] as Users | undefined;
  }



  async list() {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE,
      })
    );
    return result.Items as Users[];
  }
}