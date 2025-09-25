"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { skillsAPI, listingsAPI } from "../../services/api"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const ListingSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
  price_per_hour: Yup.number()
    .min(0, "Price must be positive")
    .max(1000, "Price must be reasonable")
    .required("Price is required"),
  skill_id: Yup.number().required("Please select a skill"),
})

const ListingForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState("")
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    price_per_hour: "",
    skill_id: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsResponse = await skillsAPI.getAll()
        setSkills(skillsResponse.data)

        if (isEditing) {
          const listingResponse = await listingsAPI.getById(id)
          const listing = listingResponse.data

          // Check if user owns the listing
          if (listing.user_id !== user.id) {
            navigate("/")
            return
          }

          setInitialValues({
            title: listing.title,
            description: listing.description,
            price_per_hour: listing.price_per_hour,
            skill_id: listing.skill_id,
          })
        }
      } catch (error) {
        setServerError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isEditing, user.id, navigate])

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError("")

    try {
      if (isEditing) {
        await listingsAPI.update(id, values)
      } else {
        await listingsAPI.create(values)
      }
      navigate("/my-listings")
    } catch (error) {
      setServerError(error.response?.data?.error || "Failed to save listing")
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{isEditing ? "Edit Listing" : "Create New Listing"}</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={ListingSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {serverError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{serverError}</div>
                )}

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Learn Python Programming from Scratch"
                  />
                  <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="skill_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill
                  </label>
                  <Field
                    as="select"
                    id="skill_id"
                    name="skill_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name} ({skill.category})
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="skill_id" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Hour ($)
                  </label>
                  <Field
                    id="price_per_hour"
                    name="price_per_hour"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="25.00"
                  />
                  <ErrorMessage name="price_per_hour" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe what you'll teach, your experience, and what students can expect to learn..."
                  />
                  <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : isEditing ? "Update Listing" : "Create Listing"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/my-listings")}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ListingForm
