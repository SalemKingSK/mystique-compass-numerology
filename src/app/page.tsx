import { ProfileGenerator } from '@/components/profile-generator';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <main className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
              Mystique Compass
            </h1>
             <p className="text-lg md:text-xl font-subheadline text-muted-foreground mt-2">Astrology & Numerology</p>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Giving your Life a meaning.
            </p>
          </header>
          
          <Card className="overflow-hidden shadow-lg border-none">
             <ProfileGenerator />
          </Card>

          <footer className="text-center mt-12 space-y-4">
            <blockquote className="text-muted-foreground italic">
              <p>"He who knows others is learned;</p>
              <p>He who knows himself is wise."</p>
              <cite className="mt-2 block not-italic font-semibold">Lao Tzu, Dao De Jing</cite>
            </blockquote>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Mystique Compass. All Rights Reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
