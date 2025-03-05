import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata ={
  title:"AIForge",
  description:"Generate Code using AI"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
      <ConvexClientProvider>
      <Provider>
        {children}
        <Toaster/>
      </Provider>
      </ConvexClientProvider>
      </body>
    </html>
  );
}
