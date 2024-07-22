import React from "react";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";

export function FacebookShareButton({ url, hashtag, quote }) {
  const handleShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote_dericated=${encodeURIComponent(
      quote
    )}&u=${encodeURIComponent(url)}&hashtag=${encodeURIComponent(hashtag)}`;

    window.open(
      facebookUrl,
      "_blank",
      "toolbar=yes,resizable=yes,top=300,left=600,width=500,height=400"
    );
  };

  return <FacebookIcon size={35} round onClick={handleShare} />;
}

export function TwitterShareButton({ quote, url }) {
  const handleShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      quote
    )}${encodeURIComponent(url)}`;

    window.open(
      twitterUrl,
      "_blank",
      "toolbar=yes,resizable=yes,top=300,left=600,width=500,height=400"
    );
  };

  return <TwitterIcon size="35" round onClick={handleShare} />;
}

export function LinkedInShareButton({ quote, url }) {
  const handleShare = () => {
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      quote
    )} ${encodeURIComponent(url)}`;

    window.open(
      linkedInUrl,
      "_blank",
      "toolbar=yes,resizable=yes,top=300,left=600,width=500,height=400"
    );
  };

  return <LinkedinIcon size={35} round onClick={handleShare} />;
}
