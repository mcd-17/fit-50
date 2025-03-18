"use client";
import "swiper/css";
import "swiper/css/pagination";
import { useI18n } from "../../../../providers/i18n";
import HeroSwiper from "./heroswiper";

const Hero = ({ data }) => {
    const i18n = useI18n()

    return (
        <div className="relative !overflow-hidden bg-textMain h-[450px] xl:h-[950px] md:h-[600px]">
            <div className="h-fit">
                <div className="absolute z-0 w-full h-full ">
                    <video autoPlay muted loop id="bg-video" className="w-full h-[450px] xl:h-[950px] md:h-[600px] xl:object-cover object-fill">
                        <source src={ data?.video?.length > 0 ? data?.video : data?.video[0]?.url } type="video/mp4" />
                    </video>
                </div>
                <div className="relative w-full h-fit bg-black/40 z-30 pb-20  lg:pb-10">
                    <div className="h-full heroSwiper2 ">
                        <HeroSwiper data={data?.herodata} i18n={i18n} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

