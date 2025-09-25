"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { reviewsAPI } from "../../services/api"

const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating must be at most 5 stars")
    .required("Rating is required"),
  comment: Yup.string().max(500, "Comment must be less than 500 characters"),
})

const ReviewForm = ({ session, onSuccess, onCancel }) => {
  const [serverError, setServerError] = useState("")

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError("")

    try {
      const reviewData = {
        session_id: session.id,
        rating: Number.parseInt(values.rating),
        comment: values.comment,
      }

      const response = await reviewsAPI.create(reviewData)
      onSuccess(response.data.review)
    } catch (error) {
      setServerError(error.response?.data?.error || "Failed to submit review")
    }
    setSubmitting(false)
  }

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Leave a Review</h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">{session.listing?.title}</h4>
        <p className="text-sm text-gray-600">Session with {session.teacher?.username}</p>
      </div>

      <Formik
        initialValues={{
          rating: 5,
          comment: "",
        }}
        validationSchema={ReviewSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {serverError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{serverError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
              <StarRating rating={values.rating} onRatingChange={(rating) => setFieldValue("rating", rating)} />
              <ErrorMessage name="rating" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <Field
                as="textarea"
                id="comment"
                name="comment"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Share your experience with this session..."
              />
              <ErrorMessage name="comment" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ReviewForm
