import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const customStyles = `
@keyframes subtle-move {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
}

.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0d1a26;
    background-image: 
        radial-gradient(circle at 10% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 90% 20%, rgba(30, 58, 138, 0.2) 0%, transparent 50%);
    background-size: 200% 200%;
    animation: subtle-move 30s ease infinite;
}

.input-focus:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.6);
}

@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes dash { to { stroke-dashoffset: -1000; } }

.animate-svg-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-svg-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
.animate-svg-dash { animation: dash 5s linear infinite; }

.line-style { 
    stroke-dasharray: 100; 
    stroke-dashoffset: 0; 
}
`;

const SignUpCard = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '' 
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = formData;

        // Check all fields are filled
        if (!name || !email || !password || !confirmPassword) {
            alert("All fields are required!");
            return;
        }

        // Check password strength
        if (!isStrongPassword(password)) {
            alert(
                "Password must be at least 8 characters long and include:\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character"
            );
            return;
        }

        // Check passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Save user data in localStorage (using email as key)
        const userData = { name, email, password };
        try {
            localStorage.setItem(email, JSON.stringify(userData));
        } catch (err) {
            console.error("localStorage error:", err);
            alert("Could not save user. Check browser storage settings.");
            return;
        }

        alert(`Account created successfully!\nName: ${name}\nEmail: ${email}`);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        navigate('/dashboard');
    };

    return (
        <>
            <style>{customStyles}</style>

            <div className="font-sans login-container text-white">
                <div className="max-w-6xl w-full mx-4 lg:mx-8 p-6">
                    <div className="bg-gray-800 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] border border-blue-700 lg:flex overflow-hidden transform transition duration-500 hover:scale-[1.005] hover:shadow-blue-500/50">
                        
                        <div className="hidden lg:block lg:w-1/2 p-10 bg-gray-900 border-r border-blue-800 flex flex-col justify-center items-center">
                            <h2 className="text-4xl font-extrabold text-blue-400 mb-6">
                                Join Lumined
                            </h2>
                            
                            <svg viewBox="0 0 300 250" className="w-full h-auto max-w-xs opacity-90">
                                <circle cx="150" cy="125" r="40" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="4" className="animate-svg-pulse"/>
                                <line x1="150" y1="125" x2="50" y2="50" stroke="#3b82f6" strokeWidth="2" className="opacity-70 line-style animate-svg-dash" style={{ animationDelay: '0s' }} />
                                <line x1="150" y1="125" x2="250" y2="50" stroke="#3b82f6" strokeWidth="2" className="opacity-70 line-style animate-svg-dash" style={{ animationDelay: '1s' }} />
                                <line x1="150" y1="125" x2="50" y2="200" stroke="#3b82f6" strokeWidth="2" className="opacity-70 line-style animate-svg-dash" style={{ animationDelay: '2s' }} />
                                <circle cx="50" cy="50" r="8" fill="#a5b4fc" className="animate-svg-ping" style={{ animationDuration: '2s' }}/>
                                <circle cx="250" cy="50" r="8" fill="#a5b4fc" className="animate-svg-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}/>
                                <circle cx="50" cy="200" r="8" fill="#a5b4fc" className="animate-svg-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}/>
                            </svg>
                            
                            <p className="mt-8 text-gray-400 text-center">
                                Start your journey with data-driven insights.
                            </p>
                        </div>
                        
                        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16">
                            <div className="text-center mb-8">
                                <Link to="/" className="text-4xl font-bold text-blue-400 hover:text-blue-300 transition duration-300">
                                    <span className="text-white">Lumin</span>ed
                                </Link>
                                <h1 className="text-3xl font-semibold mt-6 text-white">Create Account</h1>
                                <p className="text-gray-400 mt-2">Get started with your free account</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input 
                                        type="text" id="name" name="name" required 
                                        value={formData.name} onChange={handleChange}
                                        className="input-focus w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition duration-300"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <input 
                                        type="email" id="email" name="email" required 
                                        value={formData.email} onChange={handleChange}
                                        className="input-focus w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition duration-300"
                                        placeholder="your.email@institution.edu"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                    <input 
                                        type="password" id="password" name="password" required 
                                        value={formData.password} onChange={handleChange}
                                        className="input-focus w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition duration-300"
                                        placeholder="Create a strong password"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                                    <input 
                                        type="password" id="confirmPassword" name="confirmPassword" required 
                                        value={formData.confirmPassword} onChange={handleChange}
                                        className="input-focus w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition duration-300"
                                        placeholder="Repeat your password"
                                    />
                                </div>
                                
                                <div className="pt-4">
                                    <button type="submit"
                                        className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.4)] text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
                                        <FontAwesomeIcon icon={faUserPlus} className="mr-3" />
                                        Sign Up
                                    </button>
                                </div>

                                <div className="text-center pt-4">
                                    <p className="text-gray-400 text-sm">
                                        Already have an account? 
                                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition duration-300"> Log In</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <p className="text-center text-xs text-gray-600 mt-8">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </>
    );
};

export default SignUpCard;
