import { useModelVersion } from "../contexts/ModelVersionContext";
import {useEffect} from "react";

const DTITable = ({ data }) => {

    useEffect(() => {
        console.log(data)
    }, [data]);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                    <thead className="text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-3 py-1">Drug</th>
                        <th className="px-3 py-1">Protein</th>
                        <th className="px-3 py-1 text-right">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((row, i) => (
                        <tr
                            key={i}
                            className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                        >
                            <td className="px-3 py-2 rounded-l-lg text-gray-800 dark:text-gray-100">
                                {row.drug_name}
                            </td>
                            <td className="px-3 py-2 text-gray-800 dark:text-gray-100">
                                {row.protein_name}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-blue-700 dark:text-blue-400 rounded-r-lg">
                                {row.score.toFixed(3)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DTITable;
