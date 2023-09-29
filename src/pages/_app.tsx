import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/theme-provider";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toaster";
import { ModeToggle } from "~/components/ui/theme-picker";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="absolute right-0 top-0 p-4">
        <ModeToggle />
      </div>
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
