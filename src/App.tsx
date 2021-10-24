import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import Explore from "./pages/Explore";
import { Provider } from "react-redux";
import store from './store';
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/authenticated/Dashboard";
import View from "./pages/authenticated/View";
import Profile from "./pages/authenticated/Profile";

 

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

function App() {
  console.log(theme)
  return (
    <main className="App">
      <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <Layout>
            <Route exact path="/" >
              <LandingPage />
            </Route>
            <Route exact path="/explore" >
              <Explore />
            </Route>
            <Route exact path="/login" >
              <Login />
            </Route>
            <Route exact path="/signup" >
              <SignUp />
            </Route>
            <Route exact path="/dashboard" >
              <Dashboard />
            </Route>
            <Route exact path="/profile" >
              <Profile />
            </Route>
            <Route exact path="/watch/:id" >
              <View />
            </Route>
          </Layout>
        </ThemeProvider>
      </Router>
      </Provider>
    </main>
  );
}

export default App;
