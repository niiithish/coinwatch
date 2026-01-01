"use client";

import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export const ThemeSwitch = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon
        className="text-muted-foreground"
        icon={Sun01Icon}
        size={16}
      />
      <Switch
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <HugeiconsIcon
        className="text-muted-foreground"
        icon={Moon02Icon}
        size={16}
      />
    </div>
  );
};
