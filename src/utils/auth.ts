import Cookies from 'js-cookie';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const setTokens = (accessToken: string, refreshToken: string) => {
  // Access Token hết hạn sau 1 ngày
  Cookies.set(TOKEN_KEY, accessToken, { expires: 1, secure: window.location.protocol === 'https:' });
  
  // Refresh Token hết hạn sau 7 ngày
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, secure: window.location.protocol === 'https:' });
};

export const getAccessToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const getAuthHeader = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
};
