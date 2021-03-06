import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
// import Logo from '../../../../public/logo.png'
import { useSelector, useDispatch } from "react-redux";
import { setViewerToken } from "../../Viewer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "Raleway, sans-serif",
    color: "#FF0344",
    fontSize: '20px',
  },
  appBar: {
    background: "white",
    opacity: "0.8",
    color: "#FF0344",
  },
  signIn: {
    fontFamily: "Raleway, sans-serif",
    color: "#FF0344",
    fontSize: '20px',
  },
  logo: {
    height: '40px',
    cursor: 'pointer',
    filter: "saturate(5%)",
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const { token } = useSelector((state) => state.viewer);
  const dispatch = useDispatch();
  const history = useHistory();
  const username =localStorage.getItem("username")
  const handleSignUp = () => { };

  const handleProfile = () => {
    history.push(`/Profile/${username}`);
  };

  const handleClick = () => {
    history.push("/");
  }

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.root}>
        <a
                  href="/"
                  style={{ textDecoration: "none", color: "#FF0344" }}
                >
                  ROAMING FOR RONA
                </a>
          {/* <div onClick={handleClick}><img className={classes.logo} src='../../../logo.png' /></div> */}
          <div >
            {localStorage.getItem('token') ? (
              <Button className={classes.signIn} onClick={handleProfile}>Profile</Button>
            ) : (
                <div className={classes.signIn}>
                  <Button to="/signup" component={Link} className={classes.signIn}>
                    Sign Up
                </Button>
                  <Button to="/signin" component={Link} className={classes.signIn}>
                    Sign In
                </Button>
                </div>
              )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
