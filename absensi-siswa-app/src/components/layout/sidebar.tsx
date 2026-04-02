"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  Settings2,
  Calendar,
  Trophy,
  UserCog,
  ClipboardCheck,
  PenLine,
  BarChart3,
  CalendarCheck,
  LogOut,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserRole } from "@/lib/mock-data";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Data Siswa", href: "/admin/siswa", icon: Users },
  { label: "Data Guru", href: "/admin/guru", icon: GraduationCap },
  { label: "Data Kelas", href: "/admin/kelas", icon: School },
  { label: "Mata Pelajaran", href: "/admin/mapel", icon: BookOpen },
  { label: "Konfigurasi SPK", href: "/admin/spk", icon: Settings2 },
  { label: "Tahun Ajaran", href: "/admin/tahun-ajaran", icon: Calendar },
  { label: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { label: "Manajemen Akun", href: "/admin/akun", icon: UserCog },
];

const guruNav: NavItem[] = [
  { label: "Dashboard", href: "/guru", icon: LayoutDashboard },
  { label: "Absensi", href: "/guru/absensi", icon: ClipboardCheck },
  { label: "Input Nilai", href: "/guru/nilai", icon: PenLine },
  { label: "Rekap Kelas", href: "/guru/rekap", icon: BarChart3 },
];

const siswaNav: NavItem[] = [
  { label: "Dashboard", href: "/siswa", icon: LayoutDashboard },
  { label: "Riwayat Absensi", href: "/siswa/absensi", icon: CalendarCheck },
  { label: "Leaderboard", href: "/siswa/leaderboard", icon: Trophy },
];

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "ADMIN":
      return adminNav;
    case "GURU":
      return guruNav;
    case "SISWA":
      return siswaNav;
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "GURU":
      return "Guru";
    case "SISWA":
      return "Siswa";
  }
}

interface SidebarProps {
  role: UserRole;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(role);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[264px]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-sidebar-border px-4 h-16",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 p-1">
          <Image
            src="/logo.png"
            alt="Logo Sekolah"
            fill
            className="object-contain"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <h1 className="truncate text-sm font-bold text-white">
              SistemKu
            </h1>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              {getRoleLabel(role)}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${role.toLowerCase()}` &&
                pathname.startsWith(item.href));

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-amber-500/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger render={linkContent} />
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Tooltip>
          <TooltipTrigger render={<Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-red-400",
                collapsed && "justify-center px-2"
              )}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                router.push('/login');
              }}
            />}>
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Keluar</span>}
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">Keluar</TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-colors hover:bg-sidebar-accent"
        aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
      >
        <ChevronLeft
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            collapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
}
