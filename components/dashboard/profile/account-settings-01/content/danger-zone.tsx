"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2Icon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DangerZone = () => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.rpc("delete_user_account");
      if (deleteError) throw deleteError;
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10">
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Danger Zone</h3>
        <p className="text-muted-foreground text-sm">
          Delete your account permanently. This action will remove all your data
          and cannot be undone{" "}
          <a
            href="#"
            className="text-card-foreground font-medium hover:underline"
          >
            Learn more
          </a>
        </p>
      </div>

      <div className="space-y-6 lg:col-span-2">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        <Card>
          <CardContent>
            <div className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Delete account</h3>
                <p className="text-muted-foreground text-sm">
                  Delete your account permanently. This action will remove all
                  your data and cannot be undone.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-lg:w-full"
                  >
                    <Trash2Icon />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="space-y-2">
                    <DialogTitle>Delete account</DialogTitle>
                    <div className="text-muted-foreground text-sm">
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </div>
                  </DialogHeader>
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                    <DialogClose asChild>
                      <Button variant="outline" disabled={deleting}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                    >
                      {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DangerZone;
