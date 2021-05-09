import "./App.css";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import Login from "./pages/Login.js";
import Register from "./pages/register";
import OrderListing from "./pages/orderListing";
import OrderDefinition from "./pages/OrderDefinition";
import InfoScreen from "./pages/InfoScreen";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, withRouter } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Header/>  */}

      <Switch>
        <Route exact path="/" render={(props) => <Login />} />
        <Route exact path="/register" render={(props) => <Register />} />

        <Route
          path="/order-listing"
          render={(props) => (
            <OrderListing
            //  {...props} products={this.state.products}
            />
          )}
        />
        <Route
          path="/order-definition"
          render={(props) => <OrderDefinition />}
        />
        <Route path="/info-screen">
          <InfoScreen />
        </Route>
        {/*
          <Route path="/detail" component={ProductDetail} />
          <SecuredRoute
            path="/admin"
            component={Dashboard}
            token={this.state.token}
          />
          <Route render={() => <div>NOT FOUND</div>} /> */}
      </Switch>
    </>
  );
}

export default withRouter(App);
