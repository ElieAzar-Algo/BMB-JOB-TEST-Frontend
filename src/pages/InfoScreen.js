import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Table } from "react-bootstrap";


export default class InfoScreen extends React.Component {

  state = {
    clients: [],
    updateinput: "",
    totalPrice: 0,
    error: "",
  };

  async componentDidMount() {
    this.getClients();
  }

  getClients = async () => {
    const url = `http://localhost:8000/api/client-order`;
    const token = window.localStorage.getItem("token");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const result = await response.json();
    this.setState({ clients: result.data });
    console.log(this.state.clients);
  };

  logout = async (e)=>{
    
    const url="http://localhost:8000/api/logout";
    const token=window.localStorage.getItem("token")
    const body={

    }
   const respond= await fetch(url,{
     method:"POST",
     headers:{
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },body:JSON.stringify(body)
   })
   console.log(respond);
   const result= await respond.json()
   console.log(result);
  await localStorage.clear()
  window.location.reload();
  
  }

  render() {
    const isToken = window.localStorage.getItem("token");

    if (!isToken) {
      return <Redirect to="./" />;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row mb-3">
              <Link className="col-2" to={{ pathname: "./order-listing" }}>
                {" "}
                <span> Order Listing</span>
              </Link>
              <Link className="col-9" to={{ pathname: "./order-definition" }}>
                {" "}
                <span> Order Definition</span>
              </Link>

              <div  className="col-1 mt-2 float-right">
                <Button variant="danger" onClick={(e)=>{e.preventDefault();this.logout()}}> Logout</Button>
              </div>
            </div>

            <h3> Clients didn't have orders yet </h3>
            <div className="row">
              <Table style={{ marginLeft: "10px" }} striped bordered hover>
                <thead>
                  <tr>
                    <th>Client ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Phone Number</th>

                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.clients.map((client, key) =>
                    client.order.length < 1 ? (
                      <tr key={key}>
                        <td>{client.id}</td>
                        <td>{client.name}</td>
                        <td>{client.address}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>
                          {/* 
        <Button style={{marginRight:"10px"}} variant="warning" size='sm'>
            Edit
        </Button>
        <Button onClick=''
            // ()=>{this.deleteOrder(order.id)}
            variant="danger" size='sm'>
            Delete
        </Button> */}
                        </td>
                      </tr>
                    ) : (
                      ""
                    )
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
