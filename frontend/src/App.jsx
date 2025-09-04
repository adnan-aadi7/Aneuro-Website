import "./App.css";

// auth
import Login from "./auth/pages/login/Login";
import Signup from "./auth/pages/signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLayout from "./client/layout/layout";
import Quiz from "./auth/pages/quiz/Quiz";
import ForgotPassword from "./auth/pages/forgotPassword/ForgotPassword";
import EmailInstructions from "./auth/pages/forgotPassword/EmailInstructions";
import NewPassword from "./auth/pages/forgotPassword/NewPassword";
import GoogleCallback from "./auth/components/login/GoogleCallback";
import FacebookCallback from "./auth/components/login/FacebookCallback";

// guards
import RequireAuth from "./auth/components/RequireAuth";
import RequireRole from "./auth/components/RequireRole";

// client
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
import Support from "./admin/pages/supportFeedback/Support";
import Userdetail from "./admin/pages/supportFeedback/Userdetail";
import BillingOverview from "./admin/pages/Managesubscription/billingOverview";
import UserDetails from "./admin/pages/Managesubscription/user-details";
import Refunddetail from "./admin/pages/Managesubscription/refunddetailrequest";
import Admincontrolcenter from "./admin/pages/cms/adminControlCenter/admincontrolcenter";
import AddEmailManuall from "./admin/pages/cms/addEmailManullay/AddEmailManuall";
import Settingtabs from "./admin/pages/settings/setting";
import Analytics from "./admin/pages/analyticsOverview/Analytics";
import EmailStatsDetails from "./admin/pages/analyticsOverview/EmailStatsDetails";
import PromptStatsDetails from "./admin/pages/analyticsOverview/PromptStatsDetails";
import FunnelStatsDetails from "./admin/pages/analyticsOverview/FunnelStatsDetails";

// landing pages
import Home from "./landingpage/pages/home";
import AboutUs from "./landingpage/pages/AboutUs";

// audience
import Audience from "./Audience/audience";
import Policy from "./termsConditions/Policy";
import AddAdmin from "./admin/components/settings/AddAdmin";
import AdminPermission from "./admin/components/settings/AdminPermission";
import MannualPrompt from "./admin/components/cms/overviewTab/MannualPrompt";
import EditFunnel from "./admin/components/cms/funnelTab/EditFunnel";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-instruction" element={<EmailInstructions />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/facebook/callback" element={<FacebookCallback />} />

        <Route path="/Audience-quiz/:userId" element={<Audience />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/plan" element={<Subcription />} />

        {/* ---------- Protected (any logged-in user) ---------- */}
        <Route element={<RequireAuth />}>
          {/* Client area */}
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
            path="/quiz-details/:userId/:audienceId"
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

          {/* ---------- Admin-only (must be logged in + userType === 'admin') ---------- */}
          <Route element={<RequireRole roles={['admin']} />}>
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
              path="/admin/analytics"
              element={
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/analytics/email-details"
              element={
                <AdminLayout>
                  <EmailStatsDetails />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/analytics/email-details/:sequenceId"
              element={
                <AdminLayout>
                  <EmailStatsDetails />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/analytics/prompts-details"
              element={
                <AdminLayout>
                  <PromptStatsDetails />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/analytics/prompts-details/:packId"
              element={
                <AdminLayout>
                  <PromptStatsDetails />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/analytics/funnel-details/:templateId"
              element={
                <AdminLayout>
                  <FunnelStatsDetails />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/edit-funnel/:templateId"
              element={
                <AdminLayout>
                  <EditFunnel />
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
              path="/admin/support/feedback/user-detail/:ticketId"
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
              path="/admin/mannual-email/:sequenceId"
              element={
                <AdminLayout>
                  <AddEmailManuall />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/mannual-prompt"
              element={
                <AdminLayout>
                  <MannualPrompt />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/mannual-prompt/:packId"
              element={
                <AdminLayout>
                  <MannualPrompt />
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
            <Route
              path="/admin/settings/add-admin"
              element={
                <AdminLayout>
                  <AddAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/settings/admin-permission"
              element={
                <AdminLayout>
                  <AdminPermission />
                </AdminLayout>
              }
            />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
