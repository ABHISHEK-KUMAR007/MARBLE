import type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
} from '@/types'

const API_URL = 'http://localhost:8080/api'

const STORAGE_KEYS = {
  user: 'admin_user',
  tokens: 'admin_tokens',
  remember: 'admin_remember',
} as const


// ==========================================
// SAVE LOGIN SESSION
// ==========================================
function persistSession(
  user: AuthUser,
  tokens: AuthTokens,
  rememberMe: boolean,
) {
  // Remove any old/mock login data first
  clearStorage()

  const storage = rememberMe
    ? localStorage
    : sessionStorage

  storage.setItem(
    STORAGE_KEYS.user,
    JSON.stringify(user),
  )

  storage.setItem(
    STORAGE_KEYS.tokens,
    JSON.stringify(tokens),
  )

  localStorage.setItem(
    STORAGE_KEYS.remember,
    String(rememberMe),
  )
}


// ==========================================
// CLEAR LOGIN SESSION
// ==========================================
function clearStorage() {
  localStorage.removeItem(
    STORAGE_KEYS.user,
  )

  localStorage.removeItem(
    STORAGE_KEYS.tokens,
  )

  localStorage.removeItem(
    STORAGE_KEYS.remember,
  )

  sessionStorage.removeItem(
    STORAGE_KEYS.user,
  )

  sessionStorage.removeItem(
    STORAGE_KEYS.tokens,
  )
}


// ==========================================
// READ LOGIN SESSION
// ==========================================
function readStoredSession(): {
  user: AuthUser
  tokens: AuthTokens
} | null {

  const remember =
    localStorage.getItem(
      STORAGE_KEYS.remember,
    ) === 'true'

  const storage = remember
    ? localStorage
    : sessionStorage

  const userRaw =
    storage.getItem(
      STORAGE_KEYS.user,
    )

  const tokensRaw =
    storage.getItem(
      STORAGE_KEYS.tokens,
    )

  if (!userRaw || !tokensRaw) {
    return null
  }

  try {

    const user =
      JSON.parse(userRaw) as AuthUser

    const tokens =
      JSON.parse(tokensRaw) as AuthTokens


    // Check JWT expiration
    if (
      tokens.expiresAt &&
      tokens.expiresAt < Date.now()
    ) {

      clearStorage()

      return null
    }

    return {
      user,
      tokens,
    }

  } catch {

    clearStorage()

    return null
  }
}


// ==========================================
// AUTH SERVICE
// ==========================================
export const authService = {


  // ========================================
  // LOGIN
  // ========================================
  async login(
    credentials: LoginCredentials,
  ): Promise<{
    user: AuthUser
    tokens: AuthTokens
  }> {

    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          email:
            credentials.email.trim(),

          password:
            credentials.password,
        }),
      },
    )


    // ======================================
    // LOGIN FAILED
    // ======================================
    if (!response.ok) {

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          'Invalid email or password.',
        )
      }

      throw new Error(
        'Unable to login. Please try again.',
      )
    }


    // ======================================
    // READ SPRING BOOT RESPONSE
    // ======================================
    const data = await response.json()


    /*
     * Expected Spring Boot response:
     *
     * {
     *   "token": "eyJhbGciOi...",
     *   "id": 1,
     *   "fullName": "Rajesh Kumar",
     *   "email": "admin@aureostone.com"
     * }
     */


    // ======================================
    // CREATE FRONTEND USER
    // ======================================
    const user: AuthUser = {

      id: Number(
        data.id ??
        1
      ),

      name:
        data.fullName ??
        'Administrator',

      email:
        data.email ??
        credentials.email,

      avatar:
        data.avatar ??
        undefined,

      role:
        data.role ??
        'SUB_ADMIN',
    }


    // ======================================
    // CREATE TOKEN OBJECT
    // ======================================
    const tokens: AuthTokens = {

      accessToken:
        data.token,

      /*
       * You are currently not using
       * refresh tokens.
       */
      refreshToken: '',

      /*
       * Must match your JWT backend
       * expiration time.
       *
       * Currently assuming 24 hours.
       */
      expiresAt:
        Date.now() +
        24 * 60 * 60 * 1000,
    }


    // ======================================
    // VALIDATE JWT RESPONSE
    // ======================================
    if (!tokens.accessToken) {

      throw new Error(
        'Authentication token was not received from server.',
      )
    }


    // ======================================
    // SAVE SESSION
    // ======================================
    persistSession(
      user,
      tokens,
      credentials.rememberMe ??
        false,
    )


    return {
      user,
      tokens,
    }
  },


  // ========================================
  // LOGOUT
  // ========================================
  logout() {

    clearStorage()
  },


  // ========================================
  // GET CURRENT SESSION
  // ========================================
  getSession(): {
    user: AuthUser
    tokens: AuthTokens
  } | null {

    return readStoredSession()
  },


  // ========================================
  // CHECK AUTHENTICATION
  // ========================================
  isAuthenticated(): boolean {

    return (
      readStoredSession() !== null
    )
  },


  // ========================================
  // GET JWT ACCESS TOKEN
  // ========================================
  getAccessToken(): string | null {

    return (
      readStoredSession()
        ?.tokens
        .accessToken ??
      null
    )
  },


  // ========================================
  // REFRESH TOKEN
  // ========================================
  async refreshToken():
    Promise<AuthTokens | null> {

    /*
     * Refresh tokens are not implemented
     * in Spring Boot yet.
     */

    return null
  },
}