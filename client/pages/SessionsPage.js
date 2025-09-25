"use client"

import { useState, useEffect } from "react"
import { sessionsAPI } from "../services/api"
import SessionCard from "../components/sessions/SessionCard"
import { useAuth } from "../contexts/AuthContext"

const SessionsPage = () => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchSessions()
  }, [activeTab])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      let response
      switch (activeTab) {
        case "teaching":
          response = await sessionsAPI.getByUser(user.id)
          setSessions(response.data.filter((session) => session.teacher_id === user.id))
          break
        case "learning":
          response = await sessionsAPI.getByUser(user.id)
          setSessions(response.data.filter((session) => session.student_id === user.id))
          break
        default:
          response = await sessionsAPI.getAll()
          setSessions(response.data.sessions || response.data)
      }
    } catch (error) {
      setError("Failed to fetch sessions")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (sessionId, newStatus) => {
    try {
      await sessionsAPI.update(sessionId, { status: newStatus })
      fetchSessions() // Refresh the list
    } catch (error) {
      setError("Failed to update session status")
    }
  }

  const tabs = [
    { id: "all", label: "All Sessions" },
    { id: "teaching", label: "Teaching" },
    { id: "learning", label: "Learning" },
  ]

  const filteredSessions = sessions.filter((session) => {
    switch (activeTab) {
      case "teaching":
        return session.teacher_id === user.id
      case "learning":
        return session.student_id === user.id
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading sessions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Sessions</h1>
          <p className="text-gray-600">Manage your teaching and learning sessions</p>
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

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {activeTab === "teaching" && "No teaching sessions yet."}
              {activeTab === "learning" && "No learning sessions yet."}
              {activeTab === "all" && "No sessions yet."}
            </div>
            <p className="text-gray-400 mt-2">
              {activeTab === "learning" && "Browse listings to book your first session!"}
              {activeTab === "teaching" && "Create a listing to start teaching!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionsPage
