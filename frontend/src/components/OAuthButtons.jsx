import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const OAuthButtons = ({ labelText = "Or continue with" }) => {
  // Get the API URL from environment variable
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {labelText}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${apiUrl}/auth/google`}
          className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FcGoogle className="h-5 w-5 mr-2" />
          Google
        </a>
        
        <a
          href={`${apiUrl}/auth/github`}
          className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FaGithub className="h-5 w-5 mr-2" />
          GitHub
        </a>
      </div>
    </div>
  );
};

export default OAuthButtons; 