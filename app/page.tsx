export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">
        {process.env.NEXT_PUBLIC_APP_NAME} 🚀
      </h1>
      <p className="mt-2 text-gray-500">
        Environment: {process.env.NEXT_PUBLIC_ENV}
      </p>
    </main>
  );
}