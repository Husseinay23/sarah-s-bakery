"use client";

import { useSiteSettings } from "@/lib/useSiteData";

export function AnnouncementsBar() {
  const { settings } = useSiteSettings();

  if (!settings.announcementActive || !settings.announcementText.trim()) {
    return null;
  }

  return (
    <div className="border-b border-cinnamon/15 bg-blush/50 px-4 py-2.5 text-center sm:px-6">
      <p className="text-xs font-medium text-espresso sm:text-sm">
        <span className="mr-2 text-cinnamon">✦</span>
        {settings.announcementText}
      </p>
    </div>
  );
}
