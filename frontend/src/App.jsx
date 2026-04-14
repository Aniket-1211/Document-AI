import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import DocumentsPage from "./pages/DocumentsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

const readStoredUser = () => {
  const storedUser = localStorage.getItem("docAIUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => readStoredUser());

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(readStoredUser());
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={currentUser ? "/upload" : "/signin"} replace />}
        />
        <Route
          path="/upload"
          element={currentUser ? <HomePage /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/documents"
          element={currentUser ? <DocumentsPage /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/chat"
          element={currentUser ? <ChatPage /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/chat/:documentId"
          element={currentUser ? <ChatPage /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/signin"
          element={currentUser ? <Navigate to="/upload" replace /> : <SignInPage />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/upload" replace /> : <SignUpPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
