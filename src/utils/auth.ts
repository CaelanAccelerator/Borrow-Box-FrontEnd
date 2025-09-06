// 判断是否登录
export const isLoggedIn = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

// 获取 token
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// 获取用户ID
export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  return null;
};

// 获取用户名
export const getUsername = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('username');
  }
  return null;
};

// 登出，清除所有用户信息
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
  }
};