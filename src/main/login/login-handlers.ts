import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { login } from './login-service';

export async function loginHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const body = JSON.parse(event.body ?? '{}');
        const { email, password } = body;

        if (!email || !password) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Email e Password são obrigatórios" }),
            };
        }

        const token  = await login(email, password);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ message: "Login realizado com sucesso", token }),
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
