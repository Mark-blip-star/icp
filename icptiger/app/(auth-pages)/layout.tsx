export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex justify-center items-center w-full h-screen overflow-hidden">
      {children}
    </main>
  );
}
