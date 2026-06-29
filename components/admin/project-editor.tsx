"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import {
  slugifyProjectTitle,
  emptyDataCleaningStep,
  emptyPowerBIDashboard,
  emptyPowerBIDashboardStep,
  normalizePowerBIDashboard,
  normalizeProject,
  sanitizePowerBIDashboardForSave,
} from "@/lib/projects/helpers";
import { DATA_CLEANING_TOOLS, POWER_BI_CHART_TYPES } from "@/lib/projects/constants";
import type {
  DataCleaningStep,
  DataCleaningTool,
  PowerBIDashboard,
  PowerBIDashboardStep,
  PowerBIChartType,
  Project,
} from "@/types";
import { cn } from "@/lib/utils";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { DeletePostDialog } from "@/components/admin/delete-post-dialog";
import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";

interface ProjectEditorProps {
  mode: "create" | "edit";
  initialProject?: Project;
}

function StringListField({
  label,
  description,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  description?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const displayItems = items.length > 0 ? items : [""];

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        {displayItems.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => {
                const next = [...displayItems];
                next[index] = event.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                const next = displayItems.filter((_, i) => i !== index);
                onChange(next.length > 0 ? next : [""]);
              }}
              aria-label={`Remove ${label} item`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
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

function prepareProjectForSave(form: Project): Project {
  const powerBI = sanitizePowerBIDashboardForSave(
    normalizePowerBIDashboard(form.powerBIDashboard)
  );

  return {
    ...form,
    tools: form.tools.map((item) => item.trim()).filter(Boolean),
    tags: form.tags.map((item) => item.trim()).filter(Boolean),
    keyInsights: form.keyInsights.map((item) => item.trim()).filter(Boolean),
    dataCleaning: form.dataCleaning
      .map((step) => ({
        description: step.description.trim(),
        tool: step.tool,
        toolDetail: step.toolDetail?.trim() || undefined,
        image: step.image?.trim() || undefined,
      }))
      .filter((step) => step.description),
    pythonAnalysis: form.pythonAnalysis.map((item) => item.trim()).filter(Boolean),
    businessInsights: form.businessInsights.map((item) => item.trim()).filter(Boolean),
    recommendations: form.recommendations.map((item) => item.trim()).filter(Boolean),
    screenshots: form.screenshots.map((item) => item.trim()).filter(Boolean),
    technologies: form.technologies.map((item) => item.trim()).filter(Boolean),
    sqlQueries: form.sqlQueries
      .map((entry) => ({
        title: entry.title.trim(),
        query: entry.query.trim(),
      }))
      .filter((entry) => entry.title && entry.query),
    powerBIDashboard: powerBI,
  };
}

function DataCleaningStepsField({
  steps,
  onChange,
  onUploadImage,
  isUploading,
}: {
  steps: DataCleaningStep[];
  onChange: (steps: DataCleaningStep[]) => void;
  onUploadImage: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  isUploading: boolean;
}) {
  const displaySteps = steps.length > 0 ? steps : [emptyDataCleaningStep()];

  return (
    <div className="space-y-3">
      <div>
        <Label>Data cleaning steps</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Describe each step, pick the tool used, and optionally add a screenshot.
        </p>
      </div>

      <div className="space-y-4">
        {displaySteps.map((step, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                Step {index + 1}
              </p>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const next = displaySteps.filter((_, i) => i !== index);
                  onChange(next.length > 0 ? next : [emptyDataCleaningStep()]);
                }}
                aria-label="Remove data cleaning step"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`data-cleaning-tool-${index}`}>Tool used</Label>
              <select
                id={`data-cleaning-tool-${index}`}
                value={step.tool}
                onChange={(event) => {
                  const next = [...displaySteps];
                  next[index] = {
                    ...step,
                    tool: event.target.value as DataCleaningTool,
                  };
                  onChange(next);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {DATA_CLEANING_TOOLS.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
                  </option>
                ))}
              </select>
            </div>

            {step.tool === "Python" ? (
              <div className="space-y-2">
                <Label htmlFor={`data-cleaning-libraries-${index}`}>
                  Python libraries
                </Label>
                <Input
                  id={`data-cleaning-libraries-${index}`}
                  value={step.toolDetail ?? ""}
                  onChange={(event) => {
                    const next = [...displaySteps];
                    next[index] = { ...step, toolDetail: event.target.value };
                    onChange(next);
                  }}
                  placeholder="pandas, numpy, seaborn"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor={`data-cleaning-description-${index}`}>
                What you cleaned
              </Label>
              <Textarea
                id={`data-cleaning-description-${index}`}
                value={step.description}
                onChange={(event) => {
                  const next = [...displaySteps];
                  next[index] = { ...step, description: event.target.value };
                  onChange(next);
                }}
                placeholder="Standardized product category codes across ERP modules"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor={`data-cleaning-image-${index}`}>Step photo</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id={`data-cleaning-image-${index}`}
                  value={step.image ?? ""}
                  onChange={(event) => {
                    const next = [...displaySteps];
                    next[index] = { ...step, image: event.target.value };
                    onChange(next);
                  }}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  asChild
                >
                  <label className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => onUploadImage(event, index)}
                    />
                  </label>
                </Button>
              </div>
              {step.image ? (
                <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-border">
                  <Image
                    src={step.image}
                    alt={`Data cleaning step ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...displaySteps, emptyDataCleaningStep()])}
      >
        <Plus className="h-4 w-4" />
        Add cleaning step
      </Button>
    </div>
  );
}

function PowerBIDashboardField({
  dashboard,
  onChange,
  onUploadImage,
  isUploading,
}: {
  dashboard: PowerBIDashboard;
  onChange: (dashboard: PowerBIDashboard) => void;
  onUploadImage: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  isUploading: boolean;
}) {
  const safeDashboard = normalizePowerBIDashboard(dashboard);
  const displaySteps =
    safeDashboard.steps.length > 0
      ? safeDashboard.steps
      : [emptyPowerBIDashboardStep()];

  const updateDashboard = (patch: Partial<PowerBIDashboard>) => {
    onChange({
      ...safeDashboard,
      ...patch,
      charts: patch.charts ?? safeDashboard.charts,
      steps: patch.steps ?? safeDashboard.steps,
    });
  };

  const toggleChart = (chart: PowerBIChartType) => {
    const isSelected = safeDashboard.charts.includes(chart);
    updateDashboard({
      charts: isSelected
        ? safeDashboard.charts.filter((item) => item !== chart)
        : [...safeDashboard.charts, chart],
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <Label>Power BI dashboard</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Add a summary, select chart types used, and document each build step with photos.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="power-bi-summary">Dashboard summary</Label>
        <Textarea
          id="power-bi-summary"
          value={safeDashboard.summary ?? ""}
          onChange={(event) =>
            updateDashboard({ summary: event.target.value })
          }
          placeholder="Interactive dashboards with drill-down by plant, team, and product category..."
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Label>Charts used</Label>
        <div className="flex flex-wrap gap-2">
          {POWER_BI_CHART_TYPES.map((chart) => {
            const isSelected = safeDashboard.charts.includes(chart);
            return (
              <button
                key={chart}
                type="button"
                onClick={() => toggleChart(chart)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {chart}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Dashboard build steps</Label>
        {displaySteps.map((step, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                Step {index + 1}
              </p>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const next = displaySteps.filter((_, i) => i !== index);
                  updateDashboard({
                    steps: next.length > 0 ? next : [emptyPowerBIDashboardStep()],
                  });
                }}
                aria-label="Remove dashboard step"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`power-bi-step-title-${index}`}>Step title</Label>
              <Input
                id={`power-bi-step-title-${index}`}
                value={step.title}
                onChange={(event) => {
                  const next = [...displaySteps];
                  next[index] = { ...step, title: event.target.value };
                  updateDashboard({ steps: next });
                }}
                placeholder="Create KPI cards and drill-down pages"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`power-bi-step-description-${index}`}>
                What you built
              </Label>
              <Textarea
                id={`power-bi-step-description-${index}`}
                value={step.description}
                onChange={(event) => {
                  const next = [...displaySteps];
                  next[index] = { ...step, description: event.target.value };
                  updateDashboard({ steps: next });
                }}
                placeholder="Added executive KPI cards with plant and team slicers..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor={`power-bi-step-image-${index}`}>Step image</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id={`power-bi-step-image-${index}`}
                  value={step.image ?? ""}
                  onChange={(event) => {
                    const next = [...displaySteps];
                    next[index] = { ...step, image: event.target.value };
                    updateDashboard({ steps: next });
                  }}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  asChild
                >
                  <label className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => onUploadImage(event, index)}
                    />
                  </label>
                </Button>
              </div>
              {step.image ? (
                <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-border">
                  <Image
                    src={step.image}
                    alt={step.title || `Dashboard step ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            updateDashboard({
              steps: [...displaySteps, emptyPowerBIDashboardStep()],
            })
          }
        >
          <Plus className="h-4 w-4" />
          Add dashboard step
        </Button>
      </div>
    </div>
  );
}

function emptyProject(): Omit<Project, "slug"> & { slug: string } {
  return {
    slug: "",
    title: "",
    description: "",
    image: "",
    businessProblem: "",
    dataset: "",
    tools: [],
    keyInsights: [],
    tags: [],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    overview: "",
    problemStatement: "",
    dataCleaning: [],
    sqlQueries: [],
    pythonAnalysis: [],
    powerBIDashboard: emptyPowerBIDashboard(),
    businessInsights: [],
    recommendations: [],
    screenshots: [],
    technologies: [],
  };
}

export function ProjectEditor({ mode, initialProject }: ProjectEditorProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [form, setForm] = useState<Project>(() =>
    initialProject
      ? normalizeProject(initialProject)
      : normalizeProject(emptyProject() as Project)
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!slugTouched && mode === "create") {
      setForm((current) => ({ ...current, slug: slugifyProjectTitle(current.title) }));
    }
  }, [form.title, slugTouched, mode]);

  const updateField = <K extends keyof Project>(key: K, value: Project[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const sqlQueries =
    form.sqlQueries.length > 0
      ? form.sqlQueries
      : [{ title: "", query: "" }];

  const screenshots =
    form.screenshots.length > 0 ? form.screenshots : [""];

  const updateSqlQueries = (
    next: { title: string; query: string }[]
  ) => {
    updateField("sqlQueries", next);
  };

  const updateScreenshots = (next: string[]) => {
    updateField("screenshots", next);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "image" | "screenshots" | "data-cleaning" | "power-bi-step",
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/projects/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      const url = data.url ?? "";
      if (target === "image") {
        updateField("image", url);
      } else if (target === "data-cleaning" && typeof index === "number") {
        const currentSteps =
          form.dataCleaning.length > 0
            ? form.dataCleaning
            : [emptyDataCleaningStep()];
        const next = [...currentSteps];
        next[index] = { ...next[index], image: url };
        updateField("dataCleaning", next);
      } else if (target === "power-bi-step" && typeof index === "number") {
        const powerBI = normalizePowerBIDashboard(form.powerBIDashboard);
        const currentSteps =
          powerBI.steps.length > 0 ? powerBI.steps : [emptyPowerBIDashboardStep()];
        const next = [...currentSteps];
        next[index] = { ...next[index], image: url };
        updateField("powerBIDashboard", { ...powerBI, steps: next });
      } else if (target === "screenshots" && typeof index === "number") {
        const currentScreenshots =
          form.screenshots.length > 0 ? form.screenshots : [""];
        const next = [...currentScreenshots];
        next[index] = url;
        updateField("screenshots", next);
      } else {
        updateField("screenshots", [...form.screenshots, url]);
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initialProject?.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prepareProjectForSave(form)),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save project.");
      }

      router.push(
        mode === "create"
          ? "/admin/projects?toast=published"
          : "/admin/projects?toast=updated"
      );
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save project."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit" || !initialProject) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/projects/${initialProject.slug}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete project.");
      }

      router.push("/admin/projects?toast=deleted");
      router.refresh();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete project.";
      setError(message);
      showToast(message, "error");
      throw deleteError;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminShell
      studio="projects"
      title={mode === "create" ? "Add Project" : "Edit Project"}
      breadcrumb={
        <AdminBreadcrumb
          items={[
            { label: "Projects Studio", href: "/admin/projects" },
            { label: "All Projects", href: "/admin/projects" },
            {
              label:
                mode === "create"
                  ? "New Project"
                  : initialProject?.title || "Edit Project",
            },
          ]}
        />
      }
      action={
        <Button
          type="submit"
          form="project-editor-form"
          disabled={isSaving || isUploading}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Project"
          )}
        </Button>
      }
    >
      <form id="project-editor-form" onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basics">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="case-study">Case Study</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="links">Links & Media</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-4 space-y-6">
            <GlassCard className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Project title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Enterprise ERP Analytics Dashboard"
                  className="text-lg"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateField("slug", event.target.value);
                    }}
                    placeholder="enterprise-erp-analytics-dashboard"
                    required
                  />
                </div>

                <div className="flex items-end gap-3 pb-1">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateField("featured", event.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor="featured">Featured project</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="One-liner shown on project cards."
                  rows={3}
                  required
                />
              </div>

              <StringListField
                label="Tags"
                description="Shown as badges on project cards."
                items={form.tags}
                onChange={(tags) => updateField("tags", tags)}
                placeholder="Power BI"
              />

              <div className="space-y-3">
                <Label htmlFor="image">Cover image</Label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="image"
                    value={form.image}
                    onChange={(event) => updateField("image", event.target.value)}
                    placeholder="https://..."
                    required
                  />
                  <Button type="button" variant="outline" disabled={isUploading} asChild>
                    <label className="cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImageUpload(event, "image")}
                      />
                    </label>
                  </Button>
                </div>
                {form.image ? (
                  <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-border">
                    <Image
                      src={form.image}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="case-study" className="mt-4 space-y-6">
            <GlassCard className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={form.overview}
                  onChange={(event) => updateField("overview", event.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemStatement">Problem statement</Label>
                <Textarea
                  id="problemStatement"
                  value={form.problemStatement}
                  onChange={(event) =>
                    updateField("problemStatement", event.target.value)
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessProblem">Business problem</Label>
                <Textarea
                  id="businessProblem"
                  value={form.businessProblem}
                  onChange={(event) =>
                    updateField("businessProblem", event.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset">Dataset</Label>
                <Input
                  id="dataset"
                  value={form.dataset}
                  onChange={(event) => updateField("dataset", event.target.value)}
                  placeholder="ERP transactional data across modules"
                />
              </div>

              <StringListField
                label="Tools used"
                items={form.tools}
                onChange={(tools) => updateField("tools", tools)}
                placeholder="SQL Server"
              />
            </GlassCard>
          </TabsContent>

          <TabsContent value="technical" className="mt-4 space-y-6">
            <GlassCard className="space-y-5">
              <DataCleaningStepsField
                steps={form.dataCleaning}
                onChange={(steps) => updateField("dataCleaning", steps)}
                onUploadImage={(event, index) =>
                  handleImageUpload(event, "data-cleaning", index)
                }
                isUploading={isUploading}
              />

              <div className="space-y-3">
                <Label>SQL queries</Label>
                {sqlQueries.map((entry, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-xl border border-border p-4"
                    >
                      <div className="flex gap-2">
                        <Input
                          value={entry.title}
                          onChange={(event) => {
                            const next = [...sqlQueries];
                            next[index] = { ...entry, title: event.target.value };
                            updateSqlQueries(next);
                          }}
                          placeholder="Query title"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const next = sqlQueries.filter((_, i) => i !== index);
                            updateSqlQueries(
                              next.length > 0 ? next : [{ title: "", query: "" }]
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={entry.query}
                        onChange={(event) => {
                          const next = [...sqlQueries];
                          next[index] = { ...entry, query: event.target.value };
                          updateSqlQueries(next);
                        }}
                        placeholder="SELECT ..."
                        rows={5}
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateSqlQueries([
                      ...sqlQueries,
                      { title: "", query: "" },
                    ])
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add SQL query
                </Button>
              </div>

              <StringListField
                label="Python analysis"
                items={form.pythonAnalysis}
                onChange={(items) => updateField("pythonAnalysis", items)}
              />

              <PowerBIDashboardField
                dashboard={normalizePowerBIDashboard(form.powerBIDashboard)}
                onChange={(dashboard) => updateField("powerBIDashboard", dashboard)}
                onUploadImage={(event, index) =>
                  handleImageUpload(event, "power-bi-step", index)
                }
                isUploading={isUploading}
              />

              <StringListField
                label="Technologies"
                items={form.technologies}
                onChange={(items) => updateField("technologies", items)}
                placeholder="Power BI"
              />
            </GlassCard>
          </TabsContent>

          <TabsContent value="insights" className="mt-4 space-y-6">
            <GlassCard className="space-y-5">
              <StringListField
                label="Key insights"
                description="Shown on the home page project cards."
                items={form.keyInsights}
                onChange={(items) => updateField("keyInsights", items)}
              />

              <StringListField
                label="Business insights"
                items={form.businessInsights}
                onChange={(items) => updateField("businessInsights", items)}
              />

              <StringListField
                label="Recommendations"
                items={form.recommendations}
                onChange={(items) => updateField("recommendations", items)}
              />
            </GlassCard>
          </TabsContent>

          <TabsContent value="links" className="mt-4 space-y-6">
            <GlassCard className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={form.githubUrl}
                    onChange={(event) => updateField("githubUrl", event.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live demo URL</Label>
                  <Input
                    id="liveUrl"
                    value={form.liveUrl}
                    onChange={(event) => updateField("liveUrl", event.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Screenshots</Label>
                {screenshots.map((screenshot, index) => (
                    <div key={index} className="space-y-2 rounded-xl border border-border p-4">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          value={screenshot}
                          onChange={(event) => {
                            const next = [...screenshots];
                            next[index] = event.target.value;
                            updateScreenshots(next);
                          }}
                          placeholder="https://..."
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUploading}
                          asChild
                        >
                          <label className="cursor-pointer">
                            <ImagePlus className="h-4 w-4" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) =>
                                handleImageUpload(event, "screenshots", index)
                              }
                            />
                          </label>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const next = screenshots.filter((_, i) => i !== index);
                            updateScreenshots(next.length > 0 ? next : [""]);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {screenshot ? (
                        <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                          <Image
                            src={screenshot}
                            alt={`Screenshot ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateScreenshots([...screenshots, ""])}
                >
                  <Plus className="h-4 w-4" />
                  Add screenshot
                </Button>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {mode === "edit" ? (
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-400/40 text-red-400 hover:bg-red-400/10 sm:w-auto"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete project
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            className="w-full sm:ml-auto sm:w-auto"
            disabled={isSaving || isUploading}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Project"
            )}
          </Button>
        </div>
      </form>

      {mode === "edit" && initialProject ? (
        <DeletePostDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={initialProject.title}
          entityLabel="project"
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      ) : null}
    </AdminShell>
  );
}
