import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    title: "Welcome to 52 Bazaar",
    subtitle: "Your trusted ecommerce solution",
    image: "/images/slide1.jpg",
  },
  {
    id: 2,
    title: "Big Discounts",
    subtitle: "Up to 50% off on all items!",
    image: "/images/slide2.jpg",
  },
  {
    id: 3,
    title: "Fast Delivery",
    subtitle: "We deliver within 24 hours",
    image: "/images/slide3.jpg",
  },
];

export default function HeroSlider() {
  return (
    <div className="w-full h-[400px] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center text-white"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="bg-black bg-opacity-50 p-6 rounded text-center">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {slide.title}
                </h1>
                <p className="text-lg mt-2">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
