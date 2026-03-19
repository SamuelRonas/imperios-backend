import { userService } from "../users/user-service";
import { recoverPasswordService } from "./recover-password-service";



export const sendRecoveryEmail = async (event: any) => {
  console.log('[recover-password] Handler chamado', { body: event.body });
  const body = JSON.parse(event.body || '{}');
  const { email } = body;

  try {
    const user = await recoverPasswordService.sendEmail({ email });
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error: any) {
    console.error('[recover-password] Handler erro:', error?.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error?.message || 'Erro interno' }),
    };
  }
};

export const validateOtp = async (event: any) => {
  const body = JSON.parse(event.body || '{}');
  const { userID, otp } = body;

  try {
    const valid = await recoverPasswordService.validateOtp({ userID, otp });
    return {
      statusCode: 200,
      body: JSON.stringify({ valid }),
    };
  } catch (error: any) {
    console.error('[recover-password] Validate OTP error:', error?.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error?.message || 'Erro interno' }),
    };
  }
};