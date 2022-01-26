import { gql } from "@apollo/client";

export const SENT_OTP = gql`
    mutation SendOTPMutation($mobile: String!) {
        sendOTP(mobile: $mobile)
    }
`
export const CHECK_OTP = gql`
    mutation CheckOtpMutation($mobile: String!, $otp: String!) {
        checkOtp(mobile: $mobile, otp: $otp)
    }
`

export const LOGOUT = gql`
    mutation Logout {
        logout {
            message
        }
    }
`


export const GET_LOGIN_USER_INFO = gql`
query GetUserFromToken {
    getUserFromToken {
        email
        id
        mobile
        status
        customer {
            id
            name
            gender
            dob
            shippingAddressDetails {
                id
                customer_id
                name
                mobile
                address
                area
                city
                division
            }
            billingAddressDetails {
                customer_id
                name
                mobile
                address
                id
                area
                city
                division
            }
        }
    }
}`

export const UPDATE_USER_INFO = gql`
    mutation UpdateCustomerMutation($name: String, $gender: String, $dob: Date, $email: String) {
        updateCustomer(name: $name, gender: $gender, dob: $dob, email: $email) {
        user {
            customer {
                dob
                gender
                name
                shippingAddressDetails {
                    id
                    customer_id
                    name
                    mobile
                    address
                    area
                    city
                    division
                }
                billingAddressDetails {
                    customer_id
                    name
                    mobile
                    address
                    id
                    area
                    city
                    division
                }
            }
            email
            mobile
            name
        }
        message
        }
    }
`

export const CHANGE_PASSWORD = gql`
    mutation UpdateCustomer($confirmPassword: String, $currentPassword: String, $password: String) {
        updateCustomer(confirm_password: $confirmPassword, current_password: $currentPassword, password: $password) {
            message
            user {
                id
            }
        }
    }
`

export const USER_ADDRESS = gql`
    query Address {
        address {
            id
            address
            area
            city
            email
            mobile
            name
            thana
            union
        }
    }
`

export const UPADTE_DEFAULT_ADDRESS = gql`
mutation SetDefaultAddress($addressType: String, $addressId: Int) {
    setDefaultAddress(address_type: $addressType, address_id: $addressId) {
      message
    }
}`


export const GET_ADDRESS_INFO = gql`
    query Single_address($singleAddressId: Int) {
        single_address(id: $singleAddressId) {
            area
            address
            city
            email
            id
            mobile
            name
            thana
            union
        }
    }
`


export const UPDATE_ADDRESS_INFO = gql`
mutation UpdateAddress($address: String, $addressId: Int, $area: String, $union: String, $thana: String, $email: String, $mobile: String, $name: String, $city: String) {
    updateAddress(address: $address, address_id: $addressId, area: $area, union: $union, thana: $thana, email: $email, mobile: $mobile, name: $name, city: $city) {
      address {
        id
        email
        name
      }
      message
    }
}`

export const GET_USER_ORDERS = gql`
    query Query($first: Int, $page: Int, $orderId: Int) {
        getCustomerOrder(first: $first, page: $page, order_id: $orderId) {
            data {
                orderItem {
                    id
                    product_name
                    unit_price
                    productVariation {
                      productVariationImage {
                        image_path
                      }
                    }
                }
                order_total
                created_at
                payment_method
                payment_status
                id
            }
            paginatorInfo {
                total
                perPage
                lastPage
                count
            }
        }
    }
`

export const ORDER_DETAILS_QUERY = `
query OrderDetails($orderDetailsId: Int) {
    orderDetails(id: $orderDetailsId) {
        id
        order_status
        payment_status
        billing_address
        shipping_address
        shipping_fee
        created_at
        order_total
        discount_amount
        payment_method
        orderItem {
            id
            product_name
            productVariation {
                productVariationImage {
                    image_path
                }
                productDetails {
                    sellerDetails {
                       shop_name
                    }
                }
                variationAttribute {
                    attribute_value
                    attributeDetails {
                        code
                    }
                }
            }
            packageDetails {
                id
                status
                updated_at
                packageStatusHistory {
                    id
                    message
                    status
                    updated_at
                }
                hasRefundRequest {
                    id
                }
                hasReturnRequest {
                    id
                }
            }
            quantity
            unit_price
            discount
            attributes
        }
    }
}
`

export const ORDER_DETAILS = gql`
    ${ORDER_DETAILS_QUERY}
`


export const ORDER_CANCEL_REASONS = gql`
query CancelReason {
    cancelReason {
        reason
    }
}`

export const RETURN_REASONS = gql`
query ReturnReason {
    returnReason {
        id
        reason
    }
}`

