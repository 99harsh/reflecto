import { AuthConfig } from 'angular-oauth2-oidc';
import { env } from './env';

export const authConfig: AuthConfig = {

    issuer: 'https://accounts.google.com',

    // redirectUri: 'http://localhost:4200/callback',
    redirectUri: 'https://habitup.inspex.dev/callback',
    clientId: env.GOOGLE_CLIENT_ID,

    scope: 'openid profile email',

    strictDiscoveryDocumentValidation: false,

};

