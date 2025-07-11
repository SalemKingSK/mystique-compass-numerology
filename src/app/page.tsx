import { AstroInsights } from '@/components/astro-insights';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
              Astro Insights
            </h1>
            <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ask about a celestial object and get AI-powered insights.
            </p>
          </header>
          
          <Card className="overflow-hidden shadow-lg">
             <AstroInsights />
          </Card>

          <footer className="text-center mt-12 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Astro Insights. All Rights Reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
