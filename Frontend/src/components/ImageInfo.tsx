import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const images = [
  {
    src: "https://i.postimg.cc/g0W4qN2y/Switzerland.jpg",
    name: "Switzerland",
    description: "Renowned for its breathtaking Alpine scenery and precision in craftsmanship",
  },
  {
    src: "https://i.postimg.cc/DZfgR0s8/Finland.jpg",
    name: "Finland",
    description: "Known for its saunas, lakes, and a deep connection to nature",
  },
  {
    src: "https://i.postimg.cc/kX2jn2HS/Iceland.jpg",
    name: "Iceland",
    description: "Famous for its stunning geothermal landscapes, waterfalls, and glaciers",
  },
  {
    src: "https://i.postimg.cc/05WWRYVx/Australia.jpg",
    name: "Australia",
    description: "Distinguished by its diverse ecosystems, ranging from beaches to bushland",
  },
  {
    src: "https://i.postimg.cc/dtg5DqMx/Netherland.jpg",
    name: "Netherland",
    description: "Characterized by its iconic canals, tulip fields, and windmills",
  },
  {
    src: "https://i.postimg.cc/sDGJktB9/Ireland.jpg",
    name: "Ireland",
    description: "Known for its lush green landscapes and rich cultural heritage",
  },
];

const ImageInfo: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 overflow-hidden relative">
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full bg-cover bg-center flex items-center justify-center transition-opacity duration-700 ${
              index === slideIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image.src})` }}
          >
            <div className="bg-opacity-50 p-6 rounded-lg text-white text-left absolute left-20">
              <h2 className="text-3xl md:text-5xl font-bold">{image.name}</h2>
              <p className="mt-2 text-lg md:text-xl">{image.description}</p>
              <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition">
                See More
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute bottom-4 left-1/3 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-600 transition"
        onClick={prevSlide}
      >
        <FaArrowLeft size={20} />
      </button>
      <button
        className="absolute bottom-4 right-1/3 transform translate-x-1/2 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-600 transition"
        onClick={nextSlide}
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
};

export default ImageInfo;
