import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ChainPage from "./pages/ChainPage";
import "./App.css";
import "dotenv/config";

const BlockPage = () => {
  return <div></div>;
};

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          {/* <div className="header">
            <div className="container">
              <a href="/">Chain</a>
              <a href="/actors">Actors</a>
            </div>
          </div> */}
          <Switch>
            <Route exact path="/block/:id" component={BlockPage} />
            <Route exact path="/" component={ChainPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
