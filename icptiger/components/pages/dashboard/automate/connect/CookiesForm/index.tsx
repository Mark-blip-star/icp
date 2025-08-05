import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cookie, KeyRound } from "lucide-react";
import { Cookies, CookiesFormProps } from "./types";
import { Lock, Mail } from "lucide-react";
import { FormErrorMessage } from "@/app/(protected)/dashboard/automate/components/FormErrorMessage";

/**
 * CookiesForm Component
 *
 * A form for entering LinkedIn cookies: `li_at` and `JSESSIONID`.
 *
 * @param cookies - Object containing the current cookie values.
 * @param onChange - Callback function to handle cookie input changes.
 */
export const CookiesForm: React.FC<CookiesFormProps> = ({
  cookies,
  onChange,
  error,
}) => {
  const handleChange = useCallback(
    (key: keyof Cookies, value: string) => {
      onChange(key, value);
    },
    [onChange]
  );

  return (
    <>
      {/* li_at field */}
      <FormErrorMessage message={error} />
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
                  value={cookies?.email}
                  onChange={(e) => handleChange("email", e.target.value)}
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
                  value={cookies?.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 border-2 focus:border-black transition-colors"
                />
                <div className="absolute left-3 top-2.5 text-gray-500">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>
      <div className="space-y-2">
        <Label htmlFor="li_at" className="font-outfit">
          li_at
        </Label>
        <div className="relative">
          <Input
            id="li_at"
            type="text"
            placeholder="Paste your li_at token"
            value={cookies?.li_at || ""}
            onChange={(e) => handleChange("li_at", e.target.value)}
            className="pl-10 border-2 focus:border-black transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <Cookie className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* JSESSIONID field */}
      <div className="space-y-2 mt-4">
        <Label htmlFor="li_a" className="font-outfit">
          li_a{" "}
          <span className="font-normal text-[#3e3c3c]">
            (If your account has Recruiter or Sales Navigator subscription)
          </span>
        </Label>
        <div className="relative">
          <Input
            id="li_a"
            type="text"
            placeholder="Paste your li_a token (Optional)"
            value={cookies?.li_a || ""}
            onChange={(e) => handleChange("li_a", e.target.value)}
            className="pl-10 border-2 focus:border-black transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>
      </div>
    </>
  );
};
