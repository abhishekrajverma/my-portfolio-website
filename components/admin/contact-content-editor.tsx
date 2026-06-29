"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { PortfolioAdminShell } from "@/components/admin/portfolio-admin-shell";
import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { SOCIAL_PLATFORMS } from "@/lib/content/constants";
import {
  createEmptySocialLink,
  sanitizeSocialLinksForSave,
} from "@/lib/content/contact-helpers";
import type { ContactContent, SocialLink, SocialPlatform } from "@/lib/content/types";

export function ContactContentEditor({
  initialContent,
}: {
  initialContent: ContactContent;
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [content, setContent] = useState<ContactContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const updateSocialLink = (index: number, link: SocialLink) => {
    setContent((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((item, i) => (i === index ? link : item)),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    const payload: ContactContent = {
      ...content,
      socialLinks: sanitizeSocialLinksForSave(content.socialLinks),
    };

    try {
      const response = await fetch("/api/admin/content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save.");
      }

      showToast("Contact section saved successfully.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const socialLinks =
    content.socialLinks.length > 0 ? content.socialLinks : [createEmptySocialLink()];

  return (
    <PortfolioAdminShell
      title="Contact"
      viewSiteHref="/#contact"
      action={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      }
    >
      <GlassCard className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={content.email}
              onChange={(e) => setContent({ ...content, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={content.phone}
              onChange={(e) => setContent({ ...content, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={content.location}
            onChange={(e) => setContent({ ...content, location: e.target.value })}
          />
        </div>

        <div className="space-y-4 border-t border-border/60 pt-4">
          <div className="space-y-1">
            <Label>Social media links</Label>
            <p className="text-sm text-muted-foreground">
              Add as many profiles as you want. They appear in the contact section.
            </p>
          </div>

          {socialLinks.map((link, index) => (
            <div
              key={link.id}
              className="space-y-3 rounded-xl border border-border/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Link {index + 1}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      socialLinks: current.socialLinks.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <select
                    value={link.platform}
                    onChange={(e) =>
                      updateSocialLink(index, {
                        ...link,
                        platform: e.target.value as SocialPlatform,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Display text</Label>
                  <Input
                    value={link.label}
                    onChange={(e) =>
                      updateSocialLink(index, { ...link, label: e.target.value })
                    }
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(index, { ...link, url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setContent((current) => ({
                ...current,
                socialLinks: [...current.socialLinks, createEmptySocialLink()],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add social link
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Availability title</Label>
          <Input
            value={content.availabilityTitle}
            onChange={(e) =>
              setContent({ ...content, availabilityTitle: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Availability text</Label>
          <Textarea
            value={content.availabilityText}
            onChange={(e) =>
              setContent({ ...content, availabilityText: e.target.value })
            }
            rows={3}
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </GlassCard>
    </PortfolioAdminShell>
  );
}
