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
    <div className="min-h-screen flex justify-center px-4 sm:px-6 py-10 font-sans">
      <div className="flex items-center justify-left p-10 text-white">
        <h1 className="text-6xl font-bold leading-tight fade-in-left fade-in-left-delayed heading-font">
          MOTIVATIONAL
          <br />
          QUOTES!
        </h1>
      </div>

      <main className="w-full max-w-xl pulse-neon bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-8 space-y-4 shadow-lg animate-glow">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearch)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/120 font-bold drop-shadow-sm">
                    ENTER A TOPIC
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/40 text-black font-bold placeholder-black/60 border border-black/90 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/10"
                      placeholder="e.g. opportunity, success"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-black/100 drop-shadow-sm font-bold">
                    Click Submit to get Motivational Quotes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Submit"}
            </Button>
          </form>
        </Form>

        {error && (
          <p className="text-red-500 p-4 bg-white/10 rounded-md border font-bold">
            {error}
          </p>
        )}

        {quoteList.length > 0 && (
          <div className="mt-6 space-y-4">
            {quoteList.map((quote, idx) => (
              <div key={idx} className="p-4 bg-white/10 rounded-md border">
                <p className="text-lg italic text-white">"{quote.quote}"</p>
                <p className="text-sm text-right text-white">
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
