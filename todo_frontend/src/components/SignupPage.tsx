import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import {
  useMutation
} from '@tanstack/react-query';
import { useToast } from "./ui/use-toast";
import { Loader } from "lucide-react";

interface ISignupState {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}


const handleSignupSubmit = async (data: ISignupState) => {
  if (data.password === "" || data.phone.length != 10 || data.firstName.length < 3 || data.lastName.length < 3) {
    throw Error("Please fill all the fields before submitting.");
    
  }
  const res = await fetch("/api/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...data, name: `${data.firstName} ${data.lastName}` })
  });
  if (res.status != 200) {
    throw Error("Can not sign in at the moment, please try again later");
  }

  const session = await res.json();

  console.log(session);
  localStorage.setItem("session", session.token);
  window.location.href = "/todos";
}

export const SignupPage = () => {
  const [state, setState] = useState<ISignupState>({
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const { toast } = useToast();

  // Queries
  const signupMutation = useMutation({
    mutationFn: handleSignupSubmit
  })

  useEffect(() => {
    if (signupMutation.isSuccess) {
      toast({
        title: "Welcome!",
        description: "You have been signed up!",
      });
    }

    if (signupMutation.isError) {
      toast({
        title: "Error while signing up",
        description: signupMutation.error?.message
      });
    }
  }, [signupMutation.isSuccess, signupMutation.isError, signupMutation.error])



  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required onChange={(e) => setState((prev) => ({ ...prev, firstName: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required onChange={(e) => setState((prev) => ({ ...prev, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="phone"
              placeholder="729*******"
              value={state.phone}
              onChange={(e) => setState((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))} />
          </div>
          <Button type="submit" className="w-full" onClick={() => signupMutation.mutate(state)}>
            <span className="mr-2">Create an account</span>
            {signupMutation.isPending ? <span><Loader className="animate-spin" /></span> : null}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
