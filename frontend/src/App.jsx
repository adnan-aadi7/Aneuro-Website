import "./App.css";

//auth
import Login from "./auth/pages/login/Login";
import Signup from "./auth/pages/signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLayout from "./client/layout/layout";
import Quiz from "./auth/pages/quiz/Quiz";

import Dashboard from "./client/pages/dashboard/Dashboard";
import Subcription from "./auth/pages/choosingPlan/Subcription";
import ResultsOverView from "./client/pages/resultOverview/ResultsOverView";
import AnalyticsOverview from "./client/pages/analyticsOverview/AnalyticsOverview";
import QuizDetials from "./client/pages/analyticsOverview/QuizDetials";
import IncompleteQuiz from "./client/pages/analyticsOverview/IncompleteQuiz";
import FeedBack from "./client/pages/feedback/FeedBack";
import SupportCenter from "./client/pages/support/SupportCenter";

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
        <Route
          path="/results-overview"
          element={
            <ClientLayout>
              <ResultsOverView />
            </ClientLayout>
          }
        />
        <Route
          path="/analytics-overview"
          element={
            <ClientLayout>
              <AnalyticsOverview />
            </ClientLayout>
          }
        />
        <Route
          path="/quiz-details"
          element={
            <ClientLayout>
              <QuizDetials />
            </ClientLayout>
          }
        />
        <Route
          path="/incomplete-quiz"
          element={
            <ClientLayout>
              <IncompleteQuiz />
            </ClientLayout>
          }
        />
        <Route
          path="/support-center"
          element={
            <ClientLayout>
              <SupportCenter />
            </ClientLayout>
          }
        />
        <Route
          path="/leave-feedback"
          element={
            <ClientLayout>
              <FeedBack />
            </ClientLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
