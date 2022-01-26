import React from 'react';
import ALink from '../features/custom-link';
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookMessengerShareButton,
    WhatsappShareButton,
    TelegramShareButton
  } from 'next-share';

export default function ProductSocialShare() {
    return (
        <div className="social-links">
            <span className="mr-2 text-gray"> Share : </span>

            <FacebookShareButton
                url={window.location.href}
                // children={} 
                >
                    <ALink href="#" className="social-link social-facebook fab fa-facebook-f bg-primary text-white bg-facebook mr-1"></ALink>
            </FacebookShareButton>

            <TwitterShareButton
                url={window.location.href} 
                // children={}
                >
                <ALink href="#" className="social-link social-twitter fab fa-twitter bg-twitter mr-1"></ALink>
            </TwitterShareButton>

            <WhatsappShareButton
                url={window.location.href} 
                // children={}
                >
                    <ALink href="#" className="social-link social-whatsapp fab fa-whatsapp bg-whatsapp mr-1"></ALink>
            </WhatsappShareButton>

            <FacebookMessengerShareButton
                url={window.location.href} 
                // children={}
                >
                    <ALink href="#" className="social-link social-facebook-messenger fab fa-facebook-messenger bg-messenger mr-1"></ALink>
            </FacebookMessengerShareButton>

            <TelegramShareButton
                url={window.location.href} 
                // children={}
                >
                <ALink href="#" className="social-link social-telegram fab fa-telegram bg-telegram"></ALink>
            </TelegramShareButton>
        </div>
    )
}
