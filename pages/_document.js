import Document, { NextScript, Head, Main, Html, Script } from 'next/document';

export default class MyDocument extends Document {
    // static async getInitialProps( ctx ) {
    //     const initialProps = await Document.getInitialProps( ctx );
    //     return { ...initialProps }
    // }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <base href="/"></base>
                    <title> B71 - ECommerce Store </title>
                    <base href="/"></base>
                    <link rel="icon" href="images/icons/favicon.png" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" />
                    <link rel="stylesheet" type="text/css" href="vendor/riode-fonts/riode-fonts.css" />
                    <link rel="stylesheet" type="text/css" href="vendor/fontawesome-free/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="vendor/owl-carousel/owl.carousel.min.css" />
                    
                    <meta charSet="UTF-8"/>
                    <meta name="theme-color" content="#FF284F"/>
                    <meta property="og:title" content="ঘরে বসে B71"/>
                    <meta property="og:description" content="Bangladesh's best online shopping store with 17+ million products at resounding discounts in dhaka,
                            ctg & All across Bangladesh with cash on delivery (COD)"/>
                    <meta property="og:image" content={process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png"}/>
                    <meta property="og:image:secure_url" content={process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png"}/>
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