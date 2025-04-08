import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Trophy, BarChart4, CreditCard } from "lucide-react";

export default function AboutPage() {
  const [isHovering, setIsHovering] = useState<number | null>(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  // Features section items (blank/placeholder content)
  const features = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Connect",
      description: "",
    },
    {
      icon: <Trophy className="h-12 w-12 text-primary" />,
      title: "Collaborate",
      description: "",
    },
    {
      icon: <BarChart4 className="h-12 w-12 text-primary" />,
      title: "Grow",
      description: "",
    },
    {
      icon: <CreditCard className="h-12 w-12 text-primary" />,
      title: "Monetize",
      description: "",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary-300/20 to-purple-300/20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-primary-400/20 to-indigo-300/20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-purple-400/20 to-primary-300/20 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 mb-4">
            CollabMatch
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            The premier platform connecting influencers and brands
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
              asChild
            >
              <Link href="/auth">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-200 hover:bg-primary-50 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Our Platform Features
          </motion.h2>
          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <Card className={`h-full border-0 shadow-md transition-all duration-300 ${
                isHovering === index ? 'shadow-xl bg-white scale-105' : 'bg-white/90'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description || "Content will be added by admin"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section (Empty for admin to fill later) */}
      <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Success Stories
          </motion.h2>
          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <Card className="h-64 flex items-center justify-center border-0 shadow-md bg-white/90">
                <CardContent className="text-center text-gray-500">
                  <p>Testimonial content to be added by admin</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="bg-gradient-to-r from-primary-600 to-indigo-700 text-white rounded-3xl p-12 text-center max-w-4xl mx-auto shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start collaborating?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join our platform today to connect with partners that align with your vision
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary-700 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
            asChild
          >
            <Link href="/auth">
              Join CollabMatch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              CollabMatch
            </p>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CollabMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}