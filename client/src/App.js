import 'dotenv/config'

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ChainPage from './pages/ChainPage'

const BlockPage = () => {
  return <div></div>
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/block/:id" component={BlockPage} />
            <Route exact path="/" component={ChainPage} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
