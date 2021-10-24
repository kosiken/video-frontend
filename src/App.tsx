import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import Explore from "./pages/Explore";

type IntroCard = {
  image: string;
  header: string;
  description: string;
};

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
  return (
    <main className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <Layout>
            <Route exact path="/" >
              <LandingPage />
            </Route>
            <Route exact path="/explore" >
              <Explore />
            </Route>
          </Layout>
        </ThemeProvider>
      </Router>
    </main>
  );
}

export default App;
