import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChainPage } from './components/ChainPage'
import { StateProvider } from './context/store'

class AppComponent extends React.Component {
  render() {
    return (
      <StateProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={ChainPage} />
            <Redirect to="/" />
          </Switch>
        </Router>
        <ToastContainer position={toast.POSITION.TOP_LEFT} />
      </StateProvider>
    )
  }
}

export default AppComponent
