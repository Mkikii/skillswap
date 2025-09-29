import React from 'react';
import { useNavigate } from 'react-router-dom';

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/listings/${skill.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{skill.category === 'Programming' ? 'Code' : skill.category === 'Music' ? 'Music' : 'Design'}</div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          KSh {skill.price}/hour
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{skill.title}</h3>
      <p className="text-gray-600 mb-4">{skill.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Teacher: {skill.teacher?.username || 'Teacher'}</span>
        </div>
        <button 
          onClick={handleLearnMore}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default SkillCard;