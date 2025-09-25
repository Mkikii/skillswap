"use client"
import { useAuth } from "../../contexts/AuthContext"

const SessionCard = ({ session, onStatusUpdate }) => {
  const { user } = useAuth()
  const isTeacher = session.teacher_id === user.id
  const isStudent = session.student_id === user.id

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateCost = () => {
    if (!session.listing?.price_per_hour || !session.duration) return 0
    return ((session.duration / 60) * session.listing.price_per_hour).toFixed(2)
  }

  const handleStatusChange = async (newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(session.id, newStatus)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.listing?.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
            <span>{formatDuration(session.duration)}</span>
            <span>${calculateCost()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Scheduled:</span>
          <span className="text-sm font-medium">{formatDate(session.scheduled_date)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">{isTeacher ? "Student:" : "Teacher:"}</span>
          <span className="text-sm font-medium">
            {isTeacher ? session.student?.username : session.teacher?.username}
          </span>
        </div>

        {session.notes && (
          <div>
            <span className="text-sm text-gray-600">Notes:</span>
            <p className="text-sm text-gray-800 mt-1">{session.notes}</p>
          </div>
        )}
      </div>

      {/* Action buttons based on status and user role */}
      <div className="flex space-x-2">
        {session.status === "pending" && isTeacher && (
          <>
            <button
              onClick={() => handleStatusChange("confirmed")}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={() => handleStatusChange("cancelled")}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Decline
            </button>
          </>
        )}

        {session.status === "pending" && isStudent && (
          <button
            onClick={() => handleStatusChange("cancelled")}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
          >
            Cancel Request
          </button>
        )}

        {session.status === "confirmed" && (
          <>
            <button
              onClick={() => handleStatusChange("completed")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Mark Complete
            </button>
            <button
              onClick={() => handleStatusChange("cancelled")}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        )}

        {session.status === "completed" && !session.review && isStudent && (
          <button
            onClick={() => {
              /* Navigate to review form */
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Leave Review
          </button>
        )}
      </div>
    </div>
  )
}

export default SessionCard
