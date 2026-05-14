import { useNavigate } from "react-router";



export default function Home() {
    const navigate = useNavigate();



    return (
        <>
            <aside className="h-screen w-screen flex items-center justify-center flex-col">
                <h1 className="text-5xl text-black">Welcome to <span className="font-bold">OnlineFoods.</span></h1>

               

            </aside>
        </>
    );
}

