/**
 * Represents user login credentials.
 */
export interface LoginCredentials {
    /**
     * The user's email address.
     */
    email: string;

    /**
     * The user's password.
     */
    password: string;

    /**
     * The user's Lia_at Cookie.
     */
    li_at: string;
  }

  /**
   * Props for the `LoginForm` component.
   */
  export interface LoginFormProps {
    /**
     * The current login credentials entered by the user.
     */
    credentials: LoginCredentials;

    /**
     * Callback triggered when a login field changes.
     *
     * @param field - The field in the credentials object being updated.
     * @param value - The new value for the specified field.
     */
    onChange: (field: keyof LoginCredentials, value: string) => void;
  }
