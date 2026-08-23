import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart3, CheckCircle, ArrowRight, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Assignment Management",
    description: "Post assignments with OneDrive links, set deadlines, and track submissions effortlessly.",
  },
  {
    icon: Users,
    title: "Group Collaboration",
    description: "Students form their own groups, assign tasks, and chat in real-time.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visual dashboards for professors to monitor completion rates and group performance.",
  },
  {
    icon: CheckCircle,
    title: "Submission Tracking",
    description: "Two-step verification ensures accurate submission confirmations.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="text-lg font-bold text-surface-900">Joineazy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
            <Zap size={14} />
            Smart Assignment Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 leading-tight mb-6 animate-fade-in">
            Simplify
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"> Assignment </span>
            Workflows
          </h1>
          <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            Where professors post, students collaborate, and submissions get tracked — all in one clean platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Start for Free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-surface-900 mb-3">Everything You Need</h2>
            <p className="text-surface-500 max-w-xl mx-auto">Built for real classroom workflows — from posting assignments to tracking every group&apos;s progress.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-surface-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surface-900 mb-3">How It Works</h2>
          <p className="text-surface-500 mb-12 max-w-xl mx-auto">Three simple steps to streamline your classroom assignments.</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Professor Posts", desc: "Create assignments with OneDrive submission links and due dates." },
              { step: "02", title: "Students Collaborate", desc: "Form groups, assign tasks, chat, and work together on submissions." },
              { step: "03", title: "Track Progress", desc: "Everyone sees real-time submission status and completion analytics." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-sm text-surface-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-200 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs">J</span>
            </div>
            <span className="text-sm font-semibold text-surface-700">Joineazy</span>
          </div>
          <p className="text-xs text-surface-400">&copy; {new Date().getFullYear()} Joineazy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
