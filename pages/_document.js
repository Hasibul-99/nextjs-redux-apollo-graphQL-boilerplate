import Document, { NextScript, Head, Main, Html } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <base href="/"></base>
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