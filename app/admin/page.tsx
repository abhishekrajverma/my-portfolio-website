import Link from "next/link";
import {
  Award,
  BookOpen,
  FileText,
  FolderKanban,
  HelpCircle,
  Mail,
  MessageSquareQuote,
  Sparkles,
  User,
} from "lucide-react";
import { PortfolioAdminShell } from "@/components/admin/portfolio-admin-shell";
import { GlassCard } from "@/components/ui/glass-card";

const adminSections = [
  {
    title: "About",
    description: "Profile, experience, education, and stats",
    href: "/admin/about",
    icon: User,
    anchor: "/#about",
  },
  {
    title: "Skills",
    description: "Skill cards, levels, and categories",
    href: "/admin/skills",
    icon: Sparkles,
    anchor: "/#skills",
  },
  {
    title: "Projects",
    description: "Portfolio case studies",
    href: "/admin/projects",
    icon: FolderKanban,
    anchor: "/#projects",
  },
  {
    title: "Certifications",
    description: "Credentials and certificates",
    href: "/admin/certifications",
    icon: Award,
    anchor: "/#certifications",
  },
  {
    title: "Blog",
    description: "Articles and tutorials",
    href: "/admin/blog",
    icon: BookOpen,
    anchor: "/#blog",
  },
  {
    title: "Testimonials",
    description: "Recommendations and quotes",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    anchor: "/#testimonials",
  },
  {
    title: "FAQ",
    description: "Common questions and answers",
    href: "/admin/faqs",
    icon: HelpCircle,
    anchor: "/#faq",
  },
  {
    title: "Contact",
    description: "Email, phone, location, and availability",
    href: "/admin/contact",
    icon: Mail,
    anchor: "/#contact",
  },
  {
    title: "Resume",
    description: "Upload and manage your PDF resume",
    href: "/admin/resume",
    icon: FileText,
    anchor: "/resume",
  },
];

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <PortfolioAdminShell title="Manage Portfolio">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <GlassCard className="group h-full transition-colors hover:border-primary/30">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold group-hover:text-primary">
                    {section.title}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </GlassCard>
            </Link>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        GitHub stats stay automatic and are not editable here.
      </p>
    </PortfolioAdminShell>
  );
}
