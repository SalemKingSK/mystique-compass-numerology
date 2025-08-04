import { ProfileGenerator } from '@/components/profile-generator';

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col justify-center">
      <header className="text-center py-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400">
          Mystique Compass
        </h1>
        <p className="text-white/80 mt-2">Giving your life a meaning.</p>
      </header>
      <main className="w-full max-w-md mx-auto">
        <ProfileGenerator />
      </main>
    </div>
  );
}
