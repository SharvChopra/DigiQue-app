import { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import "./AuthPage.css";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-image-section" />
      <div className="auth-form-section">
        <div className="form-toggle-buttons">
          <button
            onClick={() => setIsSigningUp(true)}
            className={isSigningUp ? "active" : ""}
          >
            Create Account
          </button>
          <button
            onClick={() => setIsSigningUp(false)}
            className={!isSigningUp ? "active" : ""}
          >
            Sign In
          </button>
        </div>

        <div className="forms-wrapper">
          <SignUpForm
            className={`auth-form ${isSigningUp ? "active" : "inactive"}`}
          />
          <SignInForm
            className={`auth-form ${!isSigningUp ? "active" : "inactive"}`}
          />
        </div>
      </div>
    </div>
  );
}
