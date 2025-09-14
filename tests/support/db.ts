import pgPromise from 'pg-promise';

// Interface para o resultado da consulta
interface TwoFactorCodeResult {
    code: string;
}

// Configuração do banco de dados
const pgp = pgPromise({});

// Usar variáveis de ambiente para dados sensíveis
const connectionString =  'postgres://dba:dba@paybank-db:5432/UserDB';
const db = pgp(connectionString);

// Função para buscar o código 2FA mais recente
export const get2FACode = async (): Promise<string | null> => {
    try {
        const query = `
            SELECT code
            FROM public."TwoFactorCode"
            ORDER BY id DESC
            LIMIT 1
        `;

        const result = await db.oneOrNone<TwoFactorCodeResult>(query);
        return result?.code || null;
    } catch (error) {
        console.error('Erro ao buscar código 2FA:', error);
        return null;
    }
}

