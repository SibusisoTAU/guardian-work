import "./globals.css";

export const metadata = {
  title: "GUARDIAN WORK V5 - ENGINE ONLINE",
  description: "People → Capability → Work Identity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f4f1ed] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
