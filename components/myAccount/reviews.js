import { Fragment, useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import ToBeReviewed from "../../components/myAccount/component/to-be-reviewed";
import ReviewHisport from "../../components/myAccount/component/review-hisport";
import { useLazyQuery } from '@apollo/client';
import { COUNT_REVIEWS_VALUE } from '../../server/queries';

import { useRouter } from 'next/router';

export default function Reviews() {
    const router = useRouter();
    const query = router.query;

    const [defaultIdx, setDefaultIdx] = useState(query.show === "1" ? 1 : 0);
    const [toBeReviewedCount, setToBeReviewedCount ] = useState(0);
    const [reviewHistoryCount, setReviewHistoryCount ] = useState(0);

    const [ getCustomerReview, { data, loading, error } ] = useLazyQuery( COUNT_REVIEWS_VALUE, {
        fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
        onCompleted(value) {
            if (value) {
                setToBeReviewedCount(value?.packageToBeReviews?.paginatorInfo?.total || 0);
                setReviewHistoryCount(value?.customerReviews?.paginatorInfo?.total || 0)
            }
        }
    });

    useEffect(() => {
        getCustomerReview({
            variables: {}
        });
    }, []) 

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">My Reviews</h3>
            <hr className="mb-2"/>
            <Tabs className="tab tab-nav-simple order-history-tabs" selectedTabClassName="show" 
                selectedTabPanelClassName="active" defaultIndex={ defaultIdx } >
                <TabList className="nav nav-tabs justify-content-left" role="tablist">
                    <Tab className="nav-item">
                        <span className="nav-link">To be reviewed ({toBeReviewedCount})</span>
                    </Tab>
                    <Tab className="nav-item">
                        <span className="nav-link">History ({reviewHistoryCount})</span>
                    </Tab>
                </TabList>

                <div className="tab-content">
                    <TabPanel className="tab-pane product-tab-description">
                        <ToBeReviewed/>
                    </TabPanel>
                    <TabPanel className="tab-pane product-tab-description">
                        <ReviewHisport/>
                    </TabPanel>
                </div>
            </Tabs >
        </div>
    )
}
