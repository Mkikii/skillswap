"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { authAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
})

const PasswordSchema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your password"),
})

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    setMessage("")
    setError("")

    try {
      const response = await authAPI.updateProfile(values)
      updateUser(response.data.user)
      setMessage("Profile updated successfully!")
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update profile")
    }
    setSubmitting(false)
  }

  const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
    setMessage("")
    setError("")

    try {
      await authAPI.changePassword(values)
      setMessage("Password changed successfully!")
      resetForm()
    } catch (error) {
      setError(error.response?.data?.error || "Failed to change password")
    }
    setSubmitting(false)
  }

  const tabs = [
    { id: "profile", label: "Profile Information" },
    { id: "password", label: "Change Password" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{message}</div>
        )}

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="bg-white rounded-lg shadow-md p-8">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

              <Formik
                initialValues={{
                  username: user?.username || "",
                  bio: user?.bio || "",
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleProfileUpdate}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <Field
                        as="textarea"
                        id="bio"
                        name="bio"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Tell others about yourself and your skills..."
                      />
                      <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 text-white py-2 px-6 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Updating..." : "Update Profile"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

              <Formik
                initialValues={{
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
                }}
                validationSchema={PasswordSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <Field
                        id="current_password"
                        name="current_password"
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage name="current_password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Field
                        id="new_password"
                        name="new_password"
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage name="new_password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Field
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage name="confirm_password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 text-white py-2 px-6 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
