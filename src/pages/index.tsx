import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/router";

export const formInput = z.object({
  name: z.string().min(5, "Name must be at least 5 characters."),
  startMin: z.string().default("9"),
  endMin: z.string().default("17"),
  dates: z.array(z.date()).min(1, "Please select at least one date."),
});

export const CreateForm = () => {
  const form = useForm<z.infer<typeof formInput>>({
    resolver: zodResolver(formInput),
    defaultValues: {
      name: "",
      startMin: "9",
      endMin: "17",
      dates: [],
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const mutation = api.event.createEvent.useMutation();

  async function onSubmit(values: z.infer<typeof formInput>) {
    console.log("Submitting");
    const res = await mutation.mutateAsync({
      name: values.name,
      startMin: parseInt(values.startMin),
      endMin: parseInt(values.endMin),
      dates: values.dates,
    });

    toast({
      title: "Event Created",
      description: `Your event has been created. Redirecting...`,
      variant: "default",
    });

    router.push(`/${res.id}`);
  }

  const startMinV = form.watch("startMin");

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center justify-center py-8"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <div className="flex flex-col items-start justify-center gap-4 py-4 md:flex-row">
          {/* Event Name */}
          <div className="w-72 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* No Earlier Than */}
            <FormField
              control={form.control}
              name="startMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Earlier Than</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent asChild className="h-64 overflow-y-scroll">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i}`}>
                          {i % 12 || 12}:00 {i < 12 ? "AM" : "PM"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* No Later Than */}
            <FormField
              control={form.control}
              name="endMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Later Than</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent asChild className="h-64 overflow-y-scroll">
                      {Array.from({ length: 25 }).map((_, i) => {
                        if (i <= parseInt(startMinV)) return null;
                        if (i === 24) {
                          return (
                            <SelectItem key={i} value={`${i}`}>
                              12:00 AM
                            </SelectItem>
                          );
                        }
                        return (
                          <SelectItem key={i} value={`${i}`}>
                            {i % 12 || 12}:00 {i < 12 ? "AM" : "PM"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Dates</FormLabel> */}
                <Calendar
                  mode="multiple"
                  selected={field.value}
                  onSelect={(dates) => {
                    field.onChange(dates);
                  }}
                  fromDate={new Date()}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Dates */}

        <Button type="submit">Create Event</Button>
      </form>
    </Form>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center p-8">
        <h1 className="text-center text-2xl font-bold">Meet Sync</h1>
        <p className="text-center">
          A simple tool to quickly survey the best time for your group to get
          together.
        </p>

        <CreateForm />
      </main>
    </>
  );
}
