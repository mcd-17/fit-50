import React from 'react';
import Sehedul from '../components/sehedul';
import WhyChoose from '../components/why-choose';
import Introduction from '../components/introduction';
import Gallery from '../components/gallery';
import Hero from '../components/hero';
import BMI from '../../../../../components/home1/bmi';
import Pricing from '../../../../../components/home1/pricing';
import Team from '../../../../../components/home1/team';
import Shop from '../../../../../components/home1/shop';
import BlogNews from '../../../../../components/home1/news';
import Joining from '../components/joining';
import Services from '../../../../../components/home1/services';
import Testimonial from '../../../../../components/home1/testimonial';
async function getData(slug) {
    try {
      const res = await fetch(process.env.backend_url + `api/page?slug=${slug}`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        return null; 
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return null;
    }
  }
async function getCompanyData() {
    try {
      const res = await fetch(process.env.backend_url + `api/page?slug=company_details`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        return null; 
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return null;
    }
  }
const Home3 = async() => {
    const response = await getData("home");
    const data = response?.data || null;
    const herosection = data?.content?.home3Content?.hero_section || null;  
    const intraduction = data?.content?.home3Content?.introduction || null;
    const company_details = await getCompanyData();
    const company_details_response = company_details?.data || null;
    const company = company_details_response?.content?.company_details || null;
    
    return (
        <div className='bg-black'>
            <Hero data={herosection} />
            <Introduction data={intraduction} company={company} />
            <WhyChoose />
            <div className=' border border-black'>
                <Services />
            </div>
            <Sehedul />
            <div className='border !border-black lg:my-[120px] my-[60px]   '>
                <BMI />
            </div>
            <div className='!text-white border border-black'>
                <Gallery />
            </div>
            <div className='!text-white border border-black'>
                <Testimonial />
            </div>
            <div className='border border-black lg:mb-[140px] mb-16'>
                <Pricing />
            </div>
            <div className=" ">
                <Team />
            </div>
            <div className=' border border-black'>
                <Shop />
            </div>
            <div className=' border border-black'>
                <BlogNews />
            </div>
            <Joining />
        </div>
    );
};

export default Home3;