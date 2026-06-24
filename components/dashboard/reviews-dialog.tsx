"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} mes${months > 1 ? "es" : ""}`;
  const years = Math.floor(months / 12);
  return `hace ${years} año${years > 1 ? "s" : ""}`;
}


interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile: { full_name: string | null } | null;
}

interface ReviewsDialogProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewsDialog({
  propertyId,
  propertyTitle,
  open,
  onOpenChange,
}: ReviewsDialogProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchReviews = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: rawReviews } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, user_id")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (rawReviews) {
        const userIds = [...new Set(rawReviews.map((r) => r.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        const profileMap = new Map(
          (profiles ?? []).map((p) => [p.id, p.full_name]),
        );

        setReviews(
          rawReviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            profile: { full_name: profileMap.get(r.user_id) ?? null },
          })),
        );
      }
      setLoading(false);
    };
    fetchReviews();
  }, [open, propertyId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reseñas</DialogTitle>
          <DialogDescription>{propertyTitle}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay reseñas todavía
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {review.profile?.full_name || "Anónimo"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(new Date(review.created_at))}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "size-3.5",
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground",
                      )}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
