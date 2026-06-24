"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, UploadCloudIcon, TrashIcon, Loader2 } from "lucide-react";
import { uploadAvatar, getProfile, upsertProfile } from "@/lib/supabase/queries";

const countries = [
  { value: "cuba", label: "Cuba" },
  { value: "india", label: "India" },
  { value: "china", label: "China" },
  { value: "monaco", label: "Monaco" },
  { value: "serbia", label: "Serbia" },
  { value: "romania", label: "Romania" },
  { value: "mayotte", label: "Mayotte" },
  { value: "iraq", label: "Iraq" },
  { value: "syria", label: "Syria" },
  { value: "korea", label: "Korea" },
  { value: "zimbabwe", label: "Zimbabwe" },
];

const PersonalInfo = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        const parts = (profile.full_name || "").split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setMobile(profile.mobile || "");
        setCountry(profile.country || "");
        setGender(profile.gender || "");
        setAvatarUrl(profile.avatar_url);
        if (profile.avatar_url) setPreview(profile.avatar_url);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!file) {
      if (avatarUrl) setPreview(avatarUrl);
      else setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, avatarUrl]);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      window.alert("Please select an image file");
      e.currentTarget.value = "";
      return;
    }
    if (f.size > 1024 * 1024) {
      window.alert("File must be smaller than 1MB");
      e.currentTarget.value = "";
      return;
    }
    setFile(f);
  };

  const openPicker = () => inputRef.current?.click();

  const remove = () => {
    setFile(null);
    setPreview(avatarUrl);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      let url = avatarUrl;
      if (file) {
        url = await uploadAvatar(file);
        setAvatarUrl(url);
      }
      await upsertProfile({
        full_name: `${firstName} ${lastName}`.trim(),
        mobile: mobile || null,
        country: country || null,
        gender: gender || null,
        avatar_url: url,
      });
      setFile(null);
      setMessage({ type: "success", text: "Profile saved successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10">
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Personal Information</h3>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and role.
        </p>
      </div>

      <div className="space-y-6 lg:col-span-2">
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
        <form
          className="mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-6 w-full space-y-2">
            <Label>Your Avatar</Label>
            <div className="flex items-center gap-4">
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload your avatar"
                onClick={openPicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPicker();
                  }
                }}
                className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={openPicker}
                  className="flex items-center gap-2"
                >
                  <UploadCloudIcon />
                  Upload avatar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={remove}
                  disabled={!file && !avatarUrl}
                  className="text-destructive!"
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Pick a photo up to 1MB.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-first-name">
                First Name
              </Label>
              <Input
                id="multi-step-personal-info-first-name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-last-name">
                Last Name
              </Label>
              <Input
                id="multi-step-personal-info-last-name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-mobile">Mobile</Label>
              <Input
                id="multi-step-personal-info-mobile"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger
                  id="country"
                  className="[&>span_svg]:text-muted-foreground/80 w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 max-h-100 [&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      <span className="truncate">{country.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="user" disabled>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="max-sm:w-full">
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
