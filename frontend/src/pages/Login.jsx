import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    setError(""); // Clear any existing errors
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (response.status === 200) {
        localStorage.setItem("auth", JSON.stringify(response?.data?.response));
        navigate("/"); // Redirect to home page
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <section className="bg-gray-50 ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
                <p className="text-sm font-light text-gray-500 ">
                  Don’t have an account yet?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    className="font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign up
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
