import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiClock, FiCalendar, FiBarChart2, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FiCalendar className="h-6 w-6 text-primary-500" />,
      title: 'Task Organization',
      description: 'Organize tasks with customizable boards, lists, and cards to fit your workflow.'
    },
    {
      icon: <FiClock className="h-6 w-6 text-primary-500" />,
      title: 'Time Tracking',
      description: 'Track time spent on tasks and generate reports to improve productivity.'
    },
    {
      icon: <FiBarChart2 className="h-6 w-6 text-primary-500" />,
      title: 'Insightful Analytics',
      description: 'Visualize task completion rates, productivity trends, and workload distribution.'
    },
    {
      icon: <FiUsers className="h-6 w-6 text-primary-500" />,
      title: 'Team Collaboration',
      description: 'Collaborate seamlessly with team members, assign tasks, and share updates.'
    }
  ];

  const testimonials = [
    {
      content: "TaskFlow has completely transformed how our team manages projects. It's intuitive and powerful.",
      author: "Sarah Johnson",
      role: "Product Manager"
    },
    {
      content: "I've tried many task management apps, but TaskFlow strikes the perfect balance of simplicity and features.",
      author: "Michael Chen",
      role: "Freelance Developer"
    },
    {
      content: "The analytics in TaskFlow helped us identify bottlenecks in our workflow we never knew existed.",
      author: "Alex Thorne",
      role: "Team Lead"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header/Navigation */}
      <header className="relative bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">TaskFlow</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Features
              </a>
              <a href="#testimonials" className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Testimonials
              </a>
              <a href="#pricing" className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Pricing
              </a>
            </nav>
            
            <div className="flex items-center justify-end flex-1 lg:w-0">
              {isAuthenticated() ? (
                <Link
                  to="/dashboard"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="whitespace-nowrap text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
              >
                <span className="block">Manage tasks</span>
                <span className="block text-primary-600 dark:text-primary-400">like never before</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
              >
                TaskFlow helps you organize, track, and prioritize your work in a visual, flexible, and rewarding way.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
              >
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  No credit card required. Free to try.
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
                    alt="TaskFlow Dashboard"
                  />
                  <div className="absolute inset-0 bg-primary-600 mix-blend-multiply opacity-20"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage tasks effectively
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Powerful features designed to boost your productivity
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-base text-gray-500 dark:text-gray-400 flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Loved by teams worldwide
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Here's what our users have to say
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Choose the plan that's right for you or your team
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Free</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Perfect for individuals and small projects</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-white dark:bg-gray-700 rounded-md py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 text-center border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Start for free
                </Link>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white tracking-wide uppercase">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {['Up to 10 tasks', 'Basic task management', 'Personal dashboard', '7-day task history'].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                      <span className="text-base text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-primary-600 dark:bg-primary-800 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-white">Pro</h3>
                <p className="mt-4 text-primary-200">For teams and advanced features</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">$12</span>
                  <span className="text-base font-medium text-primary-200">/month</span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-white rounded-md py-2 text-sm font-semibold text-primary-600 text-center hover:bg-gray-50"
                >
                  Start free trial
                </Link>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-white tracking-wide uppercase">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {[
                    'Unlimited tasks',
                    'Advanced analytics',
                    'Team collaboration',
                    'Unlimited task history',
                    'Priority support',
                    'Custom integrations'
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-white shrink-0 mr-2" />
                      <span className="text-base text-primary-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-700 dark:bg-primary-900">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-primary-300">Start using TaskFlow today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:justify-end">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                >
                  Get started now
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-700"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</a></li>
                <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;