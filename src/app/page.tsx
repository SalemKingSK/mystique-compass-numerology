import { ProfileGenerator } from '@/components/profile-generator';

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <main className="w-full max-w-md mx-auto">
        <ProfileGenerator />
      </main>
    </div>
  );
}