export const CREATE_RETURN_REQUEST = gql`
mutation CreateReturnRequest($packageId: Int!, $additionalInfo: String, $returnImages: String, $returnReason: String) {
    createReturnRequest(package_id: $packageId, additional_info: $additionalInfo, returnImages: $returnImages, return_reason: $returnReason) {
      id
    }
}`

export const CREATE_REFUND_REQUEST = gql`
mutation CreateRefundRequest($packageId: Int!, $accountName: String, $accountNumber: String, $bankName: String, $branchName: String, $comment: String, $medium: String, $mfsNumber: String) {
    createRefundRequest(package_id: $packageId, account_name: $accountName, account_number: $accountNumber, bank_name: $bankName, branch_name: $branchName, comment: $comment, medium: $medium, mfs_number: $mfsNumber) {
      id
    }
}`

export const SELLER_INFO_WITH_PRODUCTS = gql`
query SellerProductSerach($sellerId: ID, $first: Int, $page: Int, $languageId: Int, $urlKey: String) {
    sellerProductSerach(first: $first, sell_ID: $sellerId, page: $page, url_key: $urlKey) {
      paginatorInfo {
        total
        perPage
        lastPage
      }
      data {
        id
        prod_sku
        url_key
        ratingAverage
        productDetail(language_id: $languageId) {
          name
          id
        }
        productVariation {
            campaignPrice {
                discount_price
                campaign {
                    start_date
                    end_date
                }
            }
          special_price
          special_price_end
          special_price_start
          qty
          product_id
          price
          id
          attributes
          productVariationImage {
            id
            image_path
          }
        }
      }
    }

    sellerDetails(id: $sellerId) {
        shop_name
        sellerCategories {
            categoryInformation {
                parent_id
                image
                url_key
                id
                icon
                categoryDetail(language_id: $languageId) {
                    name
                }
            }
        }
        averageRatingCount(id: $sellerId) {
            ratingAverage
        }
        banner_url
    }
}`


export const GET_USER_WISHLISTS = gql`
query Wishlist($languageId: Int) {
    wishlist {
        wishlistItems {
          id
          qty
          updated_at
          variation_id
          wishlist_id
          productVariation {
            id
            product_id
            seller_sku
            special_price
            special_price_end
            special_price_start
            qty
            price
            campaignPrice {
                discount_price
                campaign {
                  start_date
                  end_date
                }
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
}`


export const DELETE_WISHLIST = gql`
    mutation DeleteWishList($variationId: Int!) {
        deleteWishList(variation_id: $variationId)
    }
`

export const CREATE_ORDER = gql`
    mutation CreateOrder($orderItem: String!, $billingEmail: String, $couponCode: String, $billingName: String, $billingPhone: String, $newBillingAddress: String, $newBillingArea: String, $newBillingCity: String, $newAddress: String, $newArea: String, $newCity: String, $paymentMethod: String, $shippingEmail: String, $shippingPhone: String, $shippingName: String, $shippingMethod: String, $shippingFee: Float, $shippingAddress: Int, $billingAddress: Int, $orderNotes: String, $newThana: String, $newUnion: String, $newBillingThana: String, $newBillingUnion: String, $paymentStatus: String) {
        createOrder(order_item: $orderItem, billing_email: $billingEmail, coupon_code: $couponCode, billing_name: $billingName, billing_phone: $billingPhone, new_billing_address: $newBillingAddress, new_billing_area: $newBillingArea, new_billing_city: $newBillingCity, new_address: $newAddress, new_area: $newArea, new_city: $newCity, payment_method: $paymentMethod, shipping_email: $shippingEmail, shipping_phone: $shippingPhone, shipping_name: $shippingName, shipping_method: $shippingMethod, shipping_fee: $shippingFee, shipping_address: $shippingAddress, billing_address: $billingAddress, order_notes: $orderNotes, new_thana: $newThana, new_union: $newUnion, new_billing_thana: $newBillingThana, new_billing_union: $newBillingUnion, payment_status: $paymentStatus) {
            id
            customer_id
        }
    }
`


export const COUNT_REVIEWS_VALUE = gql`
    query PaginatorInfo {
        customerReviews {
            paginatorInfo {
            total
            }
        }
        packageToBeReviews {
            paginatorInfo {
            total
            }
        }
    }
`

export const PACKAGE_TO_BE_REVIEWS  = gql`
query Data($first: Int, $page: Int, $languageId: Int) {
    packageToBeReviews(first: $first, page: $page) {
      data {
        product_name
        order_id
        productVariation {
            product_id
            productVariationImage {
                image_path
            }
            productDetails {
                sellerDetails {
                    shop_name
                }
                url_key
                productDetail(language_id: $languageId) {
                    name
                }
            }
        }
        packageDetails {
          updated_at
          order_item_id
        }
      }
      paginatorInfo {
        total
        perPage
        lastPage
      }
    }
}`

