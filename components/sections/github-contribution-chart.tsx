"use client";

import Image from "next/image";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@wrksz/themes/client";
import {
  GITHUB_CONTRIBUTION_COLORS,
  getGitHubContributionColor,
  type GitHubThemeMode,
} from "@/lib/github/contribution-colors";
import type { GitHubContributionCalendar } from "@/lib/github/stats";
import { cn } from "@/lib/utils";

type GitHubContributionChartProps = {
  calendar: GitHubContributionCalendar | null;
  fallbackChartUrl: string;
};

type TooltipState = {
  label: string;
  x: number;
  y: number;
};

type MonthMarker = {
  month: string;
  weekIndex: number;
};

type ChartLayout = {
  cellSize: number;
  gap: number;
  labelCol: number;
  contentWidth: number;
  scrollable: boolean;
};

const GAP = 3;
const LABEL_COL = 28;
const MIN_CELL = 9;
const MAX_CELL = 14;
const MONTH_ROW = 18;

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function formatContributionLabel(count: number, date: string): string {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));

  if (count === 0) {
    return `No contributions on ${formattedDate}.`;
  }

  if (count === 1) {
    return `1 contribution on ${formattedDate}.`;
  }

  return `${count} contributions on ${formattedDate}.`;
}

function getMonthMarkers(calendar: GitHubContributionCalendar): MonthMarker[] {
  const markers: MonthMarker[] = [];
  let lastMonth = -1;

  calendar.weeks.forEach((week, weekIndex) => {
    for (const day of week.days) {
      if (!day.date) continue;

      const date = new Date(`${day.date}T12:00:00Z`);
      const month = date.getUTCMonth();

      if (month !== lastMonth && date.getUTCDate() <= 7) {
        markers.push({
          month: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
          weekIndex,
        });
        lastMonth = month;
        break;
      }
    }
  });

  return markers;
}

function getContentWidth(weekCount: number, cellSize: number): number {
  const gridWidth = weekCount * cellSize + (weekCount - 1) * GAP;
  return LABEL_COL + GAP + gridWidth;
}

function computeChartLayout(availableWidth: number, weekCount: number): ChartLayout {
  const usableWidth = Math.max(availableWidth, MIN_CELL * 4);
  const rawCellSize = Math.floor(
    (usableWidth - LABEL_COL - GAP - GAP * (weekCount - 1)) / weekCount
  );

  if (rawCellSize >= MIN_CELL) {
    const cellSize = Math.min(MAX_CELL, rawCellSize);
    return {
      cellSize,
      gap: GAP,
      labelCol: LABEL_COL,
      contentWidth: getContentWidth(weekCount, cellSize),
      scrollable: false,
    };
  }

  const cellSize = MIN_CELL;
  return {
    cellSize,
    gap: GAP,
    labelCol: LABEL_COL,
    contentWidth: getContentWidth(weekCount, cellSize),
    scrollable: true,
  };
}

function getDayForWeekday(
  week: GitHubContributionCalendar["weeks"][number],
  weekday: number
) {
  return week.days[weekday] ?? week.days.find((entry) => entry.weekday === weekday);
}

