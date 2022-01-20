import Image from "next/image";
import { connect } from 'react-redux';
import ALink from '../features/custom-link';


function SidebarMenu({ categoryList }) {
    return (
        <ul className="menu vertical-menu category-menu">
            {
                categoryList?.length ? categoryList.map(category => {
                    return <li className={ category?.children?.length ? "submenu" : ''} key={category.url_key}>
                        <ALink className="category-lable-first" href={ { pathname: '/s', query: { category: category.url_key } } }>
                            {
                                category.icon ? <div className="mr-2">
                                    <Image className="cat-image-custom"
                                        src={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + category?.icon }
                                        alt="Picture of the author"
                                        width={24}
                                        height={25}
                                        quality={5}
                                    />
                                </div> : <i className={"d-icon-shoppingbag"}></i>
                            }
                            
                            {category?.label}
                        </ALink>

                        {
                            category?.children?.length ? <div className="megamenu">
                                <div className="row">
                                    {
                                        category.children.map(subCat => <div className="col-6 col-sm-4 col-md-3 col-lg-4" key={'children-'+subCat.url_key}>
                                            <h4 className="menu-title">
                                                <ALink href={ { pathname: '/s', query: { category: subCat.label } } }>
                                                    {subCat?.label}
                                                </ALink>
                                            </h4>
                                            {
                                                subCat?.children?.length ? <ul>
                                                    {
                                                        subCat?.children.map( ( item ) => (
                                                            <li key={ `shop-${'sub-child-' + item.url_key }` }>
                                                                <ALink href={ { pathname: '/s', query: { category: item.url_key } } }>
                                                                    { item?.label }
                                                                </ALink>
                                                            </li>
                                                        ) )
                                                    }
                                                </ul> : ''
                                            }
                                        </div>)
                                    }
                                    {/* <div className="col-6 col-sm-4 col-md-3 col-lg-4 menu-banner menu-banner1 banner banner-fixed">
                                        <figure>
                                            <img src="./images/menu/banner-1.jpg" alt="Menu banner" width="221" height="330" />
                                        </figure>
                                        <div className="banner-content y-50">
                                            <h4 className="banner-subtitle font-weight-bold text-primary ls-m">Sale.</h4>
                                            <h3 className="banner-title font-weight-bold"><span
                                                className="text-uppercase">Up to</span>70% Off</h3>
                                            <ALink href={ "/shop" } className="btn btn-link btn-underline">shop now<i className="d-icon-arrow-right"></i></ALink>
                                        </div>
                                    </div> */}
                                </div>
                            </div> : ''
                        }
                    </li>
                }) : ''
            }
        </ul>
    )
}

function mapStateToProps( state ) {
    return {
        categoryList: state.category.data
    }
}

export default connect( mapStateToProps, { } )( SidebarMenu );