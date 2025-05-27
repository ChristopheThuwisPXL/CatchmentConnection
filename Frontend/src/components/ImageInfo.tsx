import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Img1 from "@/assets/Images/dam-Haycinth.jpg";
import Img2 from "@/assets/Images/Hartties.jpg";
import Img3 from "@/assets/Images/hartbeespoort-1500.jpg";
import Img4 from "@/assets/Images/pollution.jpeg";
import Img5 from "@/assets/Images/hyacinth.jpg";

const images = [
  {
    src: Img1,
    name: "Overview of the Hartebeespoort Dam",
    description: "The Hartebeespoort Dam is a large dam located in the North West Province of South Africa.\n\n" +
    "It was constructed in the 1920s and is primarily used for irrigation, water supply, and recreation. \n\n" +
    "The dam is situated on the Crocodile River and is surrounded by the Magaliesberg mountain range. \n\n" +
    "It is a popular destination for water sports, fishing, and hiking.",
  },
  {
    src: Img2,
    name: "Catchment Areas",
    description: "The catchment areas of the Hartebeespoort Dam encompass a vast region that collects water from rivers and streams flowing into the dam. These areas play a crucial role in supplying water to the dam and are influenced by both natural and human activities.\n\n" +
    "The catchment includes agricultural lands, urban developments, and natural landscapes, all of which contribute to the water quality and quantity reaching the dam.\n\n" +
    "Proper management of these areas is essential to ensure sustainable water resources and to mitigate issues such as pollution and sedimentation.",
  },
  {
    src: Img3,
    name: "Struggles with Hartebeespoort Dam",
    description: "Water Hyacinth, an invasive plant water species has been the number one issue related to the Hartebeespoort Dam. It has been a problem for the dam for many years, and it is still a problem today. \n\n" + 
    "The water hyacinth is a floating plant that can grow in large mats, blocking sunlight and oxygen from reaching the water below. \n\n" + 
    "This can lead to a number of problems, including fish kills, decreased water quality, and increased flooding risk.",
  },
  {
    src: Img4,
    name: "Pollution Issues",
    description: "The Hartebeespoort Dam has been facing pollution issues for many years. The dam is surrounded by urban areas, and the runoff from these areas can carry pollutants into the water.\n\n" +
    "This can lead to decreased water quality, which can affect the health of aquatic life and the safety of recreational activities.\n\n" + 
    "Efforts are being made to address these pollution issues, but they remain a significant challenge.",
  },
  {
    src: Img5,
    name: "Water Hyacinth Details",
    description: "Water Hyacinth is a floating aquatic plant that is native to the Amazon Basin in South America.\n\n" + 
    "It has become one of the world's worst aquatic weeds due to its rapid growth and ability to form dense mats on the surface of water bodies. \n\n" + 
    "These mats can block sunlight, deplete oxygen levels, and disrupt aquatic ecosystems. \n\n" + 
    "Water Hyacinth can also hinder navigation, fishing, and recreational activities in affected areas. \n\n" +
    "Efforts to control its spread include mechanical removal, biological control using natural predators, and chemical treatments.",
  }
];

const ImageInfo: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
    setShowDescription(false); // Reset description
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setShowDescription(false);
  };

  const currentImage = images[slideIndex];

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 overflow-hidden relative">
      <div
        className="absolute w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${currentImage.src})` }}
      ></div>
      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-10 max-w-xl">
        <div className="text-white">
          <h2 className="text-3xl md:text-5xl font-bold drop-shadow bg-[#0e0f1a] bg-opacity-90 px-4 py-2 rounded-lg inline-block">
            {currentImage.name}
          </h2>
          <br />
          {showDescription ? (
            <div className="mt-4 bg-[#0e0f1a] bg-opacity-90 p-4 rounded-lg shadow-lg text-lg md:text-xl whitespace-pre-line">
              <p className="text-lg md:text-xl">{currentImage.description}</p>
              <button
                onClick={() => setShowDescription(false)}
                className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
              >
                Hide
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDescription(true)}
              className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
            >
              See More
            </button>
          )}
        </div>
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
