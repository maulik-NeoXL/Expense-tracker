const CreditScore = () => {
  const score = 729;
  const percentage = (score / 850) * 100; // Assuming max score of 850
  const angle = (percentage / 100) * 180; // Semi-circle is 180 degrees
  
  return (
    <div className="bg-primary-foreground p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-medium mb-6">Credit Score</h2>
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Semi-circular Gauge */}
        <div className="relative w-48 h-24 mb-4">
          {/* Background Arc */}
          <svg className="w-full h-full" viewBox="0 0 200 100">
            {/* Red segment */}
            <path
              d="M 20 80 A 80 80 0 0 1 100 20"
              stroke="#ef4444"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Yellow/Orange segment */}
            <path
              d="M 100 20 A 80 80 0 0 1 160 50"
              stroke="#f59e0b"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green segment */}
            <path
              d="M 160 50 A 80 80 0 0 1 180 80"
              stroke="#10b981"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Score indicator */}
            <g transform={`rotate(${angle - 90} 100 100)`}>
              <circle cx="100" cy="100" r="85" fill="none" stroke="transparent" />
              <path
                d="M 100 15 L 100 5"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="5" r="3" fill="white" stroke="#f59e0b" strokeWidth="2" />
            </g>
          </svg>
          
          {/* Score Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">{score}</div>
            </div>
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-sm text-gray-600 mb-2">Your credit score is Good</div>
        
        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center max-w-48">
          Based on your payment history, credit utilization, and account age
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
