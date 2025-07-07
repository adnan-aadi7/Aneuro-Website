import "./App.css";

//auth
import Login from "./auth/pages/login/Login";
import Signup from "./auth/pages/signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLayout from "./client/layout/layout";
import Quiz from "./auth/pages/quiz/Quiz";

//choosing plan

//welcome
import Dashboard from "./client/pages/Dashboard";
import Subcription from "./auth/pages/choosingPlan/Subcription";

function App() {
  return (
    //auth routes
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/quiz" element={<Quiz />} />

        {/* choosing plan or suubcription routes  */}
        <Route path="/plan" element={<Subcription />} />

        {/* cleint routes */}
        <Route
          path="/client/dashboard"
          element={
            <ClientLayout>
              <Dashboard />
            </ClientLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
