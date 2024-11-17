import "./CartItem.css"

function CartItem (props) {
    const {title, style} = props;
    return(
        <>
            <div className="card-item" style={style}>
                {title && (<h4>{title}</h4>)}
            </div>
        </>
    )
}

export default CartItem;