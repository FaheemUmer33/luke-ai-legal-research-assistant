"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="glass max-w-lg rounded-lg p-6">
        <h1 className="text-xl font-semibold text-white">Law AI Solutions interface error</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{error.message}</p>
      </div>
    </main>
  );
}
