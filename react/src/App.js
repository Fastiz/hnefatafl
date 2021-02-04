import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {
  Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./views/Home";
import Match from "./views/match/Match";
import {HOME, MATCH} from "./constants/routes";
import history from "./history";

function App() {

  return (
      <Router history={history}>
          <Switch>
              <Route exact path={HOME}>
                <Home/>
              </Route>

              <Route exact path={MATCH}>
                <Match/>
              </Route>
          </Switch>
      </Router>
  );
}

export default App;
