import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import SummaryCard from './SummaryCard';

const VersionSummary = ({ version, versionDescriptions, roc, pr, acc, collapsed, setCollapsed }) => {
    if (!version || !versionDescriptions) return null;

    return (
        <div className="relative mt-4 mx-auto max-w-[1600px] bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors text-gray-700 dark:text-gray-300">
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-blue-500"
                aria-label={collapsed ? "펼치기" : "접기"}
            >
                {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>

            {collapsed ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pr-4">
                    {/* Version Title */}
                    <span className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-blue-300">
                        {version}
                    </span>
                    {/* Metrics as Pills */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm">
                            AUROC: {roc?.toFixed(3)}
                        </span>
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full px-3 py-1 text-sm">
                            AUPR: {pr?.toFixed(3)}
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full px-3 py-1 text-sm">
                            Accuracy: {acc?.toFixed(3)}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Detailed Description */}
                    <div className="prose dark:prose-invert text-sm md:text-base">
                        <strong className="text-xl md:text-2xl block mb-2">{version}</strong>
                        <p className="whitespace-pre-line">{versionDescriptions}</p>
                    </div>
                    {/* Expanded Metrics Cards */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                        <SummaryCard title="AUROC" value={roc?.toFixed(3)} large />
                        <SummaryCard title="AUPR" value={pr?.toFixed(3)} large />
                        <SummaryCard title="Accuracy" value={acc?.toFixed(3)} large />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VersionSummary;