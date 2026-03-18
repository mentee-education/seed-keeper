import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PasswordGate from "./components/PasswordGate";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Category from "./pages/Category";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/resources/:category"} component={Category} />
      <Route path={"/about"} component={About} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <PasswordGate>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </PasswordGate>
    </ErrorBoundary>
  );
}

export default App;
