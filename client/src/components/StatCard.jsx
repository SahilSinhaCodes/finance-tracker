const StatCard = ({ label, value, color }) => {
    return (
      <div className={`rounded-xl shadow-md p-4 w-full sm:w-1/3 text-center ${color}`}>
        <h2 className="text-lg font-medium mb-2">{label}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };

  export default StatCard;
  