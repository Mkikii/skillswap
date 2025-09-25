"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { sessionsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"

const BookingSchema = Yup.object().shape({
  scheduled_date: Yup.date().min(new Date(), "Date must be in the future").required("Date is required"),
  duration: Yup.number()
    .min(30, "Minimum duration is 30 minutes")
    .max(480, "Maximum duration is 8 hours")
    .required("Duration is required"),
  notes: Yup.string().max(500, "Notes must be less than 500 characters"),
})

const BookingForm = ({ listing, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [serverError, setServerError] = useState("")

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError("")

    try {
      const bookingData = {
        listing_id: listing.id,
        scheduled_date: new Date(values.scheduled_date).toISOString(),
        duration: Number.parseInt(values.duration),
        notes: values.notes,
      }

      const response = await sessionsAPI.create(bookingData)
      onSuccess(response.data.session)
    } catch (error) {
      setServerError(error.response?.data?.error || "Failed to book session")
    }
    setSubmitting(false)
  }

  const calculateCost = (duration) => {
    if (!duration || !listing.price_per_hour) return 0
    return ((duration / 60) * listing.price_per_hour).toFixed(2)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Book a Session</h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">{listing.title}</h4>
        <p className="text-sm text-gray-600 mb-2">with {listing.user?.username}</p>
        <p className="text-lg font-semibold text-green-600">${listing.price_per_hour}/hour</p>
      </div>

      <Formik
        initialValues={{
          scheduled_date: "",
          duration: 60,
          notes: "",
        }}
        validationSchema={BookingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            {serverError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{serverError}</div>
            )}

            <div>
              <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date & Time
              </label>
              <Field
                id="scheduled_date"
                name="scheduled_date"
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="scheduled_date" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <Field
                as="select"
                id="duration"
                name="duration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
              </Field>
              <ErrorMessage name="duration" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <Field
                as="textarea"
                id="notes"
                name="notes"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any specific topics you'd like to focus on or questions you have..."
              />
              <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {values.duration && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Cost:</span>
                  <span className="text-lg font-semibold text-blue-600">${calculateCost(values.duration)}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Booking..." : "Book Session"}
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

export default BookingForm
