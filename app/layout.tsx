import "./globals.css";

export const metadata = {
  title: "GUARDIAN WORK V5 - ENGINE ONLINE",
  description: "People → Capability → Work Identity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{ margin: 0 }} className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
