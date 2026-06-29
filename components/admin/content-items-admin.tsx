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
import {
  CERTIFICATION_PLATFORMS,
  SKILL_ICONS,
} from "@/lib/content/constants";
import type { Certification, FAQ, Skill, Testimonial } from "@/types";

type CollectionSection = "skills" | "certifications" | "testimonials" | "faqs";

type CollectionItem = Skill | Certification | Testimonial | FAQ;

const sectionMeta: Record<
  CollectionSection,
  { title: string; viewSiteHref: string; itemLabel: string }
> = {
  skills: { title: "Skills", viewSiteHref: "/#skills", itemLabel: "Skill" },
  certifications: {
    title: "Certifications",
    viewSiteHref: "/#certifications",
    itemLabel: "Certification",
  },
  testimonials: {
    title: "Testimonials",
    viewSiteHref: "/#testimonials",
    itemLabel: "Testimonial",
  },
  faqs: { title: "FAQ", viewSiteHref: "/#faq", itemLabel: "FAQ" },
};

function createEmptyItem(section: CollectionSection): CollectionItem {
  const id = `${section}-${Date.now()}`;
  switch (section) {
    case "skills":
      return {
        id,
        name: "",
        category: "Analytics",
        level: 80,
        icon: "bar-chart-3",
        description: "",
      };
    case "certifications":
      return {
        id,
        title: "",
        issuer: "",
        platform: "Coursera",
        date: "",
        credentialId: "",
        url: "",
      };
    case "testimonials":
      return { id, name: "", role: "", company: "", content: "" };
    case "faqs":
      return { id, question: "", answer: "" };
  }
}

function ItemFields({
  section,
  item,
  onChange,
}: {
  section: CollectionSection;
  item: CollectionItem;
  onChange: (item: CollectionItem) => void;
}) {
  if (section === "skills") {
    const skill = item as Skill;
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={skill.name}
            onChange={(e) => onChange({ ...skill, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input
            value={skill.category}
            onChange={(e) => onChange({ ...skill, category: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Level (0-100)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={skill.level}
            onChange={(e) =>
              onChange({ ...skill, level: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Icon</Label>
          <select
            value={skill.icon}
            onChange={(e) => onChange({ ...skill, icon: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {SKILL_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={skill.description}
            onChange={(e) => onChange({ ...skill, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    );
  }

  if (section === "certifications") {
    const cert = item as Certification;
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input
            value={cert.title}
            onChange={(e) => onChange({ ...cert, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Issuer</Label>
          <Input
            value={cert.issuer}
            onChange={(e) => onChange({ ...cert, issuer: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Platform</Label>
          <select
            value={cert.platform}
            onChange={(e) =>
              onChange({
                ...cert,
                platform: e.target.value as Certification["platform"],
              })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {CERTIFICATION_PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            value={cert.date}
            onChange={(e) => onChange({ ...cert, date: e.target.value })}
            placeholder="2024-06"
          />
        </div>
        <div className="space-y-2">
          <Label>Credential ID</Label>
          <Input
            value={cert.credentialId}
            onChange={(e) => onChange({ ...cert, credentialId: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>URL</Label>
          <Input
            value={cert.url}
            onChange={(e) => onChange({ ...cert, url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  if (section === "testimonials") {
    const testimonial = item as Testimonial;
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={testimonial.name}
              onChange={(e) => onChange({ ...testimonial, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={testimonial.role}
              onChange={(e) => onChange({ ...testimonial, role: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input
            value={testimonial.company}
            onChange={(e) => onChange({ ...testimonial, company: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Quote</Label>
          <Textarea
            value={testimonial.content}
            onChange={(e) => onChange({ ...testimonial, content: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    );
  }

  const faq = item as FAQ;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question</Label>
        <Input
          value={faq.question}
          onChange={(e) => onChange({ ...faq, question: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Answer</Label>
        <Textarea
          value={faq.answer}
          onChange={(e) => onChange({ ...faq, answer: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
}

export function ContentItemsAdmin({
  section,
  initialItems,
}: {
  section: CollectionSection;
  initialItems: CollectionItem[];
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [items, setItems] = useState<CollectionItem[]>(initialItems);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const meta = sectionMeta[section];

  const updateItem = (index: number, item: CollectionItem) => {
    setItems((current) => current.map((entry, i) => (i === index ? item : entry)));
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save.");
      }

      showToast(`${meta.title} saved successfully.`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortfolioAdminShell
      title={meta.title}
      viewSiteHref={meta.viewSiteHref}
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
      <div className="space-y-4">
        {items.map((item, index) => (
          <GlassCard key={item.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">
                {meta.itemLabel} {index + 1}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
                aria-label={`Delete ${meta.itemLabel}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <ItemFields
              section={section}
              item={item}
              onChange={(next) => updateItem(index, next)}
            />
          </GlassCard>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => setItems((current) => [...current, createEmptyItem(section)])}
        >
          <Plus className="h-4 w-4" />
          Add {meta.itemLabel}
        </Button>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </PortfolioAdminShell>
  );
}
