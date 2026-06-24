"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { MailIcon, EyeOffIcon, EyeIcon, CheckIcon, XIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const requirements = [
  { regex: /.{12,}/, text: "At least 12 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character",
  },
];

const EmailPass = () => {
  const supabase = createClient();
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const strength = requirements.map((req) => ({
    met: req.regex.test(password),
    text: req.text,
  }));

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-destructive";
    if (score <= 2) return "bg-orange-500 ";
    if (score <= 3) return "bg-amber-500";
    if (score === 4) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score <= 3) return "Medium password";
    if (score === 4) return "Strong password";
    return "Very strong password";
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      setPassword("");
      setCurrentPassword("");
      setMessage({ type: "success", text: "Password updated successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update password" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });
      if (error) throw error;
      setMessage({ type: "success", text: "Verification email sent. Check your inbox." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update email" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10">
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Email & Password</h3>
        <p className="text-muted-foreground text-sm">
          Manage your email and password settings.
        </p>
      </div>

      <div className="lg:col-span-2">
        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mx-auto space-y-8">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveEmail(); }}>
            <div className="w-full space-y-2">
              <Label htmlFor="email" className="gap-1">
                Email<span className="text-destructive">*</span>
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <InputGroupAddon align="inline-end" className="pr-2.75">
                  <MailIcon className="size-4" />
                  <span className="sr-only">Email</span>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving || !email} className="max-sm:w-full">
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Update Email
              </Button>
            </div>
          </form>

          <form className="space-y-6" onSubmit={handleSavePassword}>
            <div className="w-full space-y-2">
              <Label htmlFor="new-password" className="gap-1">
                New Password
                <span className="text-destructive">*</span>
              </Label>
              <InputGroup className="mb-3">
                <InputGroupInput
                  id="new-password"
                  type={isVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroupAddon align="inline-end" className="pr-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleVisibility}
                    className="text-muted-foreground focus-visible:ring-ring/50 rounded-l-none hover:bg-transparent"
                  >
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className="sr-only">
                      {isVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </InputGroupAddon>
              </InputGroup>

              <div className="mb-4 flex h-1 w-full gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-full flex-1 rounded-full transition-all duration-500 ease-out",
                      index < strengthScore
                        ? getColor(strengthScore)
                        : "bg-border",
                    )}
                  />
                ))}
              </div>

              <p className="text-foreground text-sm font-medium">
                {getText(strengthScore)}. Must contain :
              </p>

              <ul className="mb-4 space-y-1.5">
                {strength.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {req.met ? (
                      <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XIcon className="text-muted-foreground size-4" />
                    )}
                    <span
                      className={cn(
                        "text-xs",
                        req.met
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {req.text}
                      <span className="sr-only">
                        {req.met
                          ? " - Requirement met"
                          : " - Requirement not met"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={saving || !password} className="max-sm:w-full">
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailPass;
