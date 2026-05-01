// HeroSection.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Leaf,
  ShoppingCart,
  ArrowRight,
  Truck,
  Shield,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Nature's Finest",
      highlight: "Harvest Daily",
      description:
        "Experience the authentic taste of farm-fresh organic produce, delivered directly from local farms to your kitchen within hours.",
      image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1600",
      overlay: "from-green-900/70 to-green-800/50",
      badge: "🔥 Limited Harvest",
      buttonText: "Explore Collection",
      stats: [
        { value: "5000+", label: "Happy Customers" },
        { value: "100%", label: "Organic" },
        { value: "24hr", label: "Farm to Table" },
      ],
    },
    {
      id: 2,
      title: "Premium Himalayan",
      highlight: "Organic Apples",
      description:
        "Hand-picked from orchards at 8,000 feet. Naturally sweet, crisp, and bursting with authentic mountain flavor.",
      image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1600",
      overlay: "from-red-900/70 to-red-800/50",
      badge: "⭐ Farmer's Choice",
      buttonText: "Shop Apples",
      stats: [
        { value: "2000+", label: "Happy Customers" },
        { value: "98%", label: "5-Star Rating" },
        { value: "Fresh", label: "Daily Stock" },
      ],
    },
    {
      id: 3,
      title: "Fresh Vegetables",
      highlight: "Straight from Farm",
      description:
        "Locally sourced, chemical-free vegetables harvested within 24 hours. Taste the difference of real freshness.",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1600&q=80",
      overlay: "from-green-900/70 to-emerald-800/50",
      badge: "🌿 Fresh Stock",
      buttonText: "View Vegetables",
      stats: [
        { value: "50+", label: "Vegetables" },
        { value: "Same Day", label: "Delivery" },
        { value: "100%", label: "Chemical Free" },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const features = [
    { icon: Truck, label: "Free Delivery", desc: "On orders above ₹1000", bgColor: "bg-green-50", textColor: "text-green-600" },
    { icon: Shield, label: "Fresh Guarantee", desc: "100% quality assured", bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { icon: Clock, label: "Same Day Delivery", desc: "Order before 2 PM", bgColor: "bg-orange-50", textColor: "text-orange-600" },
    { icon: Leaf, label: "100% Organic", desc: "No chemicals used", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[70vh] min-h-[600px] max-h-[900px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide 
                ? "opacity-100 scale-100 z-10" 
                : "opacity-0 scale-110 z-0"
            }`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 animate-slide-down">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-white text-sm font-medium">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-slide-right">
                      {slide.title}
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-300">
                        {slide.highlight}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-white/90 text-base md:text-lg mb-8 max-w-lg animate-slide-right animation-delay-100">
                      {slide.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-6 mb-8 animate-slide-right animation-delay-200">
                      {slide.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-white/70">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 animate-slide-right animation-delay-300">
                      <Link
                        to="/products"
                        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2"
                      >
                        <span>{slide.buttonText}</span>
                        <ShoppingCart className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 bg-gradient-to-r from-white/20 to-transparent" />
                      </Link>
                      <Link
                        to="/about"
                        className="group flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300"
                      >
                        Watch Story
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Content - Floating Cards */}
                  <div className="hidden lg:block animate-fade-in animation-delay-200">
                    <div className="relative">
                      {/* Main Floating Card */}
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                            <Leaf className="w-8 h-8 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">100% Certified</p>
                            <p className="text-white/70 text-sm">Organic Product</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-white/80 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>4.9 Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            <span>Free Delivery</span>
                          </div>
                        </div>
                      </div>

                      {/* Second Floating Card */}
                      <div className="absolute -bottom-16 -right-8 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-500">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">Best Quality</p>
                            <p className="text-white/70 text-xs">Farm Fresh</p>
                          </div>
                        </div>
                      </div>

                      {/* Third Floating Card */}
                      <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">Growing Strong</p>
                            <p className="text-white/70 text-xs">Local Farmers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 border border-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 border border-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 h-1 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full"
                  : "w-6 h-1 bg-white/40 hover:bg-white/60 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:block animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div key={idx} className="group flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-6 h-6 ${item.textColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;