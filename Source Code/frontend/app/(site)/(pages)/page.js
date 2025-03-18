import AboutUs from "../../../components/home1/aboutUs";
import BMI from "../../../components/home1/bmi";
import Features from "../../../components/home1/feature";
import Hero from "../../../components/home1/hero";
import Pricing from "../../../components/home1/pricing";
import Services from "../../../components/home1/services";
import ClassRoutine from "../../../components/home1/classRoutine";
import Testimonial from "../../../components/home1/testimonial";
import Team from "../../../components/home1/team";
import Shop from "../../../components/home1/shop";
import BlogNews from "../../../components/home1/news";
import GroupList from "../../../components/home1/group";
import "react-loading-skeleton/dist/skeleton.css";
import Home3 from "./(home-3)/home-3/page";
import Home2 from "./(home-2)/home-2/page";
import Home4 from "./(home-4)/home-4/page";

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
async function getLayout() {
  try {
    const res = await fetch(process.env.backend_url + `api/settings/themes`, {
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

const Home = async () => {
  const response = await getData("home");
  const layout = await getLayout();
  const data = response?.data || null;
  const herosection = data?.content?.home1Content?.hero_section || null;
  const aboutsection = data?.content?.home1Content?.about_section || null;
  if(layout?.data[1]?.isDefault){
      return (
        <Home2/>
      )
  }
  if(layout?.data[2]?.isDefault){
      return (
        <Home3/>
      )
  }
  if(layout?.data[3]?.isDefault){
      return (
        <Home4/>
      )
  }

  return (
    <div>
      <Hero data={herosection} />
      <Features />
      <AboutUs data={aboutsection} />
      <Services />
      <div className="lg:my-28 my-16">
        <BMI />
      </div>
      <ClassRoutine />
      <div className="lg:my-32 my-16">
        <Pricing />
      </div>
      <Testimonial />
      <div className="mb-[60px] lg:mb-0">
        <Team />
      </div>
      <GroupList />
      <Shop />
      <BlogNews />
    </div>
  );
  
};

export default Home;
