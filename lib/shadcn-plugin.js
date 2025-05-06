// Este arquivo contém o plugin personalizado do shadcn/ui para o Tailwind CSS

import plugin from "tailwindcss/plugin";

// Plugin que adiciona as variáveis e configurações necessárias para o shadcn/ui
export const shadcnPlugin = plugin(
  // Configuração do plugin
  ({ addBase }) => {
    addBase({
      ":root": {
        "--background": "0 0% 100%",
        "--foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "343 29% 38%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "357 32% 47%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "9 72% 61%",
        "--accent-foreground": "210 40% 98%",
        "--highlight": "28 87% 66%",
        "--highlight-foreground": "210 40% 98%",
        "--muted": "210 40% 96.1%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "214.3 31.8% 91.4%",
        "--input": "214.3 31.8% 91.4%",
        "--ring": "222.2 84% 4.9%",
        "--radius": "0.5rem",
      },
      ".dark": {
        "--background": "222.2 84% 4.9%",
        "--foreground": "210 40% 98%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "210 40% 98%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "210 40% 98%",
        "--primary": "343 29% 38%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "357 32% 47%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "9 72% 61%",
        "--accent-foreground": "210 40% 98%",
        "--highlight": "28 87% 66%",
        "--highlight-foreground": "210 40% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--destructive": "0 62.8% 30.6%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "212.7 26.8% 83.9%",
      },
    });

    addBase({
      "*": {
        "@apply border-border": {},
      },
      body: {
        "@apply bg-background text-foreground": {},
      },
    });
  }
);
