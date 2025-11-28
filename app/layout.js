export const metadata = {
  title: "Hanu Daw?",
  description: "Taglish couple mashup generator"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
