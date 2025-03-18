
import React from 'react';
import Hero from "../components/hero"
import AboutUsSection from "../components/aboutUs"
import Service from "../components/service"
import Pricing from '../../../../../components/home1/pricing';
import BMI from '../../../../../components/home1/bmi';
import ClassRoutine from '../../../../../components/home1/classRoutine';
import Team from '../../../../../components/home1/team';
import Testimonial from '../../../../../components/home1/testimonial';
import Shop from '../../../../../components/home1/shop';
import BlogNews from '../../../../../components/home1/news';
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
const Page = async() => {
    const response = await getData("home");
    const data = response?.data || null;
    const herosection = data?.content?.home2Content?.hero_section || null;
    const aboutsection = data?.content?.home2Content?.about_section || null;

    return (
        <div>
            <Hero data={herosection} />
            <AboutUsSection data={aboutsection} />
            <div className='xl:mt-[120px] lg:mt-[100px] lg:mt'>
                <Service />
            </div>
            <div className='lg:my-[120px] my-[60px] '>
                <Pricing />
            </div>
            <div className='lg:mb-[120px] mb-[60px]'>
                <BMI />
            </div>
            <ClassRoutine />
            <div className="lg:my-[140px] my-16">
                <Team />
            </div>
            <Testimonial />
            <Shop />
            <BlogNews />
        </div>
    );
};

export default Page;