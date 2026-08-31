import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import QuoteWizard from "./pages/QuoteWizard";
import QuoteResults from "./pages/QuoteResults";
import HowItWorks from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import AdminLogin from "./pages/AdminLogin";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import FirstTimeBuyer from "./pages/FirstTimeBuyer";
import SaleAndPurchaseConveyancing from "./pages/SaleAndPurchaseConveyancing";
import CompareConveyancingFees from "./pages/CompareConveyancingFees";
import SavedQuote from "./pages/SavedQuote";
import UKConveyancingCostGuide from "./pages/UKConveyancingCostGuide";
import SellerConveyancingChecklist from "./pages/SellerConveyancingChecklist";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/get-quote"} component={QuoteWizard} />
      <Route path={"/results"} component={QuoteResults} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/contact"} component={ContactUs} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogArticle} />
      <Route path={"/payment/success"} component={PaymentSuccess} />
      <Route path={"/payment/cancel"} component={PaymentCancel} />
      <Route path={"/first-time-buyer-conveyancing"} component={FirstTimeBuyer} />
      <Route path={"/sale-and-purchase-conveyancing"} component={SaleAndPurchaseConveyancing} />
      <Route path={"/compare-conveyancing-fees"} component={CompareConveyancingFees} />
      <Route path={"/uk-conveyancing-cost-guide"} component={UKConveyancingCostGuide} />
      <Route path={"/seller-conveyancing-checklist"} component={SellerConveyancingChecklist} />
      <Route path={"/quote/:ref"} component={SavedQuote} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
