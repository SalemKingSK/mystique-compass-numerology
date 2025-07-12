import { ProfileGenerator } from '@/components/profile-generator';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <main className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
              AstroInsights
            </h1>
            <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your details to generate a complete personal profile.
            </p>
          </header>
          
          <Card className="overflow-hidden shadow-lg border-none">
             <ProfileGenerator />
          </Card>

          <footer className="text-center mt-12">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Astro Insights. All Rights Reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
