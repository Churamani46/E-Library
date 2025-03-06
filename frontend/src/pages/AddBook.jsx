import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { bookSchema } from "@/schema";
import SelectGenreCombobox from "@/components/SelectGenreCombobox";
import genres from "@/utilities/genres";
import { useSetRecoilState } from "recoil";
import { pageTitleAtom } from "@/atoms/meta";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

const AddBook = () => {
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  useEffect(() => setPageTitle("Add Book"), []);
  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      genre: [],
      image: "",
      book_file: "",
      year_published: new Date().getFullYear(),
    },
  });
  const navigate = useNavigate();
  const fileRef = form.register("file");
  const bookRef = form.register("file");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (values) => {
    setIsLoading(true);
    let promise = axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/books`,
      values,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.promise(promise, {
      loading: "Loading...",
      success: (response) => {
        navigate("/books/");
        return response.data.message;
      },
      error: (error) => error.response.data.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="flex-1 gap-4 md:gap-8 grid p-4 sm:px-6">
      <Card className="shadow-md mx-auto rounded-lg w-full max-w-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="border-slate-200 dark:border-zinc-800 border-b">
              <CardTitle>Add Book</CardTitle>
            </CardHeader>
            <CardContent className="gap-3 grid sm:grid-cols-3 py-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-3">
                    <FormLabel className="text-left">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of the Book" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-2">
                    <FormLabel className="text-left">Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author of the Book" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year_published"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-left">Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Year Published"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-3">
                    <FormLabel className="text-left">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief summary of the book..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-3">
                    <FormLabel className="text-left">Genre</FormLabel>
                    <FormControl>
                      <SelectGenreCombobox
                        options={genres}
                        name="Genre"
                        form={form}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-2">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="image"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <Input
                            type="file"
                            {...rest}
                            onChange={(event) => {
                              onChange(event.target.files?.[0] ?? undefined);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="book_file"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-2">
                    <FormLabel>Book</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="book_file"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <Input
                            type="file"
                            {...rest}
                            onChange={(event) => {
                              onChange(event.target.files?.[0] ?? undefined);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="px-6 py-4 border-slate-200 dark:border-zinc-800 border-t">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddBook;
