// GoogleTranslate.jsx
import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="flex items-center text-white cursor-pointer select-none space-x-2">
      <span role="img" aria-label="language" className="text-xl">
        🌐
      </span>
      <div
        id="google_translate_element"
        className="bg-white rounded-md border-2 border-green-600"
        style={{
          minWidth: "140px",
          maxWidth: "180px",
          overflow: "hidden",
        }}
      />
      <style>{`
        #google_translate_element select.goog-te-combo {
          padding: 6px 12px;
          border-radius: 12px;
          border: 2px solid #16a34a; /* Tailwind green-600 */
          background: white;
          color: black;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 100%;
          max-width: 180px;
        }

        /* Hide Google branding */
        .goog-logo-link, .goog-te-gadget img {
          display: none !important;
        }

        /* Hide the top Google Translate banner */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }

        /* Remove default margin from body */
        body {
          top: 0 !important;
        }

        /* Limit the dropdown options panel width */
        .goog-te-menu-frame {
          max-width: 200px !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          border: 2px solid #16a34a !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;
