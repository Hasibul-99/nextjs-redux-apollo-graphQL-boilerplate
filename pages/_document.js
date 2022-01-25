import Document, { NextScript, Head, Main, Html, Script } from 'next/document';
export default class MyDocument extends Document {
    render() {
        let pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;

        let metaTags = {
            title: pageProps?.meta?.title || 'ঘরে বসে B71',
            description: pageProps?.meta?.description || "Bangladesh's best online shopping store with 17+ million products at resounding discounts in Bangladesh.",
            image: pageProps?.meta?.image || process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png",
            secure_url: pageProps?.meta?.secure_url || process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png",
        }

        return (
            <Html lang="en">
                <Head>
                    <base href="/"></base>
                    <link rel="icon" href="images/icons/favicon.png" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" />
                    <link rel="stylesheet" type="text/css" href="vendor/riode-fonts/riode-fonts.css" />
                    <link rel="stylesheet" type="text/css" href="vendor/fontawesome-free/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="vendor/owl-carousel/owl.carousel.min.css" />
                    
                    <meta charSet="UTF-8"/>
                    <meta property="og:site_name" content="https://b71.sslwireless.com/"/>
                    <meta name="theme-color" content="#FF284F"/>
                    <meta property="og:title" content={metaTags.title}/>
                    <meta property="og:description" content={metaTags.description}/>
                    <meta property="og:image" content={metaTags.image}/>
                    <meta property="og:image:secure_url" content={metaTags.secure_url}/>
                    <meta property="og:image:type" content="image/jpg"/>
                    <meta property="og:image:width" content="1200"/>
                    <meta property="og:image:height" content="627"/>
                </Head>

                <body>
                    <Main />

                    <script src="./js/jquery.min.js"></script>
                    <script src="./js/slide-to-submit.js"></script>
                    
                    <NextScript />
                    {/* <script src="http://finbot.publicdemo.xyz/chatbot_v2/bundle.min.js?v=1.23" async></script> */}
                    {/* <script src="https://finbot.publicdemo.xyz/fb//main.js?v=1244" client_key="55" project_key="f4c895bb-cf3b-41f5-bd1c-ce9eaf80b010"   id="chat_data"></script> */}
                </body>
            </Html>
        )
    }
}