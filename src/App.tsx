import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { AppState } from "./store";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import Explore from "./pages/Explore";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/authenticated/Dashboard";
import View from "./pages/authenticated/View";
import Profile from "./pages/authenticated/Profile";
import LayoutOpen from "./components/LayoutOpen";
import BecomeACreator from "./pages/authenticated/BecomeACreator";
import CreatorDashboard from "./pages/authenticated/creator/CreatorDashboard";
import CreatorLayout from "./components/CreatorLayout";

let theme = createTheme({
  palette: {
    primary: {
      main: "#5352ab",
    },
    secondary: {
      main: "rgb(36, 186, 248)",
    },
  },
});

let theme2 = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#5352ab",
    },
    secondary: {
      main: "rgb(36, 186, 248)",
    },
  },
});;

function CreatorRoutes() {
  let { path } = useRouteMatch();

  return (
    <CreatorLayout>
      <Switch>
        <Route exact path={`${path}/dashboard`}>
          <CreatorDashboard />
        </Route>
      </Switch>
    </CreatorLayout>
  );
}

function UserRoutes() {
  let { path } = useRouteMatch();
  return (
    <Layout>
      <Switch>
        <Route exact path={path}>
          <Dashboard />
        </Route>
        <Route path={`${path}/my-dashboard`}>
          <Profile />
        </Route>

        <Route exact path={`${path}/watch/:id`}>
          <View />
        </Route>
        <Route exact path={`${path}/become-creator`}>
          <BecomeACreator />
        </Route>
      </Switch>
    </Layout>
  );
}

function DefRoutes() {
  let { path } = useRouteMatch();
  return (
    <LayoutOpen>
      <Switch>
        <Route exact path={path}>
          <p>lion</p>
        </Route>
        <Route exact path={`${path}/watch/:id`}>
          <View />
        </Route>
      </Switch>
    </LayoutOpen>
  );
}

function VideoApp() {
  let user = useSelector((state: AppState) => state.auth.user);
  let darkMode =  useSelector((state: AppState) => state.settings.darkMode);

  let location = useLocation();

  console.log('darkMode')
  if (
    user &&
    (location.pathname === "/login" ||
      location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/explore")
  ) {
    return <Redirect to="/main" />;
  }
  return (
    <ThemeProvider theme={darkMode ? theme2 : theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          color: "text.primary",
        }}
      >
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path={`/login`}>
            <Login />
          </Route>
          <Route exact path={`/signup`}>
            <SignUp />
          </Route>
          <Route exact path={`/explore`}>
            <Explore />
          </Route>
          <Route path="/main">
            <UserRoutes />
          </Route>
          <Route path="/creator">
            <CreatorRoutes />
          </Route>
          <Route path="/open">
            <DefRoutes />
          </Route>
          <Route path="/creator">
            <p>lol</p>
          </Route>
        </Switch>
      </Box>
    </ThemeProvider>
  );
}
function App() {
  console.log(theme);
  return (
    <main className="App">
      <Provider store={store}>
        <Router>
          <VideoApp />
        </Router>
      </Provider>
    </main>
  );
}

export default App;