export function GitHubContributionChart({
  calendar,
  fallbackChartUrl,
}: GitHubContributionChartProps) {
  const { resolvedTheme } = useTheme();
  const githubTheme: GitHubThemeMode =
    resolvedTheme === "light" ? "light" : "dark";
  const legendColors = GITHUB_CONTRIBUTION_COLORS[githubTheme];

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [layout, setLayout] = useState<ChartLayout | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const monthMarkers = useMemo(
    () => (calendar ? getMonthMarkers(calendar) : []),
    [calendar]
  );

  const weekCount = calendar?.weeks.length ?? 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !calendar || weekCount === 0) return;

    const updateLayout = () => {
      setLayout(computeChartLayout(container.clientWidth, weekCount));
    };

    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    observer.observe(container);

    return () => observer.disconnect();
  }, [calendar, weekCount]);

  if (!calendar) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/10 p-2">
        <Image
          src={fallbackChartUrl}
          alt="GitHub contribution chart"
          width={600}
          height={120}
          unoptimized
          className="h-auto w-full"
        />
      </div>
    );
  }

  const showTooltip = (element: HTMLElement, label: string) => {
    const rect = element.getBoundingClientRect();
    setTooltip({
      label,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const weekStride = layout ? layout.cellSize + layout.gap : 0;
  const gridWidth = layout
    ? weekCount * layout.cellSize + (weekCount - 1) * layout.gap
    : 0;

  return (
    <div className="relative w-full min-w-0 rounded-xl border border-border/70 bg-muted/10 p-3 sm:p-4">
      <div
        ref={containerRef}
        className={cn(
          "w-full min-w-0",
          layout?.scrollable &&
            "touch-pan-x overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin]"
        )}
      >
        {!layout ? (
          <div className="min-h-[120px]" aria-hidden />
        ) : (
          <div
            className={cn(!layout.scrollable && "mx-auto w-full max-w-full")}
            style={{ width: layout.scrollable ? layout.contentWidth : "100%" }}
          >
            <div
              className="relative"
              style={{
                marginLeft: layout.labelCol + layout.gap,
                width: gridWidth,
                height: MONTH_ROW,
              }}
            >
              {monthMarkers.map(({ month, weekIndex }) => (
                <span
                  key={`${month}-${weekIndex}`}
                  className="absolute bottom-0 whitespace-nowrap text-[11px] leading-none text-muted-foreground"
                  style={{ left: weekIndex * weekStride }}
                >
                  {month}
                </span>
              ))}
            </div>

            <div
              className="grid"
              style={{
                width: layout.contentWidth,
                gridTemplateColumns: `${layout.labelCol}px repeat(${weekCount}, ${layout.cellSize}px)`,
                columnGap: layout.gap,
                rowGap: layout.gap,
                marginTop: layout.gap,
              }}
            >
              {Array.from({ length: 7 }, (_, weekday) => (
                <Fragment key={weekday}>
                  <div
                    className="flex items-center justify-end pr-1 text-[10px] leading-none text-muted-foreground"
                    style={{ height: layout.cellSize }}
                  >
                    {DAY_LABELS[weekday]}
                  </div>

                  {calendar.weeks.map((week, weekIndex) => {
                    const day = getDayForWeekday(week, weekday);

                    if (!day?.date) {
                      return (
                        <span
                          key={`${weekIndex}-${weekday}`}
                          aria-hidden
                          style={{
                            width: layout.cellSize,
                            height: layout.cellSize,
                          }}
                        />
                      );
                    }

                    const label = formatContributionLabel(day.count, day.date);
                    const cellColor = getGitHubContributionColor(day.color, day.count, githubTheme);

                    return (
                      <button
                        key={day.date}
                        type="button"
                        aria-label={label}
                        className={cn(
                          "shrink-0 rounded-[2px] border border-transparent p-0 transition-[box-shadow,transform]",
                          "hover:ring-2 hover:ring-foreground/20",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30",
                          "active:ring-2 active:ring-foreground/25"
                        )}
                        style={{
                          width: layout.cellSize,
                          height: layout.cellSize,
                          minWidth: layout.cellSize,
                          minHeight: layout.cellSize,
                          backgroundColor: cellColor,
                        }}
                        onMouseEnter={(event) => showTooltip(event.currentTarget, label)}
                        onMouseMove={(event) => showTooltip(event.currentTarget, label)}
                        onMouseLeave={() => setTooltip(null)}
                        onFocus={(event) => showTooltip(event.currentTarget, label)}
                        onBlur={() => setTooltip(null)}
                      />
                    );
                  })}
                </Fragment>
              ))}
            </div>

            <div
              className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground"
              style={{
                width: layout.contentWidth,
                marginTop: layout.gap,
              }}
            >
              <span>Less</span>
              <div className="flex" style={{ gap: layout.gap }}>
                {legendColors.map((color) => (
                  <span
                    key={color}
                    className="rounded-[2px]"
                    style={{
                      width: layout.cellSize,
                      height: layout.cellSize,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </div>

      {layout?.scrollable && (
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Scroll to see the full year
        </p>
      )}

      {mounted &&
        tooltip &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[9999] max-w-[min(90vw,280px)] -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-border/80 bg-popover px-2.5 py-1.5 text-center text-xs font-medium text-popover-foreground shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.label}
          </div>,
          document.body
        )}
    </div>
  );
}
