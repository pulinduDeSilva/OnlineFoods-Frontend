import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { authService } from "../services/authService";




export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isSignedup, setSignedup] = useState(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [isError, setError] = useState("");



    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError("")

        try {
            if (isLogin) {
                const credentials = { email, password: pass }
                console.log(credentials)

                console.log("logging")
                await authService.login(credentials);
                navigate("/")

            } else {
                const credentials = { email, password: pass, role: "CUSTOMER" }
                console.log(credentials)
                console.log("signup")
                await authService.signup(credentials);
                setIsLogin(true); 
                setSignedup(true)
            }
        } catch (error: any) {
            const msg = error.response?.data?.ErrorMessage || "Authentication Failed!";
            console.log(msg);
            setError("Please signup if you don't have an account.")
        }
    }

    return (
        <>
            <div className="flex w-screen h-screen overflow-hidden">
                {/* left panel for the image */}
                <article className="w-3/5 h-full bg-hero bg-cover">
                </article>

                {/* right panel for login form */}
                <aside className="h-screen w-2/5 flex items-center justify-center flex-col">
                    <h1 className="text-black text-4xl font-bold my-6">OnlineFoods.</h1>
                    <article className="h-[500px] w-[400px] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] border-1 border-gray-200 rounded-2xl flex items-center flex-col p-6">
                        <h2 className="my-8 text-2xl font-bold text-gray-800">{
                            isLogin ? "Sign in" : "Sign up"
                        }</h2>

                        {isLogin && isError &&(
                            <p className="text-red-400 text-sm my-2">{isError}</p>
                        )}

                        {
                            isSignedup && (
                                <p className="text-green-600 text-sm my-2">Account created successfully !</p>
                            )
                        }

                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold mt-4 hover:bg-gray-800 active:scale-[0.98] transition-all cursor-pointer"
                            >
                                {
                                    isLogin ? "Sign in" : "Sign up"
                                }
                            </button>
                        </form>

                        {/* Navigation Toggle */}
                        <p className="mt-8 text-sm text-gray-600">
                            {
                                isLogin ? "Don't have an account? " : "Already have an account? "
                            }

                            <button
                                
                                onClick={() => { if(isLogin) {
                                    setIsLogin(false); setError("");
                                }else {
                                    setIsLogin(true); setError("");
                                } }}
                                className="text-black font-bold hover:underline cursor-pointer"
                            >
                                {
                                    isLogin ? "Sign up" : "Sign in"
                                }
                            </button>
                        </p>

                    </article>

                </aside >
            </div>

        </>
    );
}

