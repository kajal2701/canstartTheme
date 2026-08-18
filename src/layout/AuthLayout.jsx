import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
const AuthLayout = () => {
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.auth);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-page-height">
        <Suspense fallback={<Loading />}>{<Outlet />}</Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;

