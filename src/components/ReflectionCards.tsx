import React from 'react';

interface Question {
  id: number;
  question: string;
  placeholder: string;
}

interface ReflectionCardProps {
  title?: string;
  content?: string;
  category?: string;
  questions?: Question[];
}

export const ReflectionCards: React.FC<ReflectionCardProps> = ({ 
  title, 
  content, 
  category,
  questions 
}) => {
  if (questions && questions.length > 0) {
    return (
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6 m-4 max-w-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              {question.question}
            </h3>
            <textarea 
              placeholder={question.placeholder}
              className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-sm">
      {category && (
        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
          {category}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-3 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-700 leading-relaxed">
        {content}
      </p>
    </div>
  );
};
