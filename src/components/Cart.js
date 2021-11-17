import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { removeItem,addQuantity,subtractQuantity} from './actions/cartActions';
import Recipe from './Recipe';
import {UserContext} from "../UserContext";
import image from "../images/noproduct.png"

function Cart(props) {
    const { user, setUser } = useContext(UserContext);
    let [itemsList, setItemsList] = useState([]);
    var addedItems = null;

    useEffect(() => {
        async function fetchMyAPI() {
            if (user === null) return;
            let response = await axios.get(`http://localhost:3001/users/get/${user.id}`, {
                params: {
                    id: user.id
                }
            });
            setItemsList(response.data.cart);
        }
        fetchMyAPI()
    }, [])


    // Adding a new item to the cart update
    const handleAddQuantity = async (props, item, user) => {
        if (user === null) {
            props.addQuantity(item.id);
            return;
        }
        const userId = user.id;
        const id = item._id;
        var index = null;
        // Update value onscreen
        for (var i = 0; i < itemsList.length; i++) {
            if (itemsList[i]._id === id) {
                index = i;
                break;
            }
        }
        let temp_state = [...itemsList];
        let temp_element = { ...temp_state[index] };
        temp_element.quantity = temp_element.quantity+1;
        temp_state[index] = temp_element;
        setItemsList( temp_state );
        setUser({total: user.total + item.price});
        // Fetch data to add to the backend
        const response = await axios.get(`http://localhost:3001/items`);
        const array = response.data;
        var productId = null;
        for (let i = 0; i < array.length; i++) {
            if (array[i]._id === id) {
                productId = array[i]._id;
                break;
            }
        }
        const addItem = {productId, userId}
        let res = await axios.post("http://localhost:3001/users/addItem", addItem);
        console.log(res);
    }



    // Handle remove a one quantity from an item
    const handleSubtractQuantity = async (props, item, user) => {
        if (user === null) {
            props.subtractQuantity(item.id);
            return;
        }
        const id = item._id;
        let index = null;
        // Update value onscreen
        for (let i = 0; i < itemsList.length; i++) {
            if (itemsList[i]._id === id) {
                index = i;
                break;
            }
        }
        let temp_state = [...itemsList];
        let temp_element = { ...temp_state[index] };
        temp_element.quantity = temp_element.quantity-1;
        temp_state[index] = temp_element;
        setItemsList( temp_state );
        setUser({total: user.total - item.price});

        const userId = user.id;
        const name = item.name;
        const response = await axios.get(`http://localhost:3001/items`);
        const array = response.data;
        var productId = null;
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === name) {
                productId = array[i]._id;
                break;
            }
        }
        const deleteItem = {userId, productId}
        const res = await axios.post("http://localhost:3001/users/removeItem", deleteItem);
        console.log(res);
    }
    // Handle removing the whole item from the cart, regardless of the quantity
    const handleRemove = async (props, item, user) => {
        if (user === null) {
            props.removeItem(item.id);
            return;
        }
        const id = item._id;
        let index = null;
        // Remove from the front end
        for (var i = 0; i < itemsList.length; i++) {
            if (itemsList[i]._id === id) {
                index = i;
                break;
            }
        }
        let temp_state = [...itemsList];
        let temp_element = { ...temp_state[index] };
        temp_element.quantity = 0;
        temp_state[index] = temp_element;
        setItemsList( temp_state );
        setUser({total: (user.total - item.price * item.quantity)});
        // Remove from the backend side
        const userId = user.id;
        const name = item.name;
        const response = await axios.get(`http://localhost:3001/items`);
        const array = response.data;
        var productId = null;
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === name) {
                productId = array[i]._id;
                break;
            }
        }
        const deleteItem = {userId, productId}
        const res = await axios.post("http://localhost:3001/users/removeAll", deleteItem);
        console.log(res);
    }

    if (user != null) {
            addedItems = itemsList.length ? ( itemsList.map(item => {
            return (
                item.quantity !== 0 ?
                <li className="collection-item avatar" key={item._id}>
                    <div className="item-img"> 
                        <img src={image} alt={image} className=""/>
                    </div>
                    <div className="item-desc">
                        <span className="title">{item.name}</span>
                        <p className="description">{item.desc}</p>
                        <p className="price"><b>Price: ${item.price}</b></p> 
                        <p>
                            <b> Quantity: { item.quantity } </b> 
                        </p>
                        <div className="add-remove">
                            <Link to="/cart"><i className="material-icons" onClick={()=>{handleAddQuantity(props, item, user)}}>arrow_drop_up</i></Link>
                            <Link to="/cart"><i className="material-icons" onClick={()=>{handleSubtractQuantity(props, item, user)}}>arrow_drop_down</i></Link>
                        </div>
                        <button className="waves-effect waves-light btn blue remove" onClick={()=>{handleRemove(props, item, user)}}>Remove</button>
                    </div>
                </li>
                : <></>
            )
            })) : ( <p>There is nothing inside your cart. Click <a href="/">here</a> to add some to it! </p> );
    } else {
            addedItems = props.items.length ? ( props.items.map(item => {
                return(
                    <li className="collection-item avatar" key={item.id}>
                        <div className="item-img"> 
                            <img src={item.img} alt={item.img} className=""/>
                        </div>
                    
                        <div className="item-desc">
                            <span className="title">{item.title}</span>
                            <p className="description">{item.desc}</p>
                            <p className="price"><b>Price: {item.price}$</b></p> 
                            <p>
                                <b>Quantity: {item.quantity}</b> 
                            </p>
                            <div className="add-remove">
                                <Link to="/cart"><i className="material-icons" onClick={()=>{handleAddQuantity(props, item, user)}}>arrow_drop_up</i></Link>
                                <Link to="/cart"><i className="material-icons" onClick={()=>{handleSubtractQuantity(props, item, user)}}>arrow_drop_down</i></Link>
                            </div>
                            <button className="waves-effect waves-light btn blue remove" onClick={()=>{handleRemove(props, item, user)}}>Remove</button>
                        </div>
                    </li> 
                )
                })
            ): ( <p>There is nothing inside your cart. Click <a href="/">here</a> to add some to it! </p> );
    }
    console.log(user);
    return(
        <div className="container">
            <div className="cart">
                <h5 className="description">You have ordered:</h5>
                <ul className="collection">
                    {addedItems}
                </ul>
            </div>
            { user !== null ?
                <div> <b> <h6> Total cost is: ${user.total} </h6> </b> </div>
            : <Recipe /> }
        </div>
    )
}

const mapStateToProps = (state)=>{
    return{
        items: state.addedItems,
        addedItems: state.addedItems
    }
}
const mapDispatchToProps = (dispatch)=>{
    return{
        removeItem: (id)=>{dispatch(removeItem(id))},
        addQuantity: (id)=>{dispatch(addQuantity(id))},
        subtractQuantity: (id)=>{dispatch(subtractQuantity(id))}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Cart)