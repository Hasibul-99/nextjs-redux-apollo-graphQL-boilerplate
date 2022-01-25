import { useRouter } from 'next/router';
import Head from "next/head";
import { CMS_CONTENT, ALL_CMS_CONTENTS } from '../../server/queries';
import { initializeApollo  } from "../../server/apollo";

function CMSPage({cmsDetails}) {
    const router = useRouter();
    const { data, loading, error } = cmsDetails;

    const content = data && data.cmsDetails && data.cmsDetails?.cmsDetails[0]?.content ? data.cmsDetails?.cmsDetails[0]?.content : '';

    return (
        <main className="main">
            <Head>
                <title> B71 - Campaign </title>
                <meta property="og:description" content="Bangladesh's"/>
                <meta property="og:image" content="Bangladesh's"/>
            </Head>

            <div className="page-content mb-10 pb-7 full-width-banner-custom">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </main>
    )
}

export const getStaticPaths = async () => {
    const apolloClient = initializeApollo();
    
    let pagePaths = [];
    let paths = await apolloClient.query({
      query: ALL_CMS_CONTENTS
    });

    let cmsPages = paths?.data?.cmsPages?.data || [];

    cmsPages.forEach(cms => {
        if (cms.type === 'page') pagePaths.push({
                params : {slug: cms.slug}
            }
        ) 
    });

    return {
        paths: pagePaths,
        fallback: true
    };
}

export const getStaticProps = async (context) => {
    const apolloClient = initializeApollo();

    let content = await apolloClient.query({
        query: CMS_CONTENT,
        variables: {
            languageId: context?.locale === 'en' ? 1 : 2,
            slug: context.params?.slug
        }
    });

    return {
        props: {
            cmsDetails: content,
            meta: {
                title: context.params?.slug
            }
        },
    };
}


export default CMSPage;
