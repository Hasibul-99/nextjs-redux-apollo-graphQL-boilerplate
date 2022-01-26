import { gql } from "@apollo/client";

export const GET_CATEGORY_LIST = gql`
    query Query($categoryDetailLanguageId: Int, $first: Int) {
        categories(first: $first) {
            data {
                id
                url_key
                parent_id
                icon
                categoryDetail(language_id: $categoryDetailLanguageId) {
                    id
                    name
                    language_id
                }
            
            }
        }
    }
`

export const CATEGORIES_TREE = gql`
    query GetCategoryTree {
        getCategoryTree {
            tree
        }
    }
`

export const SEARCH_SUGGESTION = gql`
    mutation Suggestion($searchQuery: String) {
        suggestion(search_query: $searchQuery) {
            category
            product
            suggestion
        }
    }
`

export const ADD_TO_CART = gql`
mutation AddToCart($cartItems: String!, $languageId: Int) {
    addToCart(cartItems: $cartItems) {
        shippingCharge
        cartItems {
            qty
            variation_id
            productVariation {
                productVariationImage {
                    image_path
                    id
                }
                variationAttribute {
                    attribute_value
                    attributeDetails {
                        code
                    }
                }
                product_id
                id
                var_sku
                price
                special_price
                special_price_end
                special_price_start
                qty
                campaignPrice {
                    discount_price
                    campaign {
                      start_date
                      end_date
                    }
                }
                productDetails {
                productDetail(language_id: $languageId) {
                    name
                }
                ratingAverage
                url_key
                productVariation {
                    id
                    productVariationImage {
                    image_path
                    }
                    qty
                    special_price
                    special_price_end
                    special_price_start
                    price
                    campaignPrice {
                        discount_price
                        campaign {
                          start_date
                          end_date
                        }
                    }
                }
            }
          }
        }
    }
}
`


export const UPADTE_CART_ITEMS = gql`
mutation RemoveCartItem($cartItems: String!, $languageId: Int) {
    removeCartItem(cartItems: $cartItems) {
        shippingCharge
        cartItems {
            qty
            variation_id
            productVariation {
                variationAttribute {
                    attribute_value
                    attributeDetails {
                        code
                    }
                }
                productVariationImage {
                    image_path
                    id
                }
                product_id
                id
                var_sku
                price
                special_price
                special_price_end
                special_price_start
                qty
                campaignPrice {
                    discount_price
                    campaign {
                      start_date
                      end_date
                    }
                }
                productDetails {
                productDetail(language_id: $languageId) {
                    name
                }
                ratingAverage
                url_key
                productVariation {
                    id
                    productVariationImage {
                    image_path
                    }
                    qty
                    special_price
                    special_price_end
                    special_price_start
                    price
                    campaignPrice {
                        discount_price
                        campaign {
                          start_date
                          end_date
                        }
                    }
                }
            }
            }
        }
    }
}`

export const UNREAD_NOTIFICATION_COUNT = gql`
    query Notification {
        customerNotifications {
        unreadNotificationCount
        }
    }
`

export const MARK_ALL_NOTIFICETION_READ = gql`
    mutation MarkAllNotificationRead {
        markAllNotificationRead {
        message
        status
        }
    }
`

export const MARK_NOTIFICATION_READ = gql`
    mutation MarkNotificationRead($markNotificationReadId: ID) {
        markNotificationRead(id: $markNotificationReadId) {
        message
        status
        }
    }
`

export const DELETE_ALL_NOTIFICATION = gql`
    mutation DeleteAllNotification {
        deleteAllNotification {
        message
        status
        }
    }
`

export const CMS_CONTENT_QUERY = `
query Query($slug: ID, $languageId: Int) {
    cmsDetails(slug: $slug) {
        id
        cmsDetails(language_id: $languageId) {
            content
        }
    }
}`

export const CMS_CONTENT = gql`
    ${CMS_CONTENT_QUERY}
`

export const GET_HOME_DATA_QUERY = `
query Query($sliderPosition: String!, $languageId: Int, $first: Int! ) {
    webStorefrontHomeContent(slider_position: $sliderPosition) {
    best_selling_products {
        id
        ratingAverage
        reviews(first: $first) {
            paginatorInfo {
              count
              total
            }
        }
        productDetail(language_id: $languageId) {
            name
        }
        productVariation {
            id
            qty
            price
            special_price
            special_price_end
            special_price_start
            productVariationImage {
                image_path
            }
            campaignPrice {
                discount_price
                campaign {
                  start_date
                  end_date
                }
            }
        }
        url_key
    }
    featured_products {
        id
        ratingAverage
        reviews(first: $first) {
            paginatorInfo {
              count
              total
            }
        }
        productDetail(language_id: $languageId) {
            name
        }
        productVariation {
            id
            qty
            price
            special_price
            special_price_end
            special_price_start
            productVariationImage {
                image_path
            }
            campaignPrice {
                discount_price
                campaign {
                  start_date
                  end_date
                }
            }
        }
        url_key
    }
    new_arrival_products {
        id
        ratingAverage
        reviews(first: $first) {
            paginatorInfo {
              count
              total
            }
        }
        productDetail(language_id: $languageId) {
            name
        }
        productVariation {
            id
            qty
            price
            special_price
            special_price_end
            special_price_start
            productVariationImage {
                image_path
            }
            campaignPrice {
                discount_price
                campaign {
                  start_date
                  end_date
                }
            }
        }
        url_key
    }
    slider {
        Banner {
        link
        }
    }
    campaign {
        title
        banner
        thumbnail
        id
    }
    }
}
`
export const GET_HOME_DATA = gql`${GET_HOME_DATA_QUERY}`

