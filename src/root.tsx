import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Rette den Sonnenhof</title>
        <meta name="description" content="Hilf uns die Tiere auf dem Sonnenhof einzufangen!" />
        <meta name="author" content="Johanna und Felix" />
        <meta property="og:image" content="/og-image.webp" />
        <script defer data-domain="spiel.sonnenhof-zieger.de" src="https://plausible.sonnenhof-zieger.de/js/script.js"></script>
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
            <ScrollRestoration />
            <Scripts />
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}