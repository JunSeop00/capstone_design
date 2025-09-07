const SummaryCard = ({ title, value }) => (
    <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center border dark:border-gray-700">
        <h4 className="text-sm text-gray-500 dark:text-gray-400">{title}</h4>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{value}</p>
    </div>
);
export default SummaryCard;