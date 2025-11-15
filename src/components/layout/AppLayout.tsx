import React from "react";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      {children}
    </main>
  );
}