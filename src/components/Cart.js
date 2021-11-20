import React, { useContext} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { removeItem,addQuantity,subtractQuantity} from './actions/cartActions';
import Recipe from './Recipe';
import {UserContext} from "../UserContext";
import image from "../images/noproduct.png"

function Cart(props) {
    const { user, setUser } = useContext(UserContext);

    // Adding a new item to the cart update
    const handleAddQuantity = async (props, item, user) => {
        if (user === null) {
            props.addQuantity(item.id);
            return;
        }
        const userId = user._id;
        const productId = item._id;
        var items = {userId, productId};
        await axios.post('http://localhost:3001/users/addItem', items);
        let userUpdated = await axios.get(`http://localhost:3001/users/get/${userId}`);
        setUser(userUpdated.data);
    }


    // Handle remove a one quantity from an item
    const handleSubtractQuantity = async (props, item, user) => {
        if (user === null) {
            props.removeQuantity(item.id);
            return;
        }
        const userId = user._id;
        const productId = item._id;
        var items = {userId, productId};
        await axios.post('http://localhost:3001/users/removeItem', items);
        let userUpdated = await axios.get(`http://localhost:3001/users/get/${userId}`);
        setUser(userUpdated.data);
    }
    // // Handle removing the whole item from the cart, regardless of the quantity
    const handleRemove = async (props, item, user) => {
        if (user === null) {
            props.removeItem(item.id);
            return;
        }
        const userId = user._id;
        const productId = item._id;
        var items = {userId, productId};
        await axios.post('http://localhost:3001/users/removeAll', items);
        let userUpdated = await axios.get(`http://localhost:3001/users/get/${userId}`);
        setUser(userUpdated.data);
    }

    var addedItems = null;
    if (user != null) {
            addedItems = user.cart.length ? ( user.cart.map(item => {
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
                        <button className="waves-effect waves-light btn blue remove" onClick={()=>{handleRemove(props, item, user)}}>Remove All</button>
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
                            <p className="price"><b>Price: ${item.price}</b></p> 
                            <p>
                                <b>Quantity: {item.quantity}</b> 
                            </p>
                            <div className="add-remove">
                                <Link to="/cart"><i className="material-icons" onClick={()=>{handleAddQuantity(props, item, user)}}>arrow_drop_up</i></Link>
                                <Link to="/cart"><i className="material-icons" onClick={()=>{handleSubtractQuantity(props, item, user)}}>arrow_drop_down</i></Link>
                            </div>
                            <button className="waves-effect waves-light btn blue remove" onClick={()=>{handleRemove(props, item, user)}}>Remove All</button>
                        </div>
                    </li> 
                )
                })
            ): ( <p>There is nothing inside your cart. Click <a href="/">here</a> to add some to it! </p> );
    }
    return(
        <div className="container">
            <div className="cart">
                <h5 className="description">You have ordered:</h5>
                <ul className="collection">
                    {addedItems}
                </ul>
            </div>
            { user !== null ?
                <div className="container">
                    <div className="collection">
                        <li className="collection-item"><b>Total: ${user.total} </b></li>
                    </div>
                    <div className="checkout">
                        <button className="waves-effect waves-light blue btn">Checkout</button>
                    </div>
                </div>
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