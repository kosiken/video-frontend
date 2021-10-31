import React from 'react'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { AppState } from "./store";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./pages/admin/Login";
import SignUp from "./pages/admin/Signup";
import View from "./pages/authenticated/View";
import LayoutOpen from "./components/LayoutOpen";
import ApiSignleton from "./api/adminApi";
import ApiLoader from './components/ApiLoader';
import LoadingPageIndicator from './components/LoadingPageIndicator';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

 
let theme = createTheme({
  palette: {
    primary: {
      main: "rgb(160,0,5)",
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
      main: "rgb(160,0,5)",
    },
    secondary: {
      main: "rgb(36, 186, 248)",
    },
  },
});;



function AdminRoutes() {
  let { path } = useRouteMatch();

  
  return (
    <AdminLayout>
      <Switch>
        <Route exact path={`${path}/dashboard`}>
       <AdminDashboard/>
        </Route>


      </Switch>
    </AdminLayout>
  );
}


function AdminApp() {
  let user = useSelector((state: AppState) => state.auth.user);
  let darkMode = useSelector((state: AppState) => state.settings.darkMode);
  const [loading, setLoading] = React.useState(true)
  const dispatch = useDispatch()
  let location = useLocation();
  const Api = ApiSignleton();
  const getUser = async () => {
    if (user) {
      setLoading(false);
      return;
    }
    // try {
      let u = await Api.me();
     if(u && u.email)dispatch({ type: "login", user: u });
      setLoading(false)
    // }
    // catch (err) {
    //   setLoading(false);
    // }
  }


  // React.useEffect(() => {


  //   getUser();


  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  console.log('darkMode')
  if (
    user &&
    (location.pathname === "/login" ||
      location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/explore")
  ) {
    console.log(location.pathname)
    return <Redirect to="/admin/dashboard" />;
  }
  else if(!user && !loading) {
    if(!(location.pathname === "/login") && !(location.pathname === '/signup') ) {
      return <Redirect to={`/login`} />;
    }
  }


  const mainBody = (  
    <div><Switch>
   <Route  path="/admin">
       <AdminRoutes/>
   </Route>
   <Route exact path={`/login`}>
      <Login />
    </Route>
    <Route exact path={`/signup`}>
      <SignUp />
    </Route>
  </Switch>
 
  </div> )
  
  return (
    <ThemeProvider theme={darkMode ? theme2 : theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          color: "text.primary",
        }}
      >
     { loading ? <LoadingPageIndicator /> : mainBody}
     <ApiLoader setLoading={setLoading} request={getUser} onLoad={() => console.log('loaded')} />
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
          <AdminApp />
        </Router>
      </Provider>
    </main>
  );
}

export default App;
