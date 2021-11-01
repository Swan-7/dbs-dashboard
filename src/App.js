import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import {
  Icon,
  IconButton,
  Typography,
  ListItemIcon,
  CssBaseline,
  LinearProgress,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";

import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { auth } from "./constants/firestore";
import { update, updateLoading } from "./redux/reducers/user/slice";
import { useDispatch, useSelector } from "react-redux";

import Logo from "./assets/logo_2.png";
import Home from "./pages/home/home";
import Products from "./pages/products/products";
import Orders from "./pages/orders/orders";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setloadingpage(true);
    auth.onAuthStateChanged((userState) => {
      // setloadingpage(false);
      dispatch(updateLoading(false));
      if (userState) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = userState.uid;
        console.log(userState, "user found");
        dispatch({
          type: "pharmacies",
        });
        dispatch({
          type: "orders",
        });
        dispatch({
          type: "user",
          payload: {
            id: userState.uid,
          },
        });

        // ...
      } else {
        console.log("user sign out");
        dispatch(update(null));

        history.push("/signin");
        // User is signed out
        // ...
      }
    });
  }, []);
  useEffect(() => {
    setloadingpage(user.loading);
  }, [user]);

  const [loadingpage, setloadingpage] = useState(true);
  const [openSnack, setOpenSnack] = useState({
    show: false,
    message: "",
    severity: "",
  });

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack({
      message: "",
      show: false,
      severity: "",
    });
  };

  if (loadingpage) {
    return (
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "1em",
        }}
      >
        <img alt="loading" src={Logo} width={100} />
        <div style={{ width: 100, height: 20 }}>
          <LinearProgress color="secondary" />
        </div>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6" noWrap>
            DRUG DISTRIBUTION SYSTEM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <Icon>chevron_right</Icon>
            ) : (
              <Icon>chevron_left</Icon>
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            { title: "Pharmacy", icon: "local_pharmacy", pathname: "/" },
            {
              title: "Orders",
              icon: "list_alt",
              pathname: "/orders",
            },
          ].map((item, index) => (
            <ListItem
              button
              onClick={() => {
                history.push(item.pathname);
              }}
              key={item.title}
              style={{
                color: location.pathname === item.pathname ? "green" : "grey",
                backgroundColor:
                  location.pathname === item.pathname
                    ? "rgba(0,255,0,0.2)"
                    : "transparent",
              }}
            >
              <ListItemIcon>
                <Icon
                  style={{
                    color:
                      location.pathname === item.pathname ? "green" : "grey",
                  }}
                >
                  {item.icon}
                </Icon>
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
        {/* <Divider />
  <List>
    {["All mail", "Trash", "Spam"].map((text, index) => (
      <ListItem button key={text}>
        <ListItemIcon>
          {index % 2 === 0 ? (
            <Icon>chevron_right</Icon>
          ) : (
            <Icon>chevron_right</Icon>
          )}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    ))}
  </List> */}
        <div style={{ bottom: 0, position: "absolute" }}>
          <ListItem
            button
            onClick={() => {
              
              auth
                .signOut()
                .then(() => {
                  setOpenSnack({
                    severity: "success",
                    message: "User signed out successfully",
                    show: true,
                  });
                  
                  setTimeout(() => {
                    history.replace("/signin");
                  }, 2500);
                })
                .catch(() => {
                  setOpenSnack({
                    severity: "error",
                    message: "Error signing out, try again",
                    show: true,
                  });
                });
            }}
          >
            <ListItemIcon>
              <Icon>logout</Icon>
            </ListItemIcon>
            <ListItemText primary={"Log out"} />
          </ListItem>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
          <Switch>
            <Route path="/:id/products">
              <Products />
            </Route>
            <Route path="/orders">
              <Orders />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default App;
