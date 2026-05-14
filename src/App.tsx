import { Navigate, Route, Routes } from "react-router"
import Home from "./pages/Home"
import LoginPage from "./pages/Login";
import { useEffect, useState } from "react";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <>
        <Routes>
          <Route path="/auth" element={<LoginPage />}></Route>
          <Route path="/" element={isAuthenticated? <Home />: <Navigate to="/auth"/>}></Route>

        </Routes>

    </>
  )
}

export default App
