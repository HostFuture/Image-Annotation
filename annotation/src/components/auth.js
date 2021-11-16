import { createAuthProvider } from 'react-token-auth';

export const {useAuth, authFetch, login, logout} = createAuthProvider({
  getAccessToken: token => token.accessToken,  
  onUpdateToken: (token) => fetch('/user/refresh', {
    method: 'POST',
    body: token.refreshToken
  }).then(r => r.json())
});