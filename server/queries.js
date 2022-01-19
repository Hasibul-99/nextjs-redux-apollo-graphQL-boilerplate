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
