'use client';

import Link from 'next/link';
import { MessageCircle, Headphones, ArrowRight, CheckCircle, Linkedin, Github, Mail, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">K</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">KRUX Finance</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
            <nav className="hidden md:flex gap-2 lg:gap-4">
              <Link
                href="/customer-chat"
                className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Customer Portal
              </Link>
              <Link
                href="/support-dashboard"
                className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Support Portal
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex gap-2">
          <Link
            href="/customer-chat"
            className="flex-1 text-center px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Customer Portal
          </Link>
          <Link
            href="/support-dashboard"
            className="flex-1 text-center px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Support Portal
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            AI-Powered Customer Support
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Experience seamless loan assistance with our intelligent chatbot and dedicated support team
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Customer Portal Card */}
          <Link href="/customer-chat">
            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Customer Portal</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Get instant help with loan applications, document requirements, and application status checks
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>24/7 AI-powered assistance</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Real-time application tracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Connect with live agents</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform">
                <span>Start Chat</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">Demo Accounts:</p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div>📱 Rahul Sharma: +919876543210</div>
                  <div>📱 Priya Patel: +919876543211</div>
                </div>
              </div> */}
            </div>
          </Link>

          {/* Support Portal Card */}
          <Link href="/support-dashboard">
            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500 dark:hover:border-green-600 cursor-pointer group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Support Dashboard</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Manage customer conversations, resolve tickets, and provide exceptional support
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Real-time ticket management</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Quick reply templates</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Customer history & insights</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform">
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">Demo Agent Accounts:</p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div>👤 Agent: amit.kumar</div>
                  <div>👤 Senior Agent: sneha.singh</div>
                </div>
              </div> */}
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 sm:mb-12 px-2">
          Key Features
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Intelligent Chatbot</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              AI-powered bot handles loan inquiries, document requirements, and status checks automatically
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Live Agent Support</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Seamless escalation to human agents with full conversation context and customer history
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Real-time Sync</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Instant synchronization between customer chat and agent dashboard for seamless communication
            </p>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 sm:mb-12 px-2">
          Developer
        </h3>
        <div className="max-w-md mx-auto px-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 border-2 sm:border-4 border-blue-500 dark:border-blue-600 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <img
                  src="/MohitPic.jpg"
                  alt="Mohit Pipaliya"
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-80" />
                </div>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Mohit Pipaliya</h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">Student ID: 202412072</p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <a
                  href="mailto:202412072@dau.ac.in"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                >
                  202412072@dau.ac.in
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <a
                href="https://www.linkedin.com/in/mohit-g-pipaliya/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/MOHITPIPALIYA2911"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 sm:mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 text-center text-gray-600 dark:text-gray-400">
          <p className="text-xs sm:text-sm px-2">
            © 2024 KRUX Finance. Built with Next.js 14, TypeScript, and Tailwind CSS
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-500 px-2">
            Customer Support System Demo - All data is stored locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}

