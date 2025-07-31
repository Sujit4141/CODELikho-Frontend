import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {loginUser} from "../authSlice"
import { useEffect } from 'react';
import ThemeButtons from "../Themes/ThemeButtons";
import { useTheme } from '../Themes/ThemeContext';
import { useState } from 'react';
import { Link } from 'react-router';

const loginupSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is to weak")
});


function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user,isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [isBackendStarting, setIsBackendStarting] = useState(false);
  
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginupSchema) });

  const [isEyeOpen, setIsEyeOpen] = useState(true);
function toggleEye(){
   setIsEyeOpen(!isEyeOpen)
}

  useEffect(() => {
   
    if (isAuthenticated) {
      navigate('/');
    }
    
   
    
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    setIsBackendStarting(true);
    dispatch(loginUser(data))
      .unwrap()
      .catch(() => setIsBackendStarting(false));
  };
  const { themeClasses } = useTheme();

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300 flex flex-col items-center justify-center p-4`}>
      <ThemeButtons />

         {isBackendStarting && (
        <div className={`w-full max-w-md mb-6 p-4 rounded-lg ${themeClasses.card} border ${themeClasses.accent.replace('text', 'border')} text-center`}>
          <p className={`${themeClasses.text} flex items-center justify-center`}>
            <svg 
              className="animate-spin h-5 w-5 mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Backend is starting (first time may take ~1 minute). Please wait...
          </p>
        </div>
      )}
      
      <div className={`w-full max-w-md ${themeClasses.card} rounded-xl shadow-2xl overflow-hidden border ${themeClasses.accent.replace('text', 'border')}/30`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold ${themeClasses.accent} mb-2`}>Welcome Back</h2>
            <p className={`${themeClasses.text} opacity-80`}>Login to your account</p>
              <p className={`mt-2 text-sm ${themeClasses.text} opacity-60`}>
              First-time users: Server may take ~1 minute to wake up
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className={`block ${themeClasses.text} text-sm font-medium mb-2`} htmlFor="emailId">
                  Email Address
                </label>
                <input
                  id="emailId"
                  placeholder="name@example.com"
                  className={`w-full px-4 py-3 ${themeClasses.card.replace('border-gray-700', '')} border ${
                    errors.emailId ? 'border-red-500' : themeClasses.card.includes('border') ? 
                    themeClasses.card.split(' ').find(c => c.startsWith('border')) : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 ${themeClasses.accent.replace('text', 'focus:ring')} text-white transition duration-300`}
                  {...register("emailId")}
                />
                {errors.emailId && (
                  <p className={`mt-2 ${themeClasses.danger} text-sm flex items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.emailId.message}
                  </p>
                )}
              </div>
              
              {/* Password Field */}
              <div className='relative'>
                <label className={`block ${themeClasses.text} text-sm font-medium mb-2`} htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                  id="password"
                   type={isEyeOpen?"password":"text"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 ${themeClasses.card.replace('border-gray-700', '')} border ${
                    errors.password ? 'border-red-500' : themeClasses.card.includes('border') ? 
                    themeClasses.card.split(' ').find(c => c.startsWith('border')) : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 ${themeClasses.accent.replace('text', 'focus:ring')} text-white transition duration-300`}
                  {...register("password")}
                />
                 

                       <button type='button' className={` cursor-pointer   absolute right-3 top-1/2 transform -translate-y-1/2 p-1  rounded-full ${themeClasses.hoverBg} focus:outline-none` }onClick={toggleEye}>{isEyeOpen?<svg 
 xmlns="http://www.w3.org/2000/svg" 
  className="h-5 w-5" 
  fill="none" 
  viewBox="0 0 24 24" 
  stroke="currentColor"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
  />
</svg>
:<svg 
  xmlns="http://www.w3.org/2000/svg" 
  className="h-5 w-5" 
  fill="none" 
  viewBox="0 0 24 24" 
  stroke="currentColor"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
  />
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
  />
                   </svg>}</button>


                </div>
                
                {errors.password && (
                  <p className={`mt-2 ${themeClasses.danger} text-sm flex items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember"
                  type="checkbox" 
                  className={`h-4 w-4 ${themeClasses.accent} ${themeClasses.card.replace('border-gray-700', '')} border rounded focus:ring-2 ${themeClasses.accent.replace('text', 'focus:ring')}`}
                />
                <label htmlFor="remember" className={`ml-2 text-sm ${themeClasses.text} opacity-80`}>
                  Remember me
                </label>
              </div>
              
              <a href="#" className={`text-sm ${themeClasses.accent} hover:underline`}>
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit"  disabled={loading}
              className={`w-full ${themeClasses.button} text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${themeClasses.accent.replace('text', 'shadow')}/20 hover:${themeClasses.accent.replace('text', 'shadow')}/40`}
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className={`${themeClasses.text} opacity-80`}>
              Don't have an account?{' '}
               <Link 
  to="/signup" 
  className={`${themeClasses.accent} font-medium hover:underline transition`}
>
  Sign In
               </Link>
            </p>
          </div>
        </div>
        
        <div className={`${themeClasses.header} p-4 text-center`}>
          <p className={`text-sm ${themeClasses.text} opacity-80`}>
            By logging in, you agree to our Privacy Policy and Cookie Policy
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-6">
          <button className={`p-3 ${themeClasses.card.replace('border-gray-700', '')} rounded-full hover:${themeClasses.card.replace('border-gray-700', '').replace('bg-', 'bg-opacity-80')} transition`}>
            <svg className="w-5 h-5 ${themeClasses.accent}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
          <button className={`p-3 ${themeClasses.card.replace('border-gray-700', '')} rounded-full hover:${themeClasses.card.replace('border-gray-700', '').replace('bg-', 'bg-opacity-80')} transition`}>
            <svg className="w-5 h-5 ${themeClasses.accent}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </button>
          <button className={`p-3 ${themeClasses.card.replace('border-gray-700', '')} rounded-full hover:${themeClasses.card.replace('border-gray-700', '').replace('bg-', 'bg-opacity-80')} transition`}>
            <svg className="w-5 h-5 ${themeClasses.accent}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;



