import React from "react";
import { Redirect,Link } from "react-router-dom";
import "./LoginStyle.css";

class Register extends React.Component {
  state = {
    autho: 0,
    err: "",
  };

  register= async (e) => {
    e.preventDefault();

    const url = "http://localhost:8000/api/register";
    const body = {
      name: e.target.name.value,
      email: e.target.adminEmail.value,
      password: e.target.adminPassword.value,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch(function (error) {
      console.log(error);
    });
    console.log(response);
    const res = await response.json();
    console.log(res);
    const result = await response.status;

    if (result === 200) {
      var accessToken = res.access_token;
      var userName = res.user.name;
      var userId = res.user.id;
      window.localStorage.setItem("token", accessToken);
      window.localStorage.setItem("user_name", userName);
      window.localStorage.setItem("user_id", userId);
      alert("Login Successfully");
      this.setState({ autho: result });
      console.log(res);
    } else {
      alert("Login Failed");
    }
  };

  render() {
    if (this.state.autho === 200) {
      return <Redirect to="./order-listing" />;
    }

    return (
      <>
        <div className=" loginRoot">
          <div className="container ">
            <div className="row ">
              <div className="col-sm-9 col-md-7 col-lg-5 mx-auto ">
                <div className="card card-signin my-5 ">
                  <div className="card-body">
                    <h5 className="card-title text-center">Sign In</h5>
                    <form
                      className="form-signin"
                      onSubmit={this.register}
                      method="post"
                    >

                     <div className="form-label-group">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          placeholder=" Name"
                        
                          required
                          autoFocus
                        />
                        <label htmlFor="inputEmail">Name</label>
                      </div>
                      <div className="form-label-group">
                        <input
                          type="email"
                          name="adminEmail"
                          id="inputEmail"
                          className="form-control"
                          placeholder="Email address"
                          autoComplete="adminEmail"
                          required
                          
                        />
                        <label htmlFor="inputEmail">Email address</label>
                      </div>

                      <div className="form-label-group">
                        <input
                          type="password"
                          name="adminPassword"
                          id="inputPassword"
                          className="form-control"
                          placeholder="Password"
                          required
                          autoComplete="current-password"
                        />
                        <label htmlFor="inputPassword">Password</label>
                      </div>

                      <div className="row custom-control custom-checkbox mb-3">
                        <button
                          className="btn btn-lg btn-primary btn-block text-uppercase"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                      <Link style={{marginLeft:"40%"}} to={{
                   pathname:"./"
               }}><span>Login</span></Link>
                      <hr className="my-4" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Register;
