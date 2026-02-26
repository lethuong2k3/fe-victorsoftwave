import Cookies from 'js-cookie';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const setTokens = (accessToken: string, refreshToken: string) => {
<<<<<<< HEAD
  Cookies.set(TOKEN_KEY, accessToken, {
    expires: 1,
    secure: window.location.protocol === 'https:',
  });

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    expires: 7,
    secure: window.location.protocol === 'https:',
  });

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => {
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || undefined;
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
=======
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
>>>>>>> b2df92e (first commit)
};

export const clearTokens = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
<<<<<<< HEAD
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
=======
>>>>>>> b2df92e (first commit)
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
<<<<<<< HEAD
=======

export const getAuthHeader = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
};
>>>>>>> b2df92e (first commit)
