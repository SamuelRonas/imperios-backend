import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export async function eventHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const body = JSON.parse(event.body ?? '{}');
        const { valueBar, calice, clava } = body;

        if (!valueBar || !calice || !clava) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "valueBar, calice e clava são obrigatórios" }),
            };
        }


        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ valueBar, calice, clava }),
        };

    } catch (err: any) {
        return {
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: err.message || "Erro interno" }),
        };
    }
}
