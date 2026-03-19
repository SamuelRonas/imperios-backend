import bcrypt from "bcryptjs";
import { get2faCode, save2faCode, delete2faCode, increment2faAttempts } from "../database/otp-repository";
import { UserRepository } from "../users/user-repository";
import { Resend } from 'resend';


const repo = new UserRepository();


export const recoverPasswordService = {

    async sendEmail(input: { email: string }) {
        console.log('[recover-password] Input de recuperação:', { email: input.email });

        const user = await repo.getByEmail(input.email);

        if (!user) {
            console.error('[recover-password] Email não encontrado:', input.email);
            throw new Error('Email não encontrado');
        }

        const resendKey =  're_gj8g2ap2_FaMT4RjgwrosWxdfmUUkiGSY';
        const resendFrom = 'onboarding@resend.dev';
        const resend = new Resend(resendKey);

        const otp = generateOTP();
        const codeHash = await bcrypt.hash(otp, 10);

        if (typeof user.userID !== 'string' || user.userID.length !== 36) {
            console.error('[recover-password] userID inválido antes de gravar OTP', { userID: user.userID });
            throw new Error('ID de usuário inválido. Entre em contato com o suporte.');
        }

        await save2faCode(user.userID, codeHash);

        try {
            const response = await resend.emails.send({
                from: resendFrom,
                to: user.email,
                subject: 'Recuperar Senha Imperios',
                html: `<p>Seu código de recuperação é: <strong>${otp}</strong></p>`,
            });

           
            return { userID: user.userID, email: user.email, resendResult: response };
        } catch (error: any) {
            throw new Error('Falha ao enviar email de recuperação: ' + (error?.message || 'erro desconhecido'));
        }
    },

    async validateOtp(input: { userID: string, otp: string }) {
        const { userID, otp } = input;

        if (typeof userID !== 'string' || userID.length !== 36) {
            console.error('[recover-password] validateOtp: userID inválido', { userID });
            throw new Error('ID de usuário inválido');
        }

        const item = await get2faCode(userID);
    
        if (!item) {
            throw new Error('Código OTP não encontrado para este usuário');
        }

        if (item.attempts >= 5) {
            throw new Error('Número máximo de tentativas atingido. Solicite um novo código.');
        }

        const valid = await bcrypt.compare(otp, item.codeHash);
        if (!valid) {
            await increment2faAttempts(userID);
            const remaining = 5 - (item.attempts + 1);
            throw new Error(`Código inválido. Restam ${remaining >= 0 ? remaining : 0} tentativas.`);
        }

        await delete2faCode(userID);
        return true;
    }
};


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}