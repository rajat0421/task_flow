import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiSettings, FiClock, FiCalendar, FiUsers } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion'; // For smooth animations
import { Helmet } from 'react-helmet-async'; // For SEO
import Layout from '../components/Layout';

// Lazy load the dashboard preview for performance
const DashboardPreview = lazy(() => import('../components/DashboardPreview'));

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation(); // Framer Motion controls for animations

  useEffect(() => {
    setIsLoaded(true);
    controls.start({ opacity: 1, y: 0 }); // Trigger animation on load
  }, [controls]);

  // Feature data for reusability
  const features = [
    {
      icon: <FiCheckCircle className="w-5 h-5" />,
      title: 'Task Management',
      description:
        'Create, organize, and track your tasks effortlessly. Set priorities and deadlines to stay on top of your workload.',
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      title: 'Customization',
      description:
        'Tailor TaskFlow to match your workflow with custom fields, labels, and views that adapt to your needs.',
    },
    {
      icon: <FiClock className="w-5 h-5" />,
      title: 'Time Tracking',
      description:
        'Monitor how long tasks take and analyze your productivity patterns to optimize your work habits.',
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      title: 'Calendar Integration',
      description:
        'Sync with your favorite calendar apps to see all your commitments in one unified view.',
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: 'Collaboration',
      description:
        'Share tasks and projects with team members to coordinate efforts and track progress together.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Premium Features',
      description:
        'Unlock advanced analytics, unlimited storage, and priority support with our premium plan.',
    },
  ];

  return (
    <Layout>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>TaskFlow - Effortless Task Management</title>
        <meta
          name="description"
          content="TaskFlow helps you organize tasks, set priorities, and meet deadlines with an intuitive interface designed for productivity."
        />
        <meta name="keywords" content="task management, productivity, collaboration, time tracking" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="TaskFlow - Effortless Task Management" />
        <meta
          property="og:description"
          content="Join thousands of users who have transformed their task management with TaskFlow."
        />
        <meta property="og:image" content="/images/taskflow-og-image.jpg" />
        <meta property="og:url" content="https://taskflow.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4 md:mb-6">
                Manage your tasks{' '}
                <span className="text-indigo-600 dark:text-indigo-400">effortlessly</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
                TaskFlow helps you organize your work and life. Track tasks, set priorities, and hit
                deadlines with an intuitive interface designed for productivity.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors text-center flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px]"
                  aria-label="Start for free"
                >
                  Start for free
                  <FiArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 px-6 sm:px-8 py-3 rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px]"
                  aria-label="Sign in"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Suspense fallback={<div>Loading preview...</div>}>
                <DashboardPreview />
              </Suspense>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-12 md:mt-20 text-center mb-12 md:mb-20">
            {[
              { value: '10k+', label: 'Active Users' },
              { value: '250k+', label: 'Tasks Completed' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <div id="features" className="py-12 md:py-16">
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay organized and boost your productivity in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-6 lg:px-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-sm relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 group-hover:bg-opacity-0 transition-all duration-300" />
                <div className="relative">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 group-hover:bg-white/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:text-white mb-4 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-white mb-2 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 py-12 md:py-16 rounded-lg my-12 md:my-16 mx-4 sm:mx-6 lg:mx-8">
          <div className="text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Ready to boost your productivity?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their task management with TaskFlow.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 min-h-[44px]"
              aria-label="Get started for free"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </Layout>
  );
}