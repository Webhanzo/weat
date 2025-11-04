import SuggestionForm from "@/components/suggestions/suggestion-form";
import { Lightbulb } from "lucide-react";

export default function SuggestionsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <Lightbulb className="mx-auto h-12 w-12 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-4">
          Need inspiration?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">
          Let our AI help your group decide what to eat. Fill out the preferences below to get tailored suggestions.
        </p>
      </div>
      <SuggestionForm />
    </div>
  );
}
