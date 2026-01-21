// import React from "react";
// import { useForm } from "react-hook-form";
// import http from "../lib/http";
// import { useMutation } from "@tanstack/react-query";
// import Urls from "../config/urls";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../features/auth/authSlice";

// function LoginForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loginMutation = useMutation({
//     // mutationFn: (data) => http.post(Urls.signin, data),
//     // onSuccess: (res, variables) => {
//     //   const { user, access_token, refresh_token } = res?.data?.data;
//     //   localStorage.setItem("authData", JSON.stringify({
//     //     user,
//     //     access_token,
//     //     refresh_token
//     //   }));
//     //   dispatch(login({ user, access_token, refresh_token }));
//     //   if (res?.data?.data?.user?.is_verified) {
//     //     navigate('/app/dashboard')
//     //   }
//     //   else {
//     //     navigate("/verify-email", { state: { email: variables.email } });
//     //   }
//     // },

//   });

//   const onSubmit = (data) => {
//         navigate('/app/dashboard')
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
//         <h2 className="text-2xl font-semibold text-center text-gray-800">
//           Sign in to your account
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-6">

//           {loginMutation.error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               {loginMutation.error.message || "Login failed. Please try again."}
//             </div>
//           )}

//           {/* Email */}
//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               {...register("email", { required: "Email is required" })}
//               className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Password</label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               {...register("password", { required: "Password is required" })}
//               className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center justify-between mb-6">
//             <a
//               href="/forgot-password"
//               className="text-sm text-blue-600 hover:underline focus:outline-none"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             disabled={loginMutation.isPending}
//             className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
//           >
//             {loginMutation.isPending ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-4 text-sm text-center text-gray-600">
//           Don&apos;t have an account?{" "}
//           <Link
//             to="/auth/signup"
//             className="text-blue-600 hover:underline focus:outline-none"
//           >
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;

import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

/* =========================
   STATIC DEMO CREDENTIALS
========================= */
const STATIC_CREDENTIALS = {
  admin: {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  },
  user: {
    email: "user@gmail.com",
    password: "user123",
    role: "user",
  },
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  /* =========================
        COMMON LOGIN HANDLER
  ========================= */
  const handleLogin = (user) => {
    const authData = {
      user,
      access_token: "dummy-access-token",
      refresh_token: "dummy-refresh-token",
    };

    dispatch(login(authData));

    // ✅ IMPORTANT: persist login
    localStorage.setItem("authData", JSON.stringify(authData));

    navigate("/app/dashboard");
  };

  /* =========================
        LOGIN SUBMIT
  ========================= */
  const onSubmit = (data) => {
    const { email, password } = data;

    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // ADMIN LOGIN
      if (
        email === STATIC_CREDENTIALS.admin.email &&
        password === STATIC_CREDENTIALS.admin.password
      ) {
        handleLogin({ email, role: "admin" });
        return;
      }

      // USER LOGIN
      if (
        email === STATIC_CREDENTIALS.user.email &&
        password === STATIC_CREDENTIALS.user.password
      ) {
        handleLogin({ email, role: "user" });
        return;
      }

      setIsLoading(false);
      alert("❌ Invalid Email or Password");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
            {/* Logos Container */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* ADNOC Logo */}
              <div className="flex-shrink-0">
                <img
                  src="/ADNOC.png"
                  alt="ADNOC"
                  className="h-12 w-12 object-contain"
                />
              </div>

              {/* Divider */}
              <div className="w-px h-12 bg-gray-300 opacity-50"></div>

              {/* TechM Logo */}
              <div className="flex-shrink-0">
                <img
                  src="/TechM.png"
                  alt="TechM"
                  className="h-12 w-12 object-contain"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white text-center">
              Welcome Back
            </h1>
            <p className="text-blue-100 text-sm text-center mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-400 mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* DEMO CREDENTIALS INFO */}
              <div className="p-4 bg-blue-900 bg-opacity-30 border border-blue-700 border-opacity-50 rounded-lg">
                <p className="font-semibold text-gray-200 text-sm mb-3">
                  📋 Demo Credentials
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="font-medium text-gray-300">Admin Account</p>
                    <p className="text-gray-400">
                      Email:{" "}
                      <span className="text-blue-400 font-mono">
                        admin@gmail.com
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Password:{" "}
                      <span className="text-blue-400 font-mono">admin123</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-blue-700 border-opacity-50">
                    <p className="font-medium text-gray-300">User Account</p>
                    <p className="text-gray-400">
                      Email:{" "}
                      <span className="text-blue-400 font-mono">
                        user@gmail.com
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Password:{" "}
                      <span className="text-blue-400 font-mono">user123</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-sm text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
              >
                Create one
              </Link>
            </p>

            {/* Forgot Password Link */}
            <div className="text-center mt-3">
              <Link
                to="/auth/forgot-password"
                className="text-xs text-gray-500 hover:text-gray-400 transition duration-200"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          A joint platform by ADNOC and Tech Mahindra
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
