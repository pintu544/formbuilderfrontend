import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../hooks/useAuth.jsx";

import Input from "../components/custom/Input.jsx";

import { isValidBool, isValid } from "../utils/support.js";

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    if (auth?.email) navigate("/", { replace: true });
  }, [auth]);

  const handleChange = (event) =>
    setData((prev) => ({ ...prev, [event.target.id]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    let newErrors = {
      email: !isValidBool(data.email),
      password: !isValidBool(data.password),
    };

    if (Object.values(newErrors).reduce((prev, curr) => prev || curr, false)) {
      toast.error("Both fields are required!");
      return setErrors({ ...newErrors });
    }

    if (isValid("Email", data.email, "email") !== "") {
      toast.error("Email is invalid!");
      newErrors.email = true;
      return setErrors({ ...newErrors });
    }

    if (
      data.email.trim().toLowerCase() !== "formbuilder@superassistant.com" ||
      data?.password?.trim() !== "Pintu@123"
    ) {
      toast.error("Invalid credentials");
      return setErrors({ email: true, password: false });
    }

    setAuth({ ...data });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-14 md:px-14 grid place-items-center">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 hidden md:block bg-white p-7">
          <img
            src="https://internshala-uploads.internshala.com/logo%2F60c475328d4661623487794.png.webp"
            alt="Company Logo"
            className="w-28 mb-5"
          />
          <h1 className="text-4xl font-bold text-gray-800">
            Create Forms Effortlessly
          </h1>
          <p className="text-lg text-gray-600 mt-3">
            Design, customize, and manage your forms with ease. Start building
            professional forms today!
          </p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">
              What You Can Do:
            </h2>
            <ul className="list-disc list-inside mt-4 text-gray-600">
              <li>Create categorized questions for detailed analysis.</li>
              <li>Build fill-in-the-blank (cloze) questions seamlessly.</li>
              <li>Design comprehension-based questions for insights.</li>
            </ul>
          </div>
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-bold text-gray-700">Demo Account</h3>
            <p className="text-gray-600">
              Email: <strong>formbuilder@superassistant.com</strong>
            </p>
            <p className="text-gray-600">
              Password: <strong>Pintu@123</strong>
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-gray-200 p-7">
          <div className="bg-white rounded-xl shadow-md p-7">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600 mt-2">
              Sign in to continue managing your forms and creating amazing
              experiences.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mt-5">
                <Input
                  id="email"
                  label="Email Address"
                  placeholder=" john.doe@example.com"
                  size="lg"
                  value={data.email}
                  onChange={handleChange}
                  isInvalid={errors.email}
                  mandatory={true}
                />
              </div>
              <div className="mt-5">
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  size="lg"
                  value={data.password}
                  onChange={handleChange}
                  isInvalid={errors.password}
                  mandatory={true}
                />
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </form>
            <p className="text-gray-600 mt-4 text-center">
              Don’t have an account?{" "}
              <Link className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
