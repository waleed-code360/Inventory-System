import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);

            const { error: authError } = isLogin
                ? await login(email, password)
                : await signup(email, password);

            if (authError) throw authError;

            if (!isLogin) {
                // If signed up, usually you can auto-login or ask to check email
                // Supabase by default might require email confirmation unless disabled.
                // We will assume auto-login or successful creation.
                alert("Account created! Logging you in...");
            }
            navigate('/');
        } catch (err) {
            setError('Failed to ' + (isLogin ? 'sign in' : 'create account') + '. ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transition-all">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-center text-gray-400 mb-6 text-sm">
                    {isLogin ? 'Enter your credentials to access the inventory.' : 'Sign up to start managing your products.'}
                </p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} />
                    </div>

                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? 'Submitting...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
