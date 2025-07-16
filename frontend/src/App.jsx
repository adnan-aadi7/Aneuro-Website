import "./App.css";

//auth
import Login from "./auth/pages/login/Login";
import Signup from "./auth/pages/signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLayout from "./client/layout/layout";
import Quiz from "./auth/pages/quiz/Quiz";

// cleint
import Dashboard from "./client/pages/dashboard/Dashboard";
import Subcription from "./auth/pages/choosingPlan/Subcription";
import ResultsOverView from "./client/pages/resultOverview/ResultsOverView";
import AnalyticsOverview from "./client/pages/analyticsOverview/AnalyticsOverview";
import QuizDetials from "./client/pages/analyticsOverview/QuizDetials";
import IncompleteQuiz from "./client/pages/analyticsOverview/IncompleteQuiz";
import FeedBack from "./client/pages/feedback/FeedBack";
import SupportCenter from "./client/pages/support/SupportCenter";
import Subscription from "./client/pages/subsriptionPlan/Subscription";
import FunnelTemplates from "./client/pages/funnelTemplates/FunnelTemplates";
import PromptPacks from "./client/pages/promptPacks/PromptPacks";
import EmailSequence from "./client/pages/emailSequence/EmailSequence";
import BillingView from "./client/pages/subsriptionPlan/BillingView";
import EnterPrizeQuiz from "./client/pages/enterprieQuiz/EnterPrizeQuiz";
import UserRefund from "./client/components/subscription/refund";
import Requestrefund from "./client/components/subscription/requestrefund";
import Settings from "./client/pages/settings/Settings";
import Notifications from "./client/components/notification/Notifications";

// admin
import AdminLayout from "./admin/layout/layout";
import AdminDashboard from "./admin/pages/dashboard/AdminDashboard";
import Users from "./admin/pages/users/Users";
import Details from "./admin/pages/users/Details";
import Support from "./admin/pages/support&feedback/Support";
import Userdetail from "./admin/pages/support&feedback/userdetail";
import BillingOverview from "./admin/pages/Managesubscription/billingOverview";
import UserDetails from "./admin/pages/Managesubscription/user-details";
import Refunddetail from "./admin/pages/Managesubscription/refunddetailrequest";
import Admincontrolcenter from "./admin/pages/cms/adminControlCenter/admincontrolcenter";
import AddEmailManuall from "./admin/pages/cms/addEmailManullay/AddEmailManuall";
import Settingtabs from "./admin/pages/settings/setting";
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
          path="/client/manage-subscription"
          element={
            <ClientLayout>
              <UserRefund />
            </ClientLayout>
          }
        />
        <Route
          path="/client/refund/request-refund"
          element={
            <ClientLayout>
              <Requestrefund />
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
          path="/email-sequences"
          element={
            <ClientLayout>
              <EmailSequence />
            </ClientLayout>
          }
        />
        <Route
          path="/prompt-packs"
          element={
            <ClientLayout>
              <PromptPacks />
            </ClientLayout>
          }
        />
        <Route
          path="/funnel-templates"
          element={
            <ClientLayout>
              <FunnelTemplates />
            </ClientLayout>
          }
        />

        <Route
          path="/client/manage-subscription/subscriptions"
          element={
            <ClientLayout>
              <Subscription />
            </ClientLayout>
          }
        />
        <Route
          path="/billing-overview"
          element={
            <ClientLayout>
              <BillingView />
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
        <Route
          path="/enterprize-quiz"
          element={
            <ClientLayout>
              <EnterPrizeQuiz />
            </ClientLayout>
          }
        />
        <Route
          path="/client-settings"
          element={
            <ClientLayout>
              <Settings />
            </ClientLayout>
          }
        />
        <Route
          path="/client-notifications"
          element={
            <ClientLayout>
              <Notifications />
            </ClientLayout>
          }
        />

        {/* admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/user/details"
          element={
            <AdminLayout>
              <Details />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/support/feedback"
          element={
            <AdminLayout>
              <Support />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/support/feedback/user-detail"
          element={
            <AdminLayout>
              <Userdetail />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/manage-subscription"
          element={
            <AdminLayout>
              <BillingOverview />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/manage-subscription/user-detail"
          element={
            <AdminLayout>
              <UserDetails />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/manage-subscription/refund-request"
          element={
            <AdminLayout>
              <Refunddetail />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/CMS"
          element={
            <AdminLayout>
              <Admincontrolcenter />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/mannual-email"
          element={
            <AdminLayout>
              <AddEmailManuall />
            </AdminLayout>
          }
        />
         <Route
          path="/admin/Settings"
          element={
            <AdminLayout>
              <Settingtabs />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
