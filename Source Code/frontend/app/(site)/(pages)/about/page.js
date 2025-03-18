
import React from 'react'
import BasicBar from '../../../../components/common/basic-bar'
import Team from '../../../../components/home1/team'
import Pricing from '../../../../components/home1/pricing'
import Hero from './hero'
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
  const response = await getData("about");
    const data2 = response?.data || null;
  const data = data2?.content?.about_page;

  return (
    <div>
      <BasicBar heading={('About Us')} subHeading={('About Us')} />
      <Hero data={data} />
      <Team />
      <div className="lg:my-[120px] my-16">
        <Pricing />
      </div>
    </div>
  )
}

export default Page

