import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-6 w-6 text-mpesa" />}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
