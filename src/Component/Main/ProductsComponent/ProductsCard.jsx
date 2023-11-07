import React from 'react';

const ProductsCard = ({ product }) => {
    const { name, sale_price, regular_price, img } = product;
    return (
        <div className="flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="flex justify-center">
                    <img style={{ height: '300px', width: '350px' }} className="px-8" src={img} alt="Beanie" />
                </div>
                <div className="card-body">
                    <h2 className="card-title">{name}</h2>
                    <div className="flex justify-end my-2">
                        <p>Regular Price: <strike>{regular_price}</strike> </p>
                        <p className="text-end brand-color">Offer Price: {sale_price} </p>
                    </div>
                    <div className="flex justify-end mt-2">
                        <button className="btn brand-btn">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsCard;