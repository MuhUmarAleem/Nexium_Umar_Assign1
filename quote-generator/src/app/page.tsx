"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
});

export default function QuoteSearchForm() {
  const [quoteList, setQuoteList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: "",
    },
  });

  const handleSearch = async (values: { topic: string }) => {
    setError("");
    setQuoteList([]);
    setLoading(true);

    try {
      const res = await fetch("/quotes.json");
      const data = await res.json();
      const topic = values.topic.toLowerCase();

      if (!data[topic]) {
        setError("No quotes found for this topic.");
      } else {
        setQuoteList(data[topic]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load quotes.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex flex-col lg:flex-row justify-center items-center lg:items-start px-4 sm:px-6 py-10 font-sans gap-8 lg:gap-12">
  
  <div className="flex items-center justify-center lg:justify-left p-4 lg:p-10 text-white text-center lg:text-left">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight fade-in-left fade-in-left-delayed heading-font">
      MOTIVATIONAL
      <br />
      QUOTES!
    </h1>
  </div>
  <main className="w-full max-w-xl lg:max-w-2xl pulse-neon bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 sm:p-6 lg:p-8 space-y-4 shadow-lg animate-glow">
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="w-full space-y-4 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black/120 font-bold drop-shadow-sm text-sm sm:text-base">
                ENTER A TOPIC
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-white/40 text-black font-bold placeholder-black/60 border border-black/90 rounded-md px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-white/10 text-sm sm:text-base"
                  placeholder="e.g. opportunity, success"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-black/100 drop-shadow-sm font-bold text-xs sm:text-sm">
                Click Submit to get Motivational Quotes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 sm:py-3 text-sm sm:text-base"
        >
          {loading ? "Searching..." : "Submit"}
        </Button>
      </form>
    </Form>

    {error && (
      <p className="text-red-500 p-3 sm:p-4 bg-white/10 rounded-md border font-bold text-sm sm:text-base">
        {error}
      </p>
    )}

    {quoteList.length > 0 && (
      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        {quoteList.map((quote, idx) => (
          <div key={idx} className="p-3 sm:p-4 bg-white/10 rounded-md border">
            <p className="text-sm sm:text-base lg:text-lg italic text-white leading-relaxed">
              "{quote.quote}"
            </p>
            <p className="text-xs sm:text-sm text-right text-white mt-2">
              — {quote.author}
            </p>
          </div>
        ))}
      </div>
    )}
  </main>
</div>
  );
}
