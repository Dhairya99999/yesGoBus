import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
    };

    addGoogleTranslateScript();
  }, []);

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fd5901',
    borderRadius: '20px',
    marginRight: '10px',
    border: '1px solid #ddd',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
};

  return (
    <>
      <Helmet>
        <meta name="google-translate-customization" content="YOUR_GOOGLE_TRANSLATE_CUSTOMIZATION" />
      </Helmet>
      <div style={buttonStyle} id="google_translate_element"></div>
    </>
  );
};

export default GoogleTranslate;
