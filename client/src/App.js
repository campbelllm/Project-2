import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './pages/common/components/Navbar';
import TestSite from '../src/pages/common/components/TestSite';
import { Button } from "@material-ui/core";
import { Link } from 'react-router-dom';
import {
  WrappedSignUp,
  WrappedSignIn,
} from './pages/Viewer';
import User from '../src/pages/common/components/User.js';
import About from '../src/pages/common/components/About.js';


function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={About} />
        <Route path='/testsite' component={TestSite} />
        <Route path='/signup' component={User} />
        <Route path='/signin' component={WrappedSignIn} />

      </Switch>




      <Route exact path="/">

      </Route>
    </Router>

  );
}

export default App;
