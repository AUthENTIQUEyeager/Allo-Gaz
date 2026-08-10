"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { createReview } from "@/lib/actions/reviews";

export default function ReviewButton({ order }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);

  if (sent) return <span className="text-xs text-green-600">Avis envoye, merci !</span>;

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-medium text-flame-500">
        Laisser un avis
      </button>
    );
  }

  async function handleSubmit(formData) {
    formData.set("order_id", order.id);
    formData.set("vendor_id", order.vendor_id);
    formData.set("rating", rating);
    const result = await createReview(formData);
    if (result?.success) setSent(true);
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            onClick={() => setRating(n)}
            className={`h-4 w-4 cursor-pointer ${n <= rating ? "fill-ember-400 text-ember-400" : "text-black/15"}`}
          />
        ))}
      </div>
      <input type="hidden" name="comment" value="" />
      <Button type="submit" variant="ghost" className="px-2 py-1 text-xs">
        Envoyer
      </Button>
    </form>
  );
}
