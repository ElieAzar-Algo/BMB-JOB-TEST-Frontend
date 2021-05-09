import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, CardGroup, Card, Dropdown } from "react-bootstrap";
// import { Confirm } from "react-st-modal";
import Image1 from "../assets/VR-product1.jpeg";

export default class OrderDefinition extends React.Component {
  
  state = {
    allProducts: [],
    clients: [],
    newOrder: "",
    clientId: 0,
    clientName: "Choose a Client",
    newOrderId: 0,
    productId: 0,
    date: "",
    totalPrice: 0,
    error: "",
  };

  async componentDidMount() {
    this.getAllProducts();
    this.getClients();
  }

  getAllProducts = async () => {

    const url = `http://localhost:8000/api/products`;
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
    this.setState({ allProducts: result.data });
    console.log(this.state.allProducts);
  };

  getClients = async () => {
    
    const url = `http://localhost:8000/api/clients`;
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
    //  console.log(this.state.clients);
  };

  getNewOrder = async () => {
    const orderId = this.state.newOrderId;
    const url = `http://localhost:8000/api/order/${orderId}`;
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
    this.setState({ newOrder: result.data });
    console.log(this.state.newOrder);
  };

  handleInputChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value)
    this.setState({ date: e.target.value });
  };

  createOrder = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("user_id");
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        user_id: userId,
        client_id: this.state.clientId,
        date: this.state.date,
      }),
    };
    const url = `http://localhost:8000/api/order-user`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    //console.log(result);
    this.setState({ newOrderId: result.data.id });
    this.getNewOrder();
  };

  addProduct = async (id) => {
    // console.log(id)
    // console.log(this.state.newOrderId)
    const token = window.localStorage.getItem("token");

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        order_id: this.state.newOrderId,
        product_id: id,
      }),
    };
    const url = `http://localhost:8000/api/order-product`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    console.log(result);
    // this.state.newOrder.product.push(result.data)
    this.getNewOrder();
    //this.setState({newOrderId:result.data.id})
    console.log(this.state.newOrder);
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
              <Link className="col-9" to={{ pathname: "./info-screen" }}>
                {" "}
                <span> Information Page</span>
              </Link>

              <div  className="col-1 mt-2 float-right">
                <Button variant="danger" onClick={(e)=>{e.preventDefault();this.logout()}}> Logout</Button>
              </div>
            </div>
            <h3> Order Definition </h3>
            <p style={{ color: "red" }}>
              To create a new order please choose a client first then pick a
              date then start the Order by adding products
            </p>
            <div className="row mb-4"></div>

            <div className="row mb-5">
              <CardGroup>
                {this.state.allProducts.map((product, key) => (
                  <Card className="product" key={key}>
                    <Card.Img variant="top" src={`${Image1}`} />
                    <Card.Body>
                      <Card.Title>
                        {product.name + " " + product.price + "$"}
                      </Card.Title>
                      <Card.Text>
                        Stock: {product.available_quantity}
                        <br></br>
                        This is a wider card
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        <Button
                          disabled={!this.state.newOrderId}
                          onClick={(e) => {
                            e.preventDefault();
                            this.addProduct(product.id);
                          }}
                        >
                          Add Item
                        </Button>
                      </small>
                    </Card.Footer>
                  </Card>
                ))}
              </CardGroup>
            </div>

            <div className="row mt-5">
              <div className="col-2">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {this.state.clientName}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {this.state.clients.map((client, key) => (
                      <Dropdown.Item
                        key={key}
                        onClick={() => {
                          this.setState({ clientId: client.id });
                          this.setState({ clientName: client.name });
                        }}
                      >
                        {client.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-2">
                <input
                  onChange={this.handleInputChange}
                  name="date"
                  id="date"
                  type="date"
                />
              </div>

              <div className="col-2">
                <Button
                  disabled={!this.state.clientId}
                  onClick={this.createOrder}
                >
                  Start New Order
                </Button>
              </div>

              <div className="col-4">
                <h4 hidden={!this.state.newOrderId}> NOW ADD PRODUCTS</h4>

                {this.state.newOrder
                  ? this.state.newOrder.product.map((np, key) => (
                      <h5 key={key}>
                        {key + 1 + " " + np.name + " " + np.price + "$ "}{" "}
                      </h5>
                    ))
                  : ""}
              </div>
              <div className="col-2" hidden={!this.state.newOrderId}>
                <Link to={{ pathname: "./order-listing" }}>
                  {" "}
                  <Button> Finish</Button>
                </Link>
              </div>
              {/* <div className="col-2"> </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
