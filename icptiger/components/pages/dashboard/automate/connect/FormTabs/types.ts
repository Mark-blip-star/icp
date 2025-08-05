export type FormMethod = "login" | "cookies";

/**
 * Represents a tab in the form with associated metadata.
 */
export interface Tab {
    /**
     * The label displayed on the tab.
     */
    label: string;

    /**
     * The icon element displayed on the tab.
     */
    icon: JSX.Element;

    /**
     * The value representing the form method associated with the tab.
     */
    value: FormMethod;
}