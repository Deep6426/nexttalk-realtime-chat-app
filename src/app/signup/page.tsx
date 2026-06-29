"use client";
import Input from "@/components/ui/Input";
import AuthLayout from "@/components/auth/AuthLayout";
import {useState} from "react";
import Link from "next/link";
import bcrypt from "bcryptjs";

export default function SignupPage() {
    const [username,setUsername]= useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [message,setMessage]= useState("");
    const [loading,setLoading]= useState(false);
    const [isError, setIsError]= useState(false);
    
    
    const handleSignup = async () => {
        setLoading(true);
        setMessage("");

        if(!username || !email || !password){
            setMessage("Please fill all fields");
            setIsError(true);
            setLoading(false);  
            return;
        }
        if(username.length < 3){
            setMessage("Username must be atleast 3 characters");
            setIsError(true);
            setLoading(false);
            return;
        }
        if(!email.includes("@")){
            setMessage("Please enter a valid email");
            setIsError(true);
            setLoading(false);
            return ;
        }
        if(password.length<6){
            setMessage("Password must be at least 6 characters");
            setIsError(true);
            setLoading(false);
            return;
        }
        const response = await fetch("/api/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });
        const data= await response.json();

        setIsError(false);
        setMessage(data.message);
        setLoading(false);
        
    };
    return (
        <AuthLayout>
                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>
                <p className="text-zinc-400 text-center mt-2">
                    Sign up to start chatting instantly
                </p>
                <form className="flex flex-col gap-4 mt-8">
                    <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                     type="email"
                     placeholder="Email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     />
                     <Input
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     />
                     
                     <button
                     type="button"
                     disabled={loading}
                     onClick={handleSignup} 
                     className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Signing Up..." : "Sign Up"}
                     </button>
                     {message && (
                     <p
                      className={
                     isError
                      ? "bg-red-600 text-white p-4 rounded-lg border border-red-300 shadow-lg"
                       : "bg-green-500 text-black p-4 rounded-lg border border-green-200 shadow-lg"
                      }
                     >
                     {message}
                     </p>
                     )}
                     <p className="text-center text-sm text-zinc-400 mt-4">
                        Already have an account?{" "}
                        <Link
                        href="/login"
                        className="text-white hover:underline"
                        >
                            Login
                        </Link>
                     </p>
                     

                </form>
            </AuthLayout>
    )
}