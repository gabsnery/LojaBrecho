import React, { useState, useEffect } from "react";
import "./LanguageSelector.css";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const [ language, setLanguage ] = useState("pt");
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  return (
    <div className="language-selector">
      <select className="select-language" value={language} onChange={(e)=>{
        setLanguage(e.target.value);
      }}>
        <option value="pt">Portuguese</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
