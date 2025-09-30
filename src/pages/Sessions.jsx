import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await sessionsAPI.getUserSessions();
        setSessions(response.data.sessions || []);
      } catch (error) {
        setError('Failed to load sessions');
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSessions();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container text-center p-4">
        <h2>Please log in to view your sessions</h2>
        <p>You need to be logged in to see your booked sessions.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="container text-center p-4">
      <div>Loading your sessions...</div>
    </div>
  );

  if (error) return (
    <div className="container text-center p-4">
      <div className="error-message">{error}</div>
    </div>
  );

  const upcomingSessions = sessions.filter(session => 
    new Date(session.scheduled_time) > new Date() && session.status !== 'cancelled'
  );

  const pastSessions = sessions.filter(session => 
    new Date(session.scheduled_time) <= new Date() || session.status === 'cancelled'
  );

  return (
    <div className="container p-4">
      <h2>My Sessions</h2>
      
      <div className="mt-4">
        <h3>Upcoming Sessions ({upcomingSessions.length})</h3>
        {upcomingSessions.length > 0 ? (
          upcomingSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <p>No upcoming sessions.</p>
        )}
      </div>

      <div className="mt-4">
        <h3>Past Sessions ({pastSessions.length})</h3>
        {pastSessions.length > 0 ? (
          pastSessions.map(session => (
            <SessionCard key={session.id} session={session} isPast={true} />
          ))
        ) : (
          <p>No past sessions.</p>
        )}
      </div>
    </div>
  );
};

const SessionCard = ({ session, isPast = false }) => {
  const sessionDate = new Date(session.scheduled_time);
  const isCancelled = session.status === 'cancelled';

  return (
    <div className="card" style={{ 
      opacity: isCancelled ? 0.6 : 1,
      borderLeft: isCancelled ? '4px solid #f44336' : 
                  isPast ? '4px solid #9e9e9e' : '4px solid #4caf50'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 0.5rem 0', textDecoration: isCancelled ? 'line-through' : 'none' }}>
            {session.listing?.title || 'Session'}
          </h4>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            with <strong>{session.teacher?.username || 'Teacher'}</strong>
          </p>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
            Skill: {session.listing?.skill?.name || 'Unknown Skill'}
          </p>
          <p style={{ margin: '0', color: '#666' }}>
            {sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString()}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            background: isCancelled ? '#ffebee' : 
                       isPast ? '#f5f5f5' : '#e8f5e8',
            color: isCancelled ? '#c62828' : 
                   isPast ? '#757575' : '#2e7d32'
          }}>
            {isCancelled ? 'Cancelled' : isPast ? 'Completed' : session.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sessions;