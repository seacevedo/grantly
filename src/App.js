import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageNavbar from './components/PageNavbar';
import PendingGrants from './pages/PendingGrants';
import SubmitGrants from './pages/SubmitGrants';
import FundedGrants from './pages/FundedGrants';




function App() {


  const logIn = async () => {
    if (window.ethereum || window.web3){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }

    else {
      console.log('Metamask Not Installed');
    }
  }



  return (
    <div>
      <Router>
        <PageNavbar title='Grantly' onClick={() => logIn() } />
        <Switch>
          <Route exact path="/" component={PendingGrants} />
          <Route exact path="/funded_grants" component={FundedGrants} />
          <Route exact path="/submit_grants" component={SubmitGrants} />
        </Switch>
      </Router>
    </div>
  );

}

export default App;
