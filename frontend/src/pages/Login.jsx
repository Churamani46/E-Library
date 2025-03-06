import { isLoggedInAtom } from "@/atoms/userData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OauthLogin } from "@/components/OauthLogin";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

const LoginForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/books");
    }
  }, []);

  const onSubmit = (values) => {
    setIsLoading(true);
    let promise = axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/users/login`,
      values
    );
    toast.promise(promise, {
      loading: "Loading...",
      success: (response) => {
        const { token } = response.data;
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        navigate("/books");
        return response.data.message;
      },
      error: (error) => error.response.data.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <>
      <div className="items-center grid dark:bg-zinc-950 p-4 min-h-svh">
        <Card className="mx-auto max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="gap-4 grid">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid">
                        <FormLabel className="text-left">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid">
                        <div className="flex">
                          <FormLabel className="text-left">Password</FormLabel>
                          <Link
                            href="#"
                            className="inline-block ml-auto text-sm underline">
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  )}
                </div>
                <div className="mt-4 text-sm text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </form>
          </Form>
          <OauthLogin />
         
        </Card>
      </div>
    </>
  );
};

export default LoginForm;