export const REVIEW_ORDERED_PRODUCT = gql`
mutation CreateReviews($productId: Int!, $customerComment: String, $orderId: Int, $orderItemId: Int, $rating: Int, $reviewImages: String) {
    createReviews(product_id: $productId, customer_comment: $customerComment, order_id: $orderId, order_item_id: $orderItemId, rating: $rating, reviewImages: $reviewImages) {
      id
    }
}`



export const FORGET_PASSWORD = gql`
    mutation ForgetPassword($mobile: String!, $password: String!) {
        forgetPassword(mobile: $mobile, password: $password) {
            message
            user {
                id
            }
        }
    }
`

export const GET_CUSTOMER_CART = gql`
query GetCustomercartItems {
    getCustomercartItems {
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
                productDetail {
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

export const SEND_OTP_FORGET_PASS = gql`
    mutation SendOTPForgetPass($mobile: String!) {
        sendOTPForgetPass(mobile: $mobile)
}`

export const USER_ALL_INFO = gql`
    query Query( $first: Int, $languageId: Int, $NotiFirst: Int, $NotiPage: Int ) {
    getUserFromToken {
        email
        id
        mobile
        status
        customer {
            id
            name
            gender
            dob
            shippingAddressDetails {
                id
                email
                customer_id
                name
                mobile
                address
                area
                city
                division
                thana
                union
            }
            billingAddressDetails {
                customer_id
                email
                thana
                union
                name
                mobile
                address
                id
                area
                city
                division
            }
        }
    }
    getCustomerOrder(first: $first) {
        data {
            id
            created_at
            orderItem {
            productVariation {
                id
                productVariationImage {
                    image_path
                }
            }
            product_name
            unit_price
            }
            payment_method
            payment_status
        }
    }
    customerNotifications {
        notification(first: $NotiFirst, page: $NotiPage) {
            data {
              message
              redirect_url
              updated_at
              read_at
              id
            }
        }
    }
    
    wishlist {
        wishlistItems {
          id
          qty
          updated_at
          variation_id
          wishlist_id
          productVariation {
            id
            product_id
            seller_sku
            special_price
            special_price_end
            special_price_start
            qty
            price
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
}`


export const REGISTER_CUSTOMER = gql`
    mutation RegisterCustomerMutation($password: String!, $name: String, $mobile: String, $email: String) {
        registerCustomer(password: $password, name: $name, mobile: $mobile, email: $email) {
            userData {
                email
                id
                mobile
                name
            }
            access_token
        }
    }
`


export const LOGIN_CUSTOMER = gql`
    mutation LoginMutation($password: String!, $mobile: String) {
        login(password: $password, mobile: $mobile) {
            access_token
            userData {
                name
            }
        }
    }
`


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
export const PRODUCT_IDS_SKUS = gql`
    query ProductsIdsSkus {
        productsIdsSkus {
            id
            prod_sku
        }
    }
`

export const CREATE_ADDRESS = gql`
mutation CreateAddress($area: String!, $city: String!, $thana: String!, $union: String!, $address: String, $email: String, $mobile: String, $name: String, $billing: Int, $shipping: Int) {
    createAddress(area: $area, city: $city, thana: $thana, union: $union, address: $address, email: $email, mobile: $mobile, name: $name, billing: $billing, shipping: $shipping) {
      message
      address {
        id
      }
    }
}`

export const ADDRESS_MAP = gql`
    query AddressMap {
        addressMap {
            id
            name
            cityList {
                id
                name
                areaList {
                    name
                    id
                }
            }
        }
    }
`

export const ADDRESS_ECOURIER = gql`
    query Post_codes {
        getAddressEcourier {
            city
            thana {
                thana_name
                post_codes {
                    area {
                        name
                    }
                    post_code_name
                }
            }
        }
    }
`

export const CUSTOMER_REVIEWS = gql`
query CustomerReviews($first: Int, $page: Int, $languageId: Int, $attributeLabelLanguageId2: Int) {
    customerReviews(first: $first, page: $page) {
      data {
        customer_comment
        id
        rating
        reviewImages {
          file_path
          id
        }
        status
        order {
            created_at
        }
        productDetails {
            url_key
            productDetail(language_id: $languageId) {
                name
            }
            sellerDetails {
                shop_name
            }
            productVariation {
                productVariationImage {
                    image_path
                    variation_id
                }
            }
            attributeValues {
                attributeDetails {
                attributeLabel(language_id: $attributeLabelLanguageId2) {
                    label
                    id
                }
                attributeOptionValues {
                    id
                    option_value
                    attribute_id
                }
                }
            }
        }
      }
      paginatorInfo {
        total
        perPage
        lastPage
      }
    }
}`
