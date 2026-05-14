export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignCredentials {
  email: string;
  password: string;
  role: string;
}


export interface AuthResponse {
  token: string;
}