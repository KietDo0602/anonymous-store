import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addToCart } from './actions/cartActions'

 class Home extends Component{
    
    handleClick = (id)=>{
        this.props.addToCart(id); 
    }

    render() {
        let itemList = this.props.items.map(item => {
            return(
                <div className="card" key={item.id}>
                        <div className="card-image">
                            <img className="itemsImage" src={item.img} alt={item.title}/>
                            <span className="card-title title">{item.title}</span>
                            <span to="/" className="btn-floating halfway-fab waves-effect waves-light indigo darken-4" onClick={()=>{this.handleClick(item.id)}}><i className="large material-icons">shopping_cart</i></span>
                        </div>

                        <div className="card-content">
                            <p className="description">{item.desc}</p>
                            <p className="price"><b>Price: {item.price}$</b></p>
                        </div>
                 </div>

            )
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