import ALink from '../features/custom-link';
import { toDecimal, productImage, canShowSpecialPrice } from '../../utils';

export default function CartPopup ( props ) {
    const { product, quality, varientId } = props;

    const showVarientPrice = () => {
        if (!varientId) {
            return canShowSpecialPrice(product?.productVariation[0]) || product?.productVariation[ 0 ]?.price;
        } else {
            let productVariation = product?.productVariation || [];

            let find = productVariation.find(vari => vari.id == varientId);

            if (find) {
                return canShowSpecialPrice(find) || find?.price;
            } else return 0;
        }
    }

    return (
        <div className="minipopup-area">
            <div className="minipopup-box show" style={ { top: "0" } }>
                <p className="minipopup-title">Successfully {quality > 0 ? 'added' : 'removed'}.</p>

                <div className="product product-purchased  product-cart mb-0">
                    <figure className="product-media pure-media">
                        <ALink href={ `/product/${ product.url_key }` }>
                            <img
                                src={ productImage(product, varientId) }
                                alt="product"
                                style={{width:"90px", height:"90px"}}
                            />
                        </ALink>
                    </figure>
                    <div className="product-detail">
                        <ALink href={ `/product/${ product.url_key }` } className="product-name">{ product?.productDetail[0]?.name }</ALink>
                        <span className="price-box">
                            <span className="product-quantity">{ Math.abs(quality) }</span>
                            <span className="product-price">৳{ 
                                toDecimal( showVarientPrice()) }
                            </span>
                        </span>
                    </div>
                </div>

                <div className="action-group d-flex">
                    <ALink href="/p/cart/" className="btn btn-sm btn-secondary btn-outline btn-rounded">View Cart</ALink>
                    <ALink href="/p/checkout" className="btn btn-sm btn-secondary btn-rounded">Check Out</ALink>
                </div>
            </div>
        </div>
    )
}