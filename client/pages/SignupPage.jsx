import { Link } from "react-router-dom"
import RegisterForm from "../components/auth/RegisterForm"

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Join SkillSwap</h1>
          <p>Create your account to start sharing skills</p>
        </div>

        <RegisterForm />

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
