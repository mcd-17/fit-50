'use client';
import { useEffect, useState } from "react";
import Footer from "../../../components/layout/footer";
import Navbar from "../../../components/layout/header";
import Preloader from "../../../components/common/preloader";
import Scroll from "../../../components/common/scroll-bar";
import CouponBar from "../../../components/layout/couponBar";
import { useRouter } from "next/navigation";
import axios from "axios";

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [animateOut, setAnimateOut] = useState(false);
    const router = useRouter();
    useEffect(() => {
      const checkEnvFile = async () => {
        const { data } = await axios.get(process.env.backend_url);
        if (data?.status === true && data?.env === false) {
          return router.push('/setting/')
        }
      }
      checkEnvFile()
    }, [])
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimateOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }, 50);
  
      return () => clearTimeout(timer);
    }, []);

    return (
        <>
       {loading ? <Preloader animateOut={animateOut} /> : (
        <>
          <CouponBar/>
          <Navbar />
          {children}
          <Footer />
          <Scroll/>
        </>
      )}
        </>
    );
};

export default Layout;
