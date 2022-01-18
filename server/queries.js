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