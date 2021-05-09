import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Button, Dropdown } from "react-bootstrap";
import { Confirm } from "react-st-modal";

export default class OrderListing extends React.Component {

  state = {
    orders: [],
    clients: [],
    clientId: 0,
    clientName: "Choose a Client",
    editId: 0,
    editForm: false,
    error: "",
    handleKey: -1,
  };

  async componentDidMount() {
    this.getOrders();
  }
  handleKeyLevel = (key) => {
    if (this.handleKey !== key) {
      this.setState({ handleKey: key });
    } else {
      this.setState({ handleKey: -1 });
    }
  };

  getOrders = async (id) => {
    const userId = window.localStorage.getItem("user_id");

    const url = `http://localhost:8000/api/orders-user/${userId}`;
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
    this.setState({ orders: result.data });
    console.log(this.state.orders);
  };

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

  
  deleteOrder = async (id) => {
    const token = window.localStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const url = `http://localhost:8000/api/order-user-delete/${id}`;

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      const refreshOrders = this.state.orders.filter(
        (orders) => orders.id !== id
      );
      this.setState({ orders: refreshOrders });
    } catch (error) {
      console.log(error);
    }
  };

  deleteItem = async (id) => {
    const token = window.localStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const url = `http://localhost:8000/api/order-product-delete/${id}`;

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      this.getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  updateOrder = async (id) => {
    //console.log(id)
    const token = window.localStorage.getItem("token");
    const editId = this.state.editId;
    //console.log(editId)
    const requestOptions = {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        client_id: id,
      }),
    };

    const url = `http://localhost:8000/api/order-user/${editId}`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    this.setState({ handleKey: -1 });
    this.getOrders();
    console.log(result);
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
              <Link className="col-2" to={{ pathname: "./order-definition" }}>
                {" "}
                <span> Order Definition</span>
              </Link>
              <Link className="col-9" to={{ pathname: "./info-screen" }}>
                {" "}
                <span> Information Page</span>
              </Link>

              <div  className="col-1 mt-2 float-right">
                <Button variant="danger" onClick={(e)=>{e.preventDefault();this.logout()}}> Logout</Button>
              </div>
            </div>

            <h3> Order Listing Page </h3>
            <div className="row mb-4">
              <Link
                to={{
                  pathname: "./order-definition",
                }}
              >
                <Button>Create New Order</Button>
              </Link>
            </div>

            <div className="row">
              <Table style={{ marginLeft: "10px" }} striped bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Total Price</th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.orders.map((order, key) => (
                    <tr key={key}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>
                        {order.client.name}
                        <Dropdown
                          id="dropdwn"
                          hidden={this.state.handleKey !== key}
                        >
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            {this.state.clientName}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {this.state.clients.map((client, key) => (
                              <Dropdown.Item
                                key={key}
                                onClick={() => {
                                  this.updateOrder(client.id);
                                }}
                              >
                                {client.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>

                      <td>{order.client.address}</td>
                      <td>{order.client.phone}</td>
                      <td>
                        {order.product.reduce(
                          (accumulator, current) => accumulator + current.price,
                          0
                        ) + "$"}
                      </td>
                      <td>
                        <Button
                          onClick={async () => {
                            const isConfirm = await Confirm(
                              <Table>
                                <thead>
                                  <tr>
                                    <th>Item ID</th>
                                    <th>Items</th>
                                    <th style={{ width: "25%" }}>Item Price</th>

                                    <th style={{ width: "25%" }}></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.product.map((pr, prkey) => (
                                    <tr>
                                      <td>{pr.pivot.id}</td>
                                      <td>{pr.name}</td>
                                      <td>{pr.price + "$"}</td>
                                      <td>
                                        <Button
                                          onClick={() => {
                                            this.deleteItem(pr.pivot.id);
                                          }}
                                          variant="danger"
                                          size="sm"
                                        >
                                          Remove
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            );
                            if (isConfirm) {
                            }
                          }}
                          style={{ marginRight: "10px" }}
                          size="sm"
                        >
                          More Info
                        </Button>

                        <Button
                          onClick={() => {
                            this.handleKeyLevel(key);
                            this.getClients();
                            this.setState({ editId: order.id });

                            // document.querySelector('#dropdwn').hidden=!(this.state.handleKey!==key);
                          }}
                          // onClick={()=>this.updateOrder(order.id)}

                          style={{ marginRight: "10px" }}
                          variant="warning"
                          size="sm"
                        >
                          Edit
                        </Button>

                        <Button
                          onClick={() => {
                            this.deleteOrder(order.id);
                          }}
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
