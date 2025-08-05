import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import { ChangeEvent } from "react";
import { Cookie, KeyRound } from "lucide-react";
import { LoginCredentials, LoginFormProps } from "./types";

/**
 * LoginForm component for LinkedIn credentials input.
 *
 * Renders email and password input fields with icons.
 *
 * @component
 * @param {LoginFormProps} props - Props containing credentials and change handler.
 * @returns {JSX.Element} The rendered login form.
 */
export const LoginForm = ({ credentials, onChange }: LoginFormProps): JSX.Element => {
  const handleInputChange =
    (field: keyof LoginCredentials) => (e: ChangeEvent<HTMLInputElement>) =>
      onChange(field, e.target.value);

  return (
    <>
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-outfit">
          LinkedIn Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={credentials.email}
            onChange={handleInputChange("email")}
            className="pl-10 border-2 focus:border-black transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="font-outfit">
          LinkedIn Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange("password")}
            className="pl-10 border-2 focus:border-black transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Li_a Token Field */}
      <div className="space-y-2">
        <Label htmlFor="li_at" className="font-outfit">
          li_at
        </Label>
        <div className="relative">
          <Input
            id="li_at"
            type="text"
            placeholder="Paste your li_at token"
            value={credentials.li_at || ""}
            onChange={handleInputChange("li_at")}
            className="pl-10 border-2 focus:border-black transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <Cookie className="h-5 w-5" />
          </div>
        </div>
      </div>
    </>
  );
};
