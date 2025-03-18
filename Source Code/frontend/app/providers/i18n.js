'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../helpers/hooks";
import { fetchPublicLanguages, fetchTranslations } from "../helpers/backend";


const I18nContext = createContext({
  languages: null,
  lang: null,
  setLang: () => {},
  t: (key) => key,
  changeLanguage: () => {},
  isRtl: 'ltr',
  langCode: null,
});

export const I18nProvider = ({ children }) => {
  const [languages] = useFetch(fetchPublicLanguages);
  const [translations, setTranslations] = useState({});
  const [lang, setLang] = useState(null);
  const [defaultLang, setDefaultLang] = useState(null);
  const [langCode, setLangCode] = useState(null);
  const [isRtl, setIsRtl] = useState('ltr');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) { 
      const storedLang = localStorage.getItem('lang');
      if (storedLang) {
        setLang(storedLang);
      } else if (languages && languages?.docs?.length > 0) {
        const defaultLang = languages?.docs?.find(lang => lang.default);
        if (defaultLang) {
          setDefaultLang(defaultLang);
          setLang(defaultLang._id);
          setIsRtl(defaultLang.rtl ? 'rtl' : 'ltr');
          localStorage.setItem('lang', defaultLang._id);
        }
      }
    }
  }, [isClient, languages]);

  useEffect(() => {
    if (lang) {
      fetchTranslations({ _id: lang }).then(({ error, data }) => {
        if (!error) {
          setTranslations(data?.translations || {});
        } else {
          console.error('Error fetching translations:', error);
        }
      });

      const selectedLang = languages?.docs?.find(l => l._id === lang);
      setLangCode(selectedLang?.code || null);
      setIsRtl(selectedLang?.rtl ? 'rtl' : 'ltr');
    }
  }, [lang, languages]);

  const changeLanguage = (value) => {
    if (isClient) {
      setLang(value);
      localStorage.setItem('lang', value);
    }
  };

  useEffect(() => {
    if (isClient) {
      document.documentElement.dir = isRtl;
    }
  }, [isRtl, isClient]);

  const t = (key) => translations[key] || key;

  return (
    <I18nContext.Provider value={{ languages, lang, setLang, t, changeLanguage, isRtl, langCode }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

export default I18nProvider;
