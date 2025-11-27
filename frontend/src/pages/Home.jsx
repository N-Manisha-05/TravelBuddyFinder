import React from "react";
import heroImage from "../assets/homeImage.jpg";
import offer1 from "../assets/offer1TripPlanning.jpg";
import offer2 from "../assets/offer2FindBuddies.jpeg";
import offer3 from "../assets/connection.webp";
import choose1 from "../assets/whytochoose1.png";
import choose2 from "../assets/whytochoose2.png";
import choose3 from "../assets/whytochoose3.png";
import aboutImage from "../assets/aboutUs.jpg";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-screen">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Find Your Perfect Travel Buddy
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-2xl">
            Explore destinations, create trips, and make memories together!
          </p>
          <a
            href="#offer"
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-all shadow-md"
          >
            Explore Now
          </a>
        </div>
      </section>

      {/* What We Offer */}
      <section id="offer" className="py-20 bg-gray-100 w-full px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          What We Offer
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {[ 
            { img: offer1, title: "Trip Planning", text: "Create trips with destinations, budgets, and days. Make them public or private." },
            { img: offer2, title: "Find Buddies", text: "Join public trips or get invited to private trips. Meet like-minded travelers." },
            { img: offer3, title: "Connections", text: "Create and share detailed itineraries to make travel smooth and fun." }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg w-80 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all"
            >
              <img src={item.img} alt={item.title} className="w-full h-52 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white w-full px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          Why Choose Us
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {[ 
            { img: choose1, title: "Safe & Secure", text: "Your trips and personal info are protected. Connect safely with others." },
            { img: choose2, title: "User Friendly", text: "Easily create trips, join buddies, and share itineraries in a few clicks." },
            { img: choose3, title: "Community Driven", text: "Join a growing community of travelers and explore new places together." }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-2xl shadow-lg w-80 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all"
            >
              <div className="w-full h-52 bg-white flex justify-center items-center">
                <img src={item.img} alt={item.title} className="h-48 w-auto object-contain" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-gray-100 w-full px-6 flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="md:w-1/2">
          <img
            src={aboutImage}
            alt="About Us"
            className="w-full h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Travely connects travelers with similar interests. Create trips, join public
            adventures, or get invited to private ones. Explore destinations, build
            friendships, and share unforgettable experiences — all in one place.
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-20 w-full px-6 text-center bg-white">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h2>
        <p className="mb-6 text-gray-600">
          Have questions? Reach out to us at{" "}
          <a
            href="mailto:support@travely.com"
            className="text-blue-600 underline font-medium"
          >
            support@travely.com
          </a>
        </p>
        <form className="max-w-lg mx-auto flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Your Message"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition-all shadow-md"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6 w-full">
        <p>&copy; {new Date().getFullYear()} Travely. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
