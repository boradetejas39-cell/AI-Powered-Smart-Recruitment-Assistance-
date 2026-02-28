/**
 * Safe Google Login hook – wraps @react-oauth/google's useGoogleLogin
 * so it doesn't crash when GoogleOAuthProvider is absent (i.e. when
 * REACT_APP_GOOGLE_CLIENT_ID is not set).
 */
import { useGoogleLogin as _useGoogleLogin } from '@react-oauth/google';

const GOOGLE_ENABLED = !!process.env.REACT_APP_GOOGLE_CLIENT_ID;

/**
 * Drop-in replacement for useGoogleLogin.
 * Returns a no-op function when Google OAuth is not configured.
 */
export function useSafeGoogleLogin(options) {
    // Hooks must be called unconditionally, but we can guard the import.
    // When the provider is missing the hook itself throws, so we need a
    // try/catch fallback.
    if (!GOOGLE_ENABLED) {
        return () => {
            console.warn('Google OAuth is not configured – skipping Google login');
        };
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return _useGoogleLogin(options);
}

export { GOOGLE_ENABLED };
