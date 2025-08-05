/**
 * Represents LinkedIn session cookies.
 */
export interface Cookies {
   /**
   * The `Email` cookie used for session tracking.
   */
   email: string;

    /**
   * The `Password` cookie used for session tracking.
   */
  password: string;


  /**
   * The `li_at` cookie used for authentication.
   */
  li_at: string;

  /**
   * The `jsessionid` cookie used for session tracking.
   */
  li_a: string;
}

/**
 * Props for the `CookiesForm` component.
 */
export interface CookiesFormProps {
  /**
   * The current cookie values.
   */
  cookies?: Cookies;

  /**
   * Callback triggered when a cookie value changes.
   *
   * @param key - The key of the cookie being updated.
   * @param value - The new value of the cookie.
   */
  onChange: (key: keyof Cookies, value: string) => void;
}
