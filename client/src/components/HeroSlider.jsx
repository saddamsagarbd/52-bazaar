import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    title: "Welcome to 52 Bazaar",
    subtitle: "Shop with Confidence - Your Trusted eCommerce Partner",
    image: "/images/online-shopping.jpg",
  },
  {
    id: 2,
    title: "Price Hunt Challenge",
    subtitle: "Best Price from Retail Shop",
    image: "/images/best-price.jpg",
  },
  {
    id: 3,
    title: "Why Wait? Shop NOW!",
    subtitle: "Quick Delivery Guaranteed!",
    image: "/images/delivery.jpg",
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
