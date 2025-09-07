import React, { useEffect, useState } from 'react';
import { useModelVersion } from '../contexts/ModelVersionContext';
import { predict } from '../api';

const PredictForm = ({ allDrugs, allProteins, version }) => {
    const [loading, setLoading] = useState(false);
    const [drugInput, setDrugInput] = useState('');
    const [proteinInput, setProteinInput] = useState('');
    const topN = 3;
    const [drugSuggestions, setDrugSuggestions] = useState([]);
    const [proteinSuggestions, setProteinSuggestions] = useState([]);
    const [result, setResult] = useState(null);
    const [topResults, setTopResults] = useState({ class: '', results: [] });
    const [errors, setErrors] = useState({ drug: false, protein: false, notFound: false });

    const handlePredict = async () => {
        setResult(null);
        setLoading(true);
        setTopResults({ class: '', results: [] });
        setErrors({ drug: false, protein: false, notFound: false });

        if (!drugInput && !proteinInput) {
            setErrors({ ...errors, drug: true, protein: true });
            setLoading(false);
            return;
        }

        const interaction = await predict(version, drugInput, proteinInput);

        if (interaction.drug && interaction.protein) {
            setResult({
                drug_name: interaction.drug,
                protein_name: interaction.protein,
                score: interaction.score,
            });
        } else if (interaction.drug) {
            setTopResults({ class: interaction.drug, results: interaction.top_proteins });
        } else {
            setTopResults({ class: interaction.protein, results: interaction.top_drugs });
        }

        setLoading(false);
    };

    useEffect(() => {
        console.log(topResults);
    }, [topResults]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4 transition-colors">
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-200 animate-pulse">
              데이터를 불러오는 중...
            </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 relative border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
                {/* Drug input with label */}
                <div className="relative w-full">
                    <label
                        htmlFor="drug-input"
                        className="block mb-1 pl-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Drug
                    </label>
                    <input
                        id="drug-input"
                        type="text"
                        placeholder="Enter drug name..."
                        value={drugInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            setDrugInput(value);
                            setDrugSuggestions(
                                value.length > 0
                                    ? allDrugs
                                        .filter((name) =>
                                            name.toLowerCase().includes(value.toLowerCase())
                                        )
                                        .slice(0, 5)
                                    : []
                            );
                        }}
                        className={`w-full border px-4 py-2 text-sm text-gray-900 rounded-xl focus:outline-none focus:ring-2 $
              errors.drug
                ? 'border-red-500 ring-red-200'
                : 'border-gray-300 focus:ring-blue-500'
            `}
                    />
                    {drugSuggestions.length > 0 && (
                        <ul className="absolute bg-white dark:bg-gray-700 border mt-1 rounded shadow z-10 w-full text-sm text-gray-900 dark:text-gray-100">
                            {drugSuggestions.map((item, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setDrugInput(item);
                                        setDrugSuggestions([]);
                                    }}
                                    className="px-3 py-1 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Protein input with label */}
                <div className="relative w-full">
                    <label
                        htmlFor="protein-input"
                        className="block mb-1 pl-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Protein
                    </label>
                    <input
                        id="protein-input"
                        type="text"
                        placeholder="Enter protein name..."
                        value={proteinInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            setProteinInput(value);
                            setProteinSuggestions(
                                value.length > 0
                                    ? allProteins
                                        .filter((name) =>
                                            name.toLowerCase().includes(value.toLowerCase())
                                        )
                                        .slice(0, 5)
                                    : []
                            );
                        }}
                        className={`w-full border px-4 py-2 text-sm text-gray-900 rounded-xl focus:outline-none focus:ring-2 $
              errors.protein
                ? 'border-red-500 ring-red-200'
                : 'border-gray-300 focus:ring-blue-500'
            `}
                    />
                    {proteinSuggestions.length > 0 && (
                        <ul className="absolute bg-white dark:bg-gray-700 border mt-1 rounded shadow z-10 w-full text-sm text-gray-900 dark:text-gray-100">
                            {proteinSuggestions.map((item, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setProteinInput(item);
                                        setProteinSuggestions([]);
                                    }}
                                    className="px-3 py-1 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={handlePredict}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all self-start md:self-center"
                >
                    Predict
                </button>
            </div>

            {/* Single result */}
            {result && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-600 rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100">
                    <p><strong>Drug:</strong> {result.drug_name}</p>
                    <p><strong>Protein:</strong> {result.protein_name}</p>
                    <p>
                        <strong>Score:</strong>{' '}
                        <span className="text-blue-700 dark:text-blue-300 font-semibold">
              {result.score}
            </span>
                    </p>
                </div>
            )}

            {/* Not found error */}
            {errors.notFound && (
                <div className="text-red-500 text-sm">해당 약물-단백질 조합을 찾을 수 없습니다.</div>
            )}

            {/* Top-N results */}
            {topResults?.class && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-600 rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100 space-y-2">
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                        Top {topN} predictions with <strong>{topResults.class}</strong>:
                    </p>
                    <ul className="space-y-1">
                        {topResults.results.map((item, idx) => (
                            <li key={idx}>
                                <strong>Drug:</strong> {item.drug || drugInput}<br />
                                <strong>Protein:</strong> {item.protein || proteinInput}<br />
                                <strong>Score:</strong>{' '}
                                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  {item.score.toFixed(3)}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PredictForm;