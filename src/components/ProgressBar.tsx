import React from 'react';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  steps: string[];
};

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const percentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          return (
            <div key={index} className={`flex flex-col items-center ${isActive ? 'text-blue-600 font-semibold' : isCompleted ? 'text-gray-600 dark:text-slate-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm transition-colors duration-300 ${
                isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : 
                isCompleted ? 'border-blue-600 bg-blue-600 text-white' : 
                'border-gray-200 dark:border-slate-700 bg-gray-50 text-gray-400'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{step}</span>
            </div>
          );
        })}
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
