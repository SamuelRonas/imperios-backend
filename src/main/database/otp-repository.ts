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

export async function save2faCode(userID: string, codeHash: string) {

  const expiresAt = Math.floor(Date.now() / 1000) + 300 

  await docClient.send(
    new PutCommand({
      TableName: "two_factor_codes",
      Item: {
        userID,
        codeHash,
        expiresAt,
        attempts: 0
      }
    })
  )
}


export async function get2faCode(userID: string) {

  const result = await docClient.send(
    new GetCommand({
      TableName: "two_factor_codes",
      Key: { userID }
    })
  )

  return result.Item
}


export async function delete2faCode(userID: string) {

  await docClient.send(
    new DeleteCommand({
      TableName: "two_factor_codes",
      Key: { userID }
    })
  )
}

export async function increment2faAttempts(userID: string) {
  await docClient.send(
    new UpdateCommand({
      TableName: "two_factor_codes",
      Key: { userID },
      UpdateExpression: "SET attempts = if_not_exists(attempts, :zero) + :one",
      ExpressionAttributeValues: {
        ":one": 1,
        ":zero": 0,
      },
      ReturnValues: "UPDATED_NEW",
    })
  );
}

export async function get2faAttempts(userID: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName: "two_factor_codes",
      Key: { userID },
      ProjectionExpression: "attempts",
    })
  );
  return result.Item?.attempts ?? 0;
}