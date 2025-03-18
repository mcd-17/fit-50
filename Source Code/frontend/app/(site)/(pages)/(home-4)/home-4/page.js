import React from 'react';
import Hero from '../components/hero';
import AboutUsSection from '../components/aboutUs';
import Service from '../components/service';
import FitnessCalculator from '../../../../../components/home1/bmi';
import GroupList from '../components/group';
import Team from '../components/team';
import Pricing from '../components/pricing';
import ClassRoutine from '../components/classRoutine';
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

const Home4 = async () => {
    const response = await getData("home");
    const data = response?.data || null;
    const herosection = data?.content?.home4Content?.hero_section || null;
    const aboutsection = data?.content?.home4Content?.about_section || null;

    return (
        <div>
            <Hero data={herosection} />
            <AboutUsSection data={aboutsection} />
            <Service />
            <div className='lg:mb-[120px] mb-[60px]'>
                <FitnessCalculator />
            </div>
            <GroupList />
            <div className='lg:mt-[120px] mb-[60px]'>
                <ClassRoutine />
            </div>
            <div className='lg:mt-[120px] mb-[60px]'>
                <Team />
            </div>
            <div className='lg:mt-[120px] mb-[60px]'>
                <Pricing />
            </div>
            <div className='lg:mt-[120px] mb-[60px]'>
                <Testimonial />
            </div>
            <Shop />
            <BlogNews />
        </div>
    );
};

export default Home4;