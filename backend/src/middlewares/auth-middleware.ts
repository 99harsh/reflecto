import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env; 
interface UserPayload{
    name: string,
    email: string,
    user_id: number,
}

export const createUserAuthToken = (payload: UserPayload) => {
    return new Promise((resolve, reject) => {
        try {
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: '24d'
            });
            resolve(token);
        } catch (error: any) {
            reject(error);
        }
    });
}