export const ADD_WISHLIST_MUTATION = gql`
    mutation CreateWishlistMutation($variationId: Int!, $languageId: Int) {
        createWishlist(variation_id: $variationId) {
            id
            wishlistItems {
                qty
                updated_at
                variation_id
                id
                productVariation {
                id
                product_id
                seller_sku
                special_price
                special_price_end
                special_price_start
                price
                qty
                campaignPrice {
                    discount_price
                }
                productVariationImage {
                    image_path
                    variation_id
                }
                productDetails {
                    url_key
                    productDetail(language_id: $languageId) {
                        name
                        }
                    }
                }
            }
        }
    }
`

export const ALL_CMS_CONTENTS = gql`
    query Data {
        cmsPages {
            data {
                slug
                type
            }
        }
    }
`

export const GET_PRODUCT_INFO_QUERY = `
query Query($urlKey: ID, $languageId: Int, $first: Int!) {
    product(url_key: $urlKey) {
      id
      prod_sku
      video_url
      url_key
      ratingAverage
      shippingCharge(url_key: $urlKey) {
        inside_dhaka
        outside_dhaka_sadar
        outside_dhaka_thana
      }
      categoryDetails {
            id
            categoryDetailInformation {
                url_key
                categoryDetail( language_id: $languageId ) {
                    name
                }
            }
      }
      productVariation {
        id
        price
        productVariationImage {
          image_path
          variation_id
        }
        product_id
        qty
        seller_sku
        variationAttribute {
          attributeDetails {
            attributeLabel(language_id: $languageId) {
              label
            }
            code
            created_at
            id
            type
          }
          attribute_value
          id
          variation_id
        }
        special_price
        special_price_end
        special_price_start
        var_sku
        campaignPrice {
            discount_price
            campaign {
                start_date
                end_date
            }
        }
      }
      productDetail(language_id: $languageId) {
        long_description
        name
        short_description
      }
      sellerDetails {
        shop_name
        id
      }
      relatedProduct(url_key: $urlKey) {
        url_key
        ratingAverage
        productDetail(language_id: $languageId) {
        name
        }
        productVariation {
            id
            price
            special_price
            special_price_end
            special_price_start
            productVariationImage {
                image_path
            }
        }
        reviews(first: $first) {
            paginatorInfo {
                count
                total
            }
            data {
                rating
            }
        }
      }
      attributeValues {
        attributeDetails {
          attributeLabel(language_id: $languageId) {
            label
          }
        }
        value
      }
      reviews(first: $first) {
        paginatorInfo {
            count
            total
        }
        data {
            customerDetails {
                name
            }
            id
            rating
            created_at
            customer_comment
            reviewImages {
                file_path
                review_id
                id
            }
        }
      }
    }
}
`

export const CAMPAIGNS_LIST = gql`
query Data($first: Int, $campaignProductsFirst2: Int!, $languageId: Int, $slug: String!) {
    campaigns(first: $first) {
      data {
        banner
        id
        title
        end_date
        start_date
        campaignProducts(first: $campaignProductsFirst2) {
          data {
            campaign_id
            productVariation {
                id
                var_sku
                price
                special_price
                special_price_end
                special_price_start
                productDetails {
                  productDetail(language_id: $languageId) {
                    name
                  }
                  ratingAverage
                  url_key
                  productVariation {
                    id
                    productVariationImage {
                      image_path
                    }
                    qty
                    special_price
                    special_price_end
                    special_price_start
                    price
                    campaignPrice {
                        discount_price
                        campaign {
                          start_date
                          end_date
                        }
                    }
                  }
                }
            }
            discount_price
          }
        }
      }
    }

    slider(slug: $slug) {
        Banner {
          link
        }
    }
}
`

export const GET_PRODUCT_INFO = gql`${GET_PRODUCT_INFO_QUERY}`


export const GET_CATEGORY_PRODUCT_INFO = gql`
    query Query($first: Int!, $page: Int, $languageId: Int, $campaignId: ID) {
        campaign(id: $campaignId) {
        id
        campaignProducts(first: $first, page: $page) {
            paginatorInfo {
            total
            perPage
            lastPage
            }
            data {
                productVariation {
                    id
                    var_sku
                    price
                    special_price
                    special_price_end
                    special_price_start
                    productDetails {
                      productDetail(language_id: $languageId) {
                        name
                      }
                      ratingAverage
                      url_key
                      productVariation {
                        id
                        productVariationImage {
                          image_path
                        }
                        qty
                        special_price
                        special_price_end
                        special_price_start
                        price
                        campaignPrice {
                            discount_price
                            campaign {
                              start_date
                              end_date
                            }
                        }
                      }
                    }
                }
            }
        }
        title
        banner
        }
    }
`
