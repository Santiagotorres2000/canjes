
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  action, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("pb-5 border-b mb-8", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} className="flex items-center gap-2">
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
