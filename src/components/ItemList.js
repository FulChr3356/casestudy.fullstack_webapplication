import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, ListGroup, ListGroupItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../viewlist.css';
import EditItem from  './EditItem';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {withRouter} from 'react-router-dom'
import AuthService from "./auth.service";
import authHeader from './auth-header';

class ItemList extends Component {
  
  
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super();
    const {cookies} = props;
    this.state = {items: [], currentUser: AuthService.currentUser ,isLoading: true};
    this.remove = this.remove.bind(this);

  }
  

  componentDidMount() {
    this.setState({isLoading: true});
    fetch('../api/item',{headers: authHeader()})
      .then(response => response.json())
      .then(data => this.setState({item: data, isLoading: false}))
  }

  async remove(id) {
    await fetch(`../api/item/${id}`, {
      method: 'DELETE',
      headers: {
        'X-XSRF-TOKEN': ' ',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(() => {
      let updatedItems = [...this.state.item].filter(i => i.id !== id);
      this.setState({item: updatedItems});
    });
  }

  render() {
    const {item, isLoading} = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div  >
      <div >
            <h2>Inventory</h2>
            <hr id="hr2" />
          </div>
      <Table className = "container  ">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {item.map(item =>
             <tr key={item.id}> 
               <td>{item.name}</td> 
               <td>{item.price}</td>  
               <td>{item.quantity}</td> 
               <td>
                 <ButtonGroup>
                 <Button className="float-right" size="sm" color="primary"   tag={Link} to={this.props.match.path+"/item/" + item.id}>Edit</Button>
                 <Button className="float-right" size="sm" color="danger" onClick={() => this.remove(item.id)}>Delete</Button>
                </ButtonGroup>
                </td>
              </tr>
            )}
      </tbody>
    </Table>
    <Button className="btn btn-primary" color = "primary" tag={Link} to={this.props.match.path+"/item/new"}>Add Item</Button>
    </div>
    );
  }
}

export default withCookies(withRouter(ItemList));