import "./App.css";

//auth
import Login from "./auth/pages/login/Login";
import Signup from "./auth/pages/signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./client/layout/layout";
import Quiz from "./auth/pages/quiz/Quiz";

//welcome
import Dashboard from "./client/pages/Dashboard";

function App() {
  return (
    //auth routes
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/quiz" element={<Quiz />} />

        {/* welcome cleint routes */}
        <Route
          path="/client/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
