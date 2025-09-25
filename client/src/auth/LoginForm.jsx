"use client"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await login(values.email, values.password)
      navigate("/")
    } catch (error) {
      setFieldError("password", error.message || "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" className="form-input" placeholder="Enter your email" />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" className="form-input" placeholder="Enter your password" />
            <ErrorMessage name="password" component="div" className="error-message" />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
