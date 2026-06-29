"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { PortfolioAdminShell } from "@/components/admin/portfolio-admin-shell";
import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import type { AboutContent } from "@/lib/content/types";
import type { Education, Experience } from "@/types";

function isRenderableImageUrl(url: string): boolean {
  if (!url.trim()) return false;
  if (url.startsWith("/")) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const displayItems = items.length > 0 ? items : [""];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {displayItems.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const next = [...displayItems];
              next[index] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              const next = displayItems.filter((_, i) => i !== index);
              onChange(next.length > 0 ? next : [""]);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...displayItems, ""])}
      >
        <Plus className="h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}

export function AboutContentEditor({
  initialContent,
  initialAvatarUrl,
}: {
  initialContent: AboutContent;
  initialAvatarUrl: string;
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState("");

  const updateExperience = (index: number, experience: Experience) => {
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((item, i) =>
        i === index ? experience : item
      ),
    }));
  };

  const updateEducation = (index: number, education: Education) => {
    setContent((current) => ({
      ...current,
      education: current.education.map((item, i) =>
        i === index ? education : item
      ),
    }));
  };

  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Photo upload failed.");
      }

      const nextUrl = data.url
        ? `${data.url}${data.url.includes("?") ? "&" : "?"}v=${Date.now()}`
        : avatarUrl;
      setAvatarUrl(nextUrl);
      showToast("Profile photo updated.");
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Photo upload failed."
      );
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    const payload: AboutContent = {
      ...content,
      techStack: content.techStack.filter(Boolean),
      typingRoles: content.typingRoles.filter(Boolean),
      languages: content.languages.filter(Boolean),
      experiences: content.experiences
        .map((item) => ({
          ...item,
          highlights: item.highlights.filter(Boolean),
        }))
        .filter((item) => item.role || item.company),
      education: content.education.filter((item) => item.degree || item.institution),
      stats: content.stats.filter((item) => item.label),
    };

    try {
      const response = await fetch("/api/admin/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save.");
      }

      showToast("About section saved successfully.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortfolioAdminShell
      title="About"
      viewSiteHref="/#about"
      action={
        <Button onClick={handleSave} disabled={isSaving || isUploadingPhoto}>
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
      <div className="space-y-6">
        <GlassCard className="space-y-4">
          <h2 className="font-semibold">Profile</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={content.name}
                onChange={(e) => setContent({ ...content, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={content.role}
                onChange={(e) => setContent({ ...content, role: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={content.tagline}
              onChange={(e) => setContent({ ...content, tagline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea
              value={content.summary}
              onChange={(e) => setContent({ ...content, summary: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Career objective</Label>
            <Textarea
              value={content.careerObjective}
              onChange={(e) =>
                setContent({ ...content, careerObjective: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="profilePhoto">Profile photo</Label>
              <p className="text-sm text-muted-foreground">
                This is the photo shown in the homepage hero section.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingPhoto}
                asChild
              >
                <label className="cursor-pointer">
                  {isUploadingPhoto ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  Upload photo
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoUpload}
                  />
                </label>
              </Button>
            </div>
            {isRenderableImageUrl(avatarUrl) ? (
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-border">
                <Image
                  src={avatarUrl}
                  alt="Profile photo preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
          <StringListEditor
            label="Tech stack badges"
            items={content.techStack}
            onChange={(techStack) => setContent({ ...content, techStack })}
          />
          <StringListEditor
            label="Typing roles"
            items={content.typingRoles}
            onChange={(typingRoles) => setContent({ ...content, typingRoles })}
          />
          <StringListEditor
            label="Languages"
            items={content.languages}
            onChange={(languages) => setContent({ ...content, languages })}
          />
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Experience</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent({
                  ...content,
                  experiences: [
                    ...content.experiences,
                    {
                      id: `exp-${Date.now()}`,
                      role: "",
                      company: "",
                      period: "",
                      description: "",
                      highlights: [""],
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add experience
            </Button>
          </div>
          {content.experiences.map((experience, index) => (
            <div key={experience.id} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setContent({
                      ...content,
                      experiences: content.experiences.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={experience.role}
                  onChange={(e) =>
                    updateExperience(index, { ...experience, role: e.target.value })
                  }
                  placeholder="Role"
                />
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(index, { ...experience, company: e.target.value })
                  }
                  placeholder="Company"
                />
              </div>
              <Input
                value={experience.period}
                onChange={(e) =>
                  updateExperience(index, { ...experience, period: e.target.value })
                }
                placeholder="May 2025 — Present"
              />
              <Textarea
                value={experience.description}
                onChange={(e) =>
                  updateExperience(index, { ...experience, description: e.target.value })
                }
                rows={2}
                placeholder="Description"
              />
              <StringListEditor
                label="Highlights"
                items={experience.highlights}
                onChange={(highlights) =>
                  updateExperience(index, { ...experience, highlights })
                }
              />
            </div>
          ))}
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Education</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent({
                  ...content,
                  education: [
                    ...content.education,
                    {
                      id: `edu-${Date.now()}`,
                      degree: "",
                      institution: "",
                      period: "",
                      description: "",
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add education
            </Button>
          </div>
          {content.education.map((education, index) => (
            <div key={education.id} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setContent({
                      ...content,
                      education: content.education.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={education.degree}
                onChange={(e) =>
                  updateEducation(index, { ...education, degree: e.target.value })
                }
                placeholder="Degree"
              />
              <Input
                value={education.institution}
                onChange={(e) =>
                  updateEducation(index, { ...education, institution: e.target.value })
                }
                placeholder="Institution"
              />
              <Input
                value={education.period}
                onChange={(e) =>
                  updateEducation(index, { ...education, period: e.target.value })
                }
                placeholder="2020 — 2024"
              />
              <Textarea
                value={education.description}
                onChange={(e) =>
                  updateEducation(index, { ...education, description: e.target.value })
                }
                rows={2}
              />
            </div>
          ))}
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Stats</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent({
                  ...content,
                  stats: [...content.stats, { label: "", value: 0, suffix: "+" }],
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add stat
            </Button>
          </div>
          {content.stats.map((stat, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-4">
              <Input
                value={stat.label}
                onChange={(e) => {
                  const next = [...content.stats];
                  next[index] = { ...stat, label: e.target.value };
                  setContent({ ...content, stats: next });
                }}
                placeholder="Label"
              />
              <Input
                type="number"
                value={stat.value}
                onChange={(e) => {
                  const next = [...content.stats];
                  next[index] = { ...stat, value: Number(e.target.value) || 0 };
                  setContent({ ...content, stats: next });
                }}
                placeholder="Value"
              />
              <Input
                value={stat.suffix}
                onChange={(e) => {
                  const next = [...content.stats];
                  next[index] = { ...stat, suffix: e.target.value };
                  setContent({ ...content, stats: next });
                }}
                placeholder="Suffix"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setContent({
                    ...content,
                    stats: content.stats.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </GlassCard>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </PortfolioAdminShell>
  );
}
