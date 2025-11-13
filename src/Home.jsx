import React, { useState, useEffect } from 'react';
import faq from "./assets/faq.png"; // adjust path as needed
import girl from "./assets/2.jpg"; // adjust path as needed
import { Link } from "react-router-dom";


// Main App Component
const Home = () => {
    // --- State for Typing Animation ---
    const words = ["Data-Driven Insights.", "Academic Analysis.", "Lumined AI."];
    const [displayText, setDisplayText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- State for Mobile Navigation ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- State for FAQ Accordion ---
    const [openFaq, setOpenFaq] = useState(null);

    // Typing Animation Logic
    useEffect(() => {
        const currentWord = words[wordIndex];
        let typingSpeed = 150;

        if (isDeleting) {
            typingSpeed = 75;
        }

        const timer = setTimeout(() => {
            if (!isDeleting && charIndex < currentWord.length) {
                setCharIndex(prev => prev + 1);
                setDisplayText(currentWord.substring(0, charIndex + 1));
            } else if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000;
                setIsDeleting(true);
            } else if (isDeleting && charIndex > 0) {
                setCharIndex(prev => prev - 1);
                setDisplayText(currentWord.substring(0, charIndex - 1));
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setWordIndex(prev => (prev + 1) % words.length);
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, charIndex, wordIndex]);

    // FAQ Toggle Handler
    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ Data
    const faqItems = [
        {
            q: "What is LuminEd?",
            a: "LuminEd is a student academic analyzer that helps track performance, analyze progress, and provide personalized recommendations."
        },
        {
            q: "Is LuminEd free to use?",
            a: "Yes! You can sign up for free and start analyzing your academic performance immediately."
        },
        {
            q: "Can I track multiple subjects?",
            a: "Absolutely! LuminEd lets you track progress across multiple subjects with detailed reports."
        },
        {
            q: "How do I get started?",
            a: "Just click the “Start Free Trial Today” button in the hero section, create an account, and start exploring your academic insights!"
        },
    ];

    // Tailwind is assumed to be available in this environment, but custom styles must be included or managed.
    // We'll define a simple style block for the custom scrollbar and animation (though keyframes are usually handled globally).
    const customStyles = `
        /* Custom scrollbar for a sleek look */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0d1a26; /* Darker black/blue background */
        }
        ::-webkit-scrollbar-thumb {
            background: #1e3a8a; /* Blue scrollbar thumb */
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #3b82f6; /* Lighter blue on hover */
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* Mobile menu specific class for smooth transition */
        .mobile-menu-enter {
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: opacity 0.3s ease-out, max-height 0.5s ease-out;
        }
        .mobile-menu-enter-active {
            opacity: 1;
            max-height: 300px; /* Adjust based on content height */
        }
    `;

    // Function to render the SVG visualization for the Hero section
    const HeroSVGVisualization = () => (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Grid Lines */}
            <line x1="50" y1="280" x2="380" y2="280" stroke="#1e3a8a" strokeWidth="2" />
            <line x1="50" y1="200" x2="380" y2="200" stroke="#1e3a8a" strokeDasharray="4 4" />
            <line x1="50" y1="120" x2="380" y2="120" stroke="#1e3a8a" strokeDasharray="4 4" />
            <line x1="50" y1="40" x2="380" y2="40" stroke="#1e3a8a" strokeDasharray="4 4" />

            {/* Line Graph */}
            <polyline
                points="50,280 120,100 210,180 290,60 380,240"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
            />

            {/* Data Points */}
            <circle cx="50" cy="280" r="8" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0s' }} />
            <circle cx="120" cy="100" r="8" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
            <circle cx="210" cy="180" r="8" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
            <circle cx="290" cy="60" r="8" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="380" cy="240" r="8" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.8s' }} />

            {/* Title */}
            <text x="50" y="30" fontFamily="Inter, Arial" fontSize="20" fill="#a5b4fc" fontWeight="bold">Performance Trend</text>
        </svg>
    );


    return (
        <div className="bg-gray-900 text-white font-sans">
            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 shadow-lg border-b border-blue-800 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <a href="#home" className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition duration-300">
                            <span className="text-white">Lumin</span>ed
                        </a>
                        <div className="hidden md:flex space-x-8">
                            <a href="#home" className="text-gray-300 hover:text-blue-400 transition duration-300">Home</a>
                            <a href="#why-use" className="text-gray-300 hover:text-blue-400 transition duration-300">Why Use?</a>
                            <a href="#about" className="text-gray-300 hover:text-blue-400 transition duration-300">About</a>
                            <a href="#faq" className="text-gray-300 hover:text-blue-400 transition duration-300">FAQ</a>
                            <a href="#customers" className="text-gray-300 hover:text-blue-400 transition duration-300">Testimonials</a>
                        </div>
                        <Link to="/login" className="hidden md:block px-4 py-2 text-sm font-semibold bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 shadow-xl">
                            Get Started Free
                        </Link>
                        <button
                            className="md:hidden text-gray-300 hover:text-blue-400 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 mobile-menu-enter-active">
                        <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-blue-400">Home</a>
                        <a href="#why-use" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-blue-400">Why Use?</a>
                        <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-blue-400">About</a>
                        <a href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-blue-400">FAQ</a>
                        <a href="#customers" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-blue-400">Testimonials</a>
                        <Link to="/login" className="block w-full text-center mt-4 px-4 py-2 text-sm font-semibold bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 shadow-xl">
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>

            <main>
                {/* Hero Section */}
                <section id="home" className="py-20 lg:py-32 min-h-[90vh] flex items-center bg-gray-900 border-b border-blue-800 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-6">
                                <p className="text-xl font-semibold text-blue-400 mb-4 tracking-wider uppercase">
                                    The Future of Student Success
                                </p>
                                <h1 className="text-6xl lg:text-[4.5rem] font-extrabold leading-none mb-6">
                                    Unlock <span className="text-blue-400">Potential</span> with <br /> <span id="typing-text" className="text-white">{displayText}</span>
                                </h1>
                                <p className="mt-4 text-xl text-gray-300 max-w-lg">
                                   LuminEd transforms raw student data into actionable, insightful analysis. Predict success, identify struggles, and personalize learning paths with cutting-edge AI.
                                </p>
                                <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                    <Link to="/login" className="px-10 py-4 text-xl font-bold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] shadow-2xl shadow-blue-500/50">
                                        Get Started
                                    </Link>
                                    <a href="#why-use" className="px-10 py-4 text-xl font-bold border-2 border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
                                        More About LuminEd
                                    </a>
                                </div>
                            </div>

                            <div className="lg:col-span-6 flex justify-center lg:justify-end mt-12 lg:mt-0">
                                <div className="w-full max-w-lg p-6 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.6)] border-4 border-blue-600/50 bg-gray-800">
                                    <HeroSVGVisualization />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-blue-800/50" />

                {/* Why Use Section */}
                <section id="why-use" className="py-20 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-blue-400 mb-4">Why Lumined is Essential</h2>
                        <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                            LuminEd helps students track progress, analyze academic performance, and achieve success with
                            personalized insights.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="p-8 bg-gray-800 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition duration-500 border-t-4 border-blue-600">
                                <div className="text-blue-400 text-5xl mb-4">
                                    <i className="fa-solid fa-chart-line fa-2x"></i>
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Track Progress</h3>
                                <p className="text-gray-300">
                                    Monitor academic growth across subjects with clear reports and performance charts.
                                </p>
                            </div>
                            <div className="p-8 bg-gray-800 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition duration-500 border-t-4 border-blue-600">
                                <div className="text-blue-400 text-5xl mb-4">
                                    <i className="fa-solid fa-brain fa-2x"></i>
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Smart Analysis</h3>
                                <p className="text-gray-300">
                                    Identify strengths and weaknesses with AI-driven academic insights.
                                </p>
                            </div>
                            <div className="p-8 bg-gray-800 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition duration-500 border-t-4 border-blue-600">
                                <div className="text-blue-400 text-5xl mb-4">
                                    <i className="fa-solid fa-lock fa-2x"></i>
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Personalized Feedback</h3>
                                <p className="text-gray-300">
                                    Get tailored recommendations to improve and achieve academic goals faster.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-blue-800/50" />

                {/* About Section */}
                <section id="about" className="py-20 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-lg text-gray-300 mb-4">About Lumined</h2>
                                <p className="text-4xl font-bold text-blue-400 mb-6">
                                    Empowering Students with Smart Learning Insights
                                </p>
                                <p className="text-gray-300 mb-4">
                                    At <span className="font-semibold text-blue-400">LuminEd</span>, we believe education should be clear, personalized, and effective.
                                    Our platform helps students and teachers identify strengths, track progress, and achieve better academic outcomes.
                                </p>
                                <p className="text-gray-300 mb-6">
                                    With powerful analytics and user-friendly tools, we make learning more engaging and result-driven.
                                </p>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-center"><span className="text-blue-400 mr-3">✓</span> Built on state-of-the-art AI and machine learning.</li>
                                    <li className="flex items-center"><span className="text-blue-400 mr-3">✓</span> Intuitive dashboards for teachers and administrators.</li>
                                    <li className="flex items-center"><span className="text-blue-400 mr-3">✓</span> Seamless integration with existing school management systems.</li>
                                </ul>
                                <a href="#" className="mt-8 inline-block px-6 py-3 text-lg font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
                                    Learn More
                                </a>
                            </div>

                            <div className="space-y-6 text-center">
                                {/* Placeholder image for the 'About' section */}
                                <img
                                    src={girl}
                                    alt="Student looking at a futuristic data screen"
                                    className="w-64 mx-auto rounded-lg shadow-2xl border-2 border-blue-500"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/1e3a8a/ffffff?text=Placeholder"; }}
                                />

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow text-center">
                                        <h3 className="text-2xl font-bold text-blue-800">10K+</h3>
                                        <p className="text-gray-600">Active Students</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow text-center">
                                        <h3 className="text-2xl font-bold text-blue-800">500+</h3>
                                        <p className="text-gray-600">Teachers Supported</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow text-center">
                                        <h3 className="text-2xl font-bold text-blue-800">99%</h3>
                                        <p className="text-gray-600">Positive Feedback</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow text-center">
                                        <h3 className="text-2xl font-bold text-blue-800">50+</h3>
                                        <p className="text-gray-600">Schools Onboard</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-blue-800/50" />

                {/* FAQ Section */}
                <section id="faq" className="py-20 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: FAQ Content */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-8">
                                Frequently Asked Questions
                            </h2>

                            {/* FAQ Items */}
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border border-blue-700 rounded-lg bg-gray-800 shadow-xl overflow-hidden transition-all duration-300">
                                        <button
                                            className="w-full flex justify-between items-center p-4 text-left font-medium text-white hover:text-blue-400 focus:outline-none"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <span>{item.q}</span>
                                            <svg
                                                className={`w-5 h-5 transform transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-blue-400' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div
                                            className={`transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0'}`}
                                            aria-hidden={openFaq !== index}
                                        >
                                            <p className="text-gray-300">{item.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="flex justify-center md:justify-end">
                            {/* Placeholder image for the 'FAQ' section */}
                            <img
                                src={faq}
                                alt="FAQ illustration"
                                className="w-80 md:w-[450px] rounded-3xl shadow-2xl border-4 border-blue-600/50"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/3b82f6/ffffff?text=Placeholder"; }}
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-blue-800/50" />

                {/* Testimonials section */}
                <section id="customers" className="py-20 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-blue-400 mb-4">What Our Customers Say</h2>
                        <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                            Hear from students and educators who have used <span className="font-semibold text-blue-400">LuminEd</span> to improve academic success.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Testimonial 1 */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 shadow-xl">
                                <p className="text-lg italic mb-6 text-gray-200">
                                    "LuminEd helped me track my progress across all subjects. I feel more confident about exams now!"
                                </p>
                                <div className="text-blue-400 font-semibold">- Sophia Johnson</div>
                                <div className="text-sm text-gray-400">High School Student</div>
                            </div>
                            {/* Testimonial 2 */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 shadow-xl">
                                <p className="text-lg italic mb-6 text-gray-200">
                                    "I can easily monitor my subjects marks. Helps me monitor my strengths and weaknesses. It saves me hours of grading."
                                </p>
                                <div className="text-blue-400 font-semibold">- Michael Smith</div>
                                <div className="text-sm text-gray-400">University Student</div>
                            </div>
                            {/* Testimonial 3 */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 shadow-xl">
                                <p className="text-lg italic mb-6 text-gray-200">
                                    "The personalized feedback is amazing! I improved my grades within just one semester."
                                </p>
                                <div className="text-blue-400 font-semibold">- Emily Davis</div>
                                <div className="text-sm text-gray-400">College Student</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <hr className="border-blue-800/50" />

            {/* Footer */}
            <footer className="bg-gray-900 py-10 border-t border-blue-800">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo + About */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">LuminEd</h2>
                        <p className="text-gray-200 text-sm">
                            Empowering students with insights to track progress, identify strengths, and achieve success.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-200">
                            <li><a href="#home" className="hover:text-blue-400">Home</a></li>
                            <li><a href="#why-use" className="hover:text-blue-400">Why LuminEd</a></li>
                            <li><a href="#faq" className="hover:text-blue-400">FAQ</a></li>
                            <li><a href="#customers" className="hover:text-blue-400">Testimonials</a></li>
                            <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <section id="contact">
                        <div>
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-200 text-sm">
                                <li>Email: <a href="mailto:info@lumined.com" className="hover:text-blue-400">info@lumined.com</a></li>
                                <li>Phone: <a href="tel:+01234567890" className="hover:text-blue-400">+0123 456 7890</a></li>
                                <li>Address: 123 Learning Street, EduCity</li>
                            </ul>
                        </div>
                    </section>


                    {/* Newsletter / Social */}
                    <div>
                        <h3 className="font-semibold mb-4">Stay Connected</h3>
                        <form className="flex flex-col space-y-3">
                            <input type="email" placeholder="Enter your Email"
                                className="px-4 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                                Subscribe
                            </button>
                        </form>
                        <div className="flex space-x-4 mt-4 text-2xl">
                            {/* Social Icons using Font Awesome for consistency */}
                            <a href="#" className="hover:text-blue-400"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="hover:text-blue-400"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" className="hover:text-blue-400"><i className="fa-brands fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-blue-800 mt-12 pt-6 text-center text-gray-400 text-sm">
                    &copy; 2025 LuminEd. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;