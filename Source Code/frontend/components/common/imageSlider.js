"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/thumbs";
import { Thumbs } from "swiper/modules";
import Image from "next/image";

const ProductImageSlider = ({ thumbnail_image, images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainImage, setMainImage] = useState(thumbnail_image);
useEffect(() => {
    setMainImage(thumbnail_image)
},[thumbnail_image])
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-center mb-4">
        <Image 
          src={mainImage} 
          alt="Product Main Image" 
          width={500} 
          height={500} 
          className="rounded-lg lg:h-[450px] h-[300px] object-cover"
        />
      </div>
      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        className="w-full max-w-md"
      >
        {[thumbnail_image, ...images].map((image, index) => (
          <SwiperSlide key={index} onClick={() => setMainImage(image)}>
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              className={`cursor-pointer object-cover rounded-md h-[80px] ${
                mainImage === image ? "border-2 border-primary" : ""
              }`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageSlider;
