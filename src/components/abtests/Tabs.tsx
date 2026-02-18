import type { ComponentProps } from 'react';
import { Tabs as UITabs, TabsContent as UITabsContent, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const Tabs = UITabs;

export function TabsList({ className, ...props }: ComponentProps<typeof UITabsList>) {
  return <UITabsList className={cn('h-11 bg-secondary/80', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof UITabsTrigger>) {
  return (
    <UITabsTrigger
      className={cn('text-xs data-[state=active]:text-card-foreground data-[state=active]:shadow-none', className)}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof UITabsContent>) {
  return <UITabsContent className={cn('mt-4', className)} {...props} />;
}
