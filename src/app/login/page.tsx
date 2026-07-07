"use client";
import Input from "@/components/ui/Input";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";
import {useState} from "react";
import { useRouter} from "next/navigation";
export default function LoginPage() {
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [message,setMessage]= useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const router = useRouter();
    const handleLogin = async() => {
        
        setLoading(true);
        setMessage("");
       

        if(!email || !password){
            setMessage("Please fill all fields");
            setIsError(true);
            setLoading(false);
            return;
        }
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const data= await response.json();

        setMessage(data.message);
        setIsError(!data.success);
        if(data.success){

    localStorage.setItem(
      "username",
      data.user.username
    );

    router.push("/chat");
}

        setLoading(false);

    };
    return (
           <AuthLayout>    
                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>
                <p className="text-zinc-400 text-center mt-2">
                    Login to continue chatting
                </p>
                <form className="flex flex-col gap-4 mt-8">
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
                     onClick={handleLogin} 
                     className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition">
                        Login
                     </button>
                     {message && (
                        <p className="text-center text-sm text-zinc-300 mt-4">
                            {message}
                        </p>
                     )}
                     <p className="text-center text-sm text-zinc-400 mt-4">
                        Don't have an account?{" "}
                        <Link
                        href="/signup"
                        className="text-white hover:underline"
                        >
                            Sign Up
                        </Link>
                     </p>
                     

                </form>
           </AuthLayout>  
    )
}