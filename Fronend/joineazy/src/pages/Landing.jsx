import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Presentation, Code, FileText, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION (matches 1.webp & 3.webp) */}
      <section className="relative pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Navbar */}
        <nav className="glass-panel flex items-center justify-between px-6 py-4 rounded-full mb-16 relative z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="text-xl font-bold tracking-tight">Studify</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-600 dark:text-surface-300">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Course</a>
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Resource</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">Login</Link>
            <Link to="/register">
              <Button className="rounded-full px-6 bg-surface-900 text-white hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-200">
                Get started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center relative z-10 max-w-4xl mx-auto pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-6 text-xs font-semibold text-surface-600 dark:text-surface-300"
          >
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-200 border border-white" />
              <div className="w-5 h-5 rounded-full bg-green-200 border border-white" />
              <div className="w-5 h-5 rounded-full bg-purple-200 border border-white" />
            </div>
            Trusted By 1500+ Users
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-surface-900 dark:text-white leading-[1.1] mb-6"
          >
            Learn Smarter. Grow Faster. <br /> Succeed Anywhere.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-10"
          >
            Practical, industry-ready courses taught by expert instructors. Learn at your own pace or live from anywhere in the world.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Link to="/register">
              <Button className="rounded-full px-8 py-6 text-lg bg-surface-900 text-white hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-200 shadow-xl">
                Explore Course
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Illustration Placeholder (Abstract gradient shapes to mimic the vibe since we can't extract the 3D students) */}
        <div className="mt-16 relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden glass-card flex items-center justify-center bg-gradient-to-b from-blue-100 to-transparent dark:from-blue-900/30">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px]" />
           <p className="text-surface-400 dark:text-surface-500 font-medium italic z-10 text-center px-4">
             [Vibrant 3D Student Group Illustration goes here] <br/>
             (Mimicking the high-quality 3D renders from the design)
           </p>
        </div>
      </section>

      {/* 2. PARTNERS (matches 4.webp) */}
      <section className="py-12 border-y border-[color:var(--border)] bg-white/30 dark:bg-surface-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-surface-500 mb-8 uppercase tracking-widest">Trusted by learners from top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos placeholders */}
            <span className="text-2xl font-black tracking-tighter">duolingo</span>
            <span className="text-2xl font-black">SKILLSHARE.</span>
            <span className="text-2xl font-serif font-bold text-blue-600">coursera</span>
            <span className="text-2xl font-black text-purple-600">Udemy</span>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM FEATURES (matches 4.webp) */}
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
             <div className="w-full max-w-md mx-auto aspect-square glass-card rounded-3xl flex items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <p className="text-surface-400 font-medium italic">[3D Character with Paper Plane]</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. COURSES GRID (matches 2.webp & 4.webp) */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-surface-100/50 dark:to-surface-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-wider text-primary mb-2 block">Our Courses</span>
            <h2 className="text-4xl font-bold inline-block relative">
              <span className="relative z-10">Skills That Matter in the Real World</span>
              <div className="absolute -bottom-2 -left-4 -right-4 h-4 bg-blue-200/50 dark:bg-blue-900/50 -z-0 -rotate-1 rounded-full" />
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mt-6 max-w-2xl mx-auto">
              From beginner to advanced, our courses help you build job-ready skills through hands-on projects, expert guidance, and flexible learning paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard 
              title="Digital Marketing Essentials"
              desc="Master SEO, social media, and content marketing strategies to grow brands and reach the right audience."
              bg="from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20"
              hours="12h 30m"
              instructor="Jerome Bell"
            />
            <CourseCard 
              title="AI & Automation Basics"
              desc="We help brands evolve through innovation design meaningful collaboration."
              bg="from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
              hours="14h 45m"
              instructor="Bessie Cooper"
            />
            <CourseCard 
              title="Product Design Workshop"
              desc="Learn end to end product design from ideation to prototyping through practical exercises and guided projects."
              bg="from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20"
              hours="18h 55m"
              instructor="Floyd Miles"
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button className="rounded-full px-8 py-6 text-base bg-surface-900 text-white hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-200 shadow-xl">
              Explore All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (matches 4.webp) */}
      <section className="py-32 px-4 relative overflow-hidden bg-blue-50 dark:bg-blue-900/10">
        {/* Wavy background decoration */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-[color:var(--background)]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 20%, 80% 100%, 20% 100%, 0 20%)" }} />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-2 block">Testimonial</span>
            <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
              Studify helped me build real skills, not just theory.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <TestimonialCard 
              quote="I finally feel confident applying what I learn. The courses are clear, practical, and easy to follow. I was able to apply that I learned immediately."
              author="Jerome Bell"
              role="UI/UX Design Student"
              offset="md:-mt-12"
            />
            <TestimonialCard 
              quote="Studify helped me build real skills, not just theory. The courses are clear, practical, and easy to follow."
              author="Leslie Alexander"
              role="Web Dev Student"
              offset="md:mt-0"
            />
            <TestimonialCard 
              quote="This platform changed how I learn online Genius!! The courses are clear, practical, and easy to follow. I was able to apply that I learned immediately."
              author="Courtney Henry"
              role="Data Analytics Student"
              offset="md:-mt-8"
            />
          </div>
        </div>
      </section>
      
      {/* 6. FOOTER (matches 5.webp bottom) */}
      <footer className="relative pt-32 pb-12 bg-gradient-to-b from-green-400 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          {/* Giant Logo */}
          <h1 className="text-[12vw] font-black tracking-tighter leading-none opacity-90 drop-shadow-2xl mb-12">
            Studify
          </h1>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12 font-medium">
            <a href="#" className="hover:text-green-200 transition-colors">Home &uarr;</a>
            <a href="#" className="hover:text-green-200 transition-colors">Course &uarr;</a>
            <a href="#" className="hover:text-green-200 transition-colors">About &uarr;</a>
            <a href="#" className="hover:text-green-200 transition-colors">Pricing &uarr;</a>
            <a href="#" className="hover:text-green-200 transition-colors">Resource &uarr;</a>
          </div>
          
          <div className="w-full border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>© 2026 IT ALL RIGHTS RESERVED</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">PRIVACY</a>
              <a href="#" className="hover:text-white">POLICY</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ title, desc, bg, hours, instructor }) {
  return (
    <div className="glass-card rounded-[2rem] p-3 overflow-hidden flex flex-col h-full bg-white dark:bg-surface-900 border-0 shadow-xl">
      <div className={`h-48 rounded-[1.5rem] bg-gradient-to-tr ${bg} flex items-center justify-center p-4 relative`}>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-surface-900">Popular</span>
          <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-surface-900">Online</span>
        </div>
        <p className="text-surface-600/50 italic text-sm font-medium">[3D Course Graphic]</p>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6 flex-1 line-clamp-2">{desc}</p>
        
        <div className="flex items-center gap-4 text-xs font-bold text-surface-500 mb-6">
          <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /> 4.8 (1,467)</span>
          <span className="flex items-center gap-1"><ClockIcon /> {hours}</span>
          <span className="flex items-center gap-1"><CertificateIcon /> Certificate</span>
        </div>
        
        <div className="flex items-center justify-between border-t border-surface-100 pt-4 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-200" />
            <div>
              <p className="text-sm font-bold leading-tight">{instructor}</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">Instructor</p>
            </div>
          </div>
          <Link to="/register">
            <Button className="rounded-full bg-surface-900 text-white dark:bg-white dark:text-surface-900 shadow-lg px-6">Join Course</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, offset }) {
  return (
    <div className={`glass-card p-8 rounded-3xl relative ${offset}`}>
      <div className="absolute -top-6 -left-6 w-12 h-12 text-yellow-400">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <p className="text-lg font-bold mb-6 relative z-10 text-surface-800 dark:text-surface-100">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-200" />
        <div>
          <p className="font-bold text-sm">{author}</p>
          <p className="text-xs text-surface-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

function CertificateIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-2 5-3-1-1-3-5-2 5-2 1-3 3-1 2 5"/><circle cx="12" cy="8" r="4"/></svg>;
}
