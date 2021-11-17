import React, { useContext } from 'react'
import axios from 'axios';
import { connect } from 'react-redux'
import { addToCart } from './actions/cartActions'
import { initState as state } from '../components/reducers/cartReducer';
import { UserContext } from "../UserContext"

const contains = (item, arr) => {
    if (arr === null) {
        return false;
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === item) {
            return true;
        }
    }
    return false;
}

const handleClick = async (props, item, user) => {
    props.addToCart(item.id);
    if (user === null) return;
    const resp = await axios.get('http://localhost:3001/items');
    var arr = resp.data;
    if (arr === null) {
        for (var i = 0; i < state.items.length; i++) {
            const existed = contains(state.items[i].title, arr);
            if (existed === false) {
                var formData = new FormData();
                var file = new File(["image"], "image.jpg", {
                    type: "text/plain",
                });
                formData.append("image", file);
                formData.append("id", user.id);
                formData.append("name", state.items[i].title);
                formData.append("desc", state.items[i].desc);
                formData.append("price", state.items[i].price);
                axios.post('http://localhost:3001/items/add', formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
                    }
                })
            }
        }
    }
    var items = null;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === item.title) {
            const productId = arr[i]._id;
            const userId = user.id;
            items = { productId,  userId};
        }
    }
    const response = await axios.post('http://localhost:3001/users/addItem', items);
    console.log(response);
}

function Home(props) {
    const { user } = useContext(UserContext);
    let itemList = props.items.map(item => {
        return (
            <div className="card" key={item.id}>
                <div className="card-image">
                    <img className="itemsImage" src={item.img} alt={item.title}/>
                    <span className="card-title title">{item.title}</span>
                    <span to="/" className="btn-floating halfway-fab waves-effect waves-light indigo darken-4" onClick={() => {
                        handleClick(props, item, user)}}><i className="large material-icons">shopping_cart</i></span>
                </div>

                <div className="card-content">
                    <p className="description">{item.desc}</p>
                    <p className="price"><b>Price: {item.price}$</b></p>
                </div>
            </div>
        );
    })

    return(
        <div className="container">
            <br/> <br/> <br/>
            <h3 className="center headline">116 Tech Shop</h3>
            <h6 className="center headline">Everything Tech-Related </h6>
            <hr/>
            <div className="box">
                {itemList}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
      items: state.items
    }
}
const mapDispatchToProps= (dispatch)=>{
    
    return{
        addToCart: (id)=>{dispatch(addToCart(id))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);