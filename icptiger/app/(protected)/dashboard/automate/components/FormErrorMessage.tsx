import { AlertCircle } from "lucide-react";

interface FormErrorMessageProps {
  message: string | null;
}

/**
 * Displays form error messages with alert styling
 *
 * @component
 * @param {FormErrorMessageProps} props - Component props
 * @returns {JSX.Element | null} Error message component or null if no message
 */
export const FormErrorMessage = ({
  message,
}: FormErrorMessageProps): JSX.Element | null => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 mt-4 mb-4">
      <p className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        {message}
      </p>
    </div>
  );
};
