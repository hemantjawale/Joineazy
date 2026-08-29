import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Presentation, Code, FileText, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-blue-50/50 dark:bg-surface-900 overflow-x-hidden font-sans p-4 md:p-6">
      <section className="relative min-h-[150vh] rounded-[2.5rem] overflow-hidden  max-w-100xl mx-auto flex flex-col mt-5">
        <img
          src="/heroimg.png"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-4 md:px-8 py-6">
          <nav className="bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-between px-6 py-4 rounded-full mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-surface-900">Studify</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-surface-500">
              <a href="#" className="text-surface-900 transition-colors">Home</a>
              <a href="#" className="hover:text-surface-900 transition-colors">Course</a>
              <a href="#" className="hover:text-surface-900 transition-colors">About</a>
              <a href="#" className="hover:text-surface-900 transition-colors">Pricing</a>
              <a href="#" className="hover:text-surface-900 transition-colors">Resource</a>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-semibold text-surface-600 hover:text-surface-900 transition-colors hidden sm:block">Login</Link>
              <Link to="/register">
                <Button className="rounded-full px-6 bg-surface-900 text-white hover:bg-surface-800 shadow-md">
                  Get started
                </Button>
              </Link>
            </div>
          </nav>

          <div className="text-center max-w-3xl mx-auto pt-4 md:pt-8 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-6 text-xs font-bold text-surface-700"
            >
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-200 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-green-200 border-2 border-white" />
                <div className="w-5 h-5 rounded-full bg-purple-200 border-2 border-white" />
              </div>
              Trusted By 1500+ Users
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-surface-900 leading-[1.1] mb-4 drop-shadow-sm"
            >
              Learn Smarter. Grow Faster. <br /> Succeed Anywhere.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base font-medium text-surface-700 max-w-xl mx-auto mb-8 drop-shadow-sm"
            >
              Practical, industry-ready courses taught by expert instructors. Learn at your own pace or live from anywhere in the world.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Link to="/register">
                <Button className="rounded-full px-8 py-6 text-base font-bold bg-surface-900 text-white hover:bg-surface-800 shadow-2xl">
                  Explore Course
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-[color:var(--border)] bg-white/30 dark:bg-surface-900/30 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-surface-500 mb-8 uppercase tracking-widest">Trusted by learners from top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black tracking-tighter">duolingo</span>
            <span className="text-2xl font-black">SKILLSHARE.</span>
            <span className="text-2xl font-serif font-bold text-blue-600">coursera</span>
            <span className="text-2xl font-black text-purple-600">Udemy</span>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <Quote className="w-12 h-12 text-surface-300" />
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Platform that helps curious minds learn faster build skills and succeed anywhere
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-2xl font-black text-primary">2x</div>
                <div>
                  <h4 className="font-bold text-lg">Faster Skills</h4>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">Learn concepts quicker with structured lessons and guided practice.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-2xl font-black text-blue-500">30%</div>
                <div>
                  <h4 className="font-bold text-lg">Course Completion</h4>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">Stay motivated with progress tracking and milestone-based learning.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden flex items-center justify-center">
              <img src="/hero2.png" alt="3D Character" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}