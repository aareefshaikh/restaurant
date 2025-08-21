import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import { UserProvider, useUser } from "./context/UserContext";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;