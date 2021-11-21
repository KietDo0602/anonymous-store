import React, { useContext } from 'react'
import axios from 'axios';
import { connect } from 'react-redux'
import { addToCart } from './actions/cartActions'
import { initState as state } from '../components/reducers/cartReducer';
import { UserContext } from "../UserContext"

function Home(props) {
    const { user, setUser } = useContext(UserContext);
    const handleClick = async (props, item, user) => {
        props.addToCart(item.id);
        if (user === null) return;
        const resp = await axios.get('/items');
        var arr = resp.data;
        var items = null;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === item.title) {
                const productId = arr[i]._id;
                const userId = user._id;
                items = { productId,  userId};
                break;
            }
        }
        await axios.post('/users/addItem', items);
        let userUpdated = await axios.get(`/users/get/${user._id}`);
        setUser(userUpdated.data);
    }

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