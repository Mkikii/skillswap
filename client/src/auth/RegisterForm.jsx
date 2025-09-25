"use client"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
})

const RegisterForm = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const { confirmPassword, ...registerData } = values
      await register(registerData)
      navigate("/")
    } catch (error) {
      setFieldError("email", error.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        bio: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Field type="text" name="username" className="form-input" placeholder="Choose a username" />
            <ErrorMessage name="username" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" className="form-input" placeholder="Enter your email" />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" className="form-input" placeholder="Create a password" />
            <ErrorMessage name="password" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field type="password" name="confirmPassword" className="form-input" placeholder="Confirm your password" />
            <ErrorMessage name="confirmPassword" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio (Optional)</label>
            <Field
              as="textarea"
              name="bio"
              className="form-textarea"
              placeholder="Tell us about yourself and your skills"
              rows="3"
            />
            <ErrorMessage name="bio" component="div" className="error-message" />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
