import { ProfileGenerator } from '@/components/profile-generator';

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-6 flex flex-col justify-center">
      <main className="w-full max-w-[420px] mx-auto">
        <ProfileGenerator />
      </main>
    </div>
  );
}
