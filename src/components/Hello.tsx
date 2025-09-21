const CreditScore = () => {
  return (
    <div className="bg-primary-foreground p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-medium mb-4">Credit Score</h2>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-4xl font-bold text-green-600 mb-2">750</div>
        <div className="text-sm text-muted-foreground mb-4">Good Credit Score</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Based on your payment history and credit utilization
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
