import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-neutral-800 text-white fixed w-full top-0 z-[1000] shadow-md">
      <nav className="h-16 flex items-center justify-between px-5 lg:px-10">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src="https://internshala-uploads.internshala.com/logo%2F60c475328d4661623487794.png.webp"
            alt="Company Logo"
            className="w-10 h-10 mr-3"
          />
          <h1 className="font-extrabold text-2xl">
            <Link
              to="/"
              className="hover:text-gray-300 transition-all duration-200"
            >
              Form Builder
            </Link>
          </h1>
        </div>

        {/* Greeting or Navigation Items */}
        <div className="hidden sm:flex items-center space-x-4">
          <p className="text-sm font-medium">Pintu 👋</p>
          <Link className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-sm font-semibold transition-all duration-200">
            Profile
          </Link>
        </div>

        {/* Mobile Menu Toggle (Optional) */}
        <div className="sm:hidden">
          <button
            type="button"
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
