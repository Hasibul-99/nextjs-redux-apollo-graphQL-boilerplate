import { useRouter } from 'next/router';
import { useQuery  } from '@apollo/client';

import { CMS_CONTENT } from '../../server/queries';

function Footer() {
    const router = useRouter();
    const { loading, error, data } = useQuery(CMS_CONTENT, {
        variables: { languageId: router.locale === 'en' ? 1 : 2, slug: 'footer' },
      });
    console.log("data", data);
    const content = data && data.cmsDetails && data.cmsDetails?.cmsDetails[0]?.content ? data.cmsDetails?.cmsDetails[0]?.content : '';
    
    return (
        <footer className="footer appear-animate fadeIn appear-animation-visible" style={{animationDuration: '1.2s'}}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </footer>
    )
}

export default Footer;