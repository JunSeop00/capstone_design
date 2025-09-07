import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = ({
                         drug_embedding,
                         protein_embedding,
                         init_drug,
                         init_protein,
                     }) => {
    const [modifiedData, setModifiedData] = useState([]);
    const [isDark, setIsDark] = useState(false);
    const [showInit, setShowInit] = useState(false); // false: 학습 후, true: 초기 임베딩
    const [showCategory, setShowCategory] = useState('drugs'); // 'drugs' or 'proteins'

    // 다크 모드 감지 로직
    useEffect(() => {
        const checkDark = () => {
            const root = document.documentElement;
            setIsDark(root.classList.contains('dark'));
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);

    // 데이터 업데이트 로직
    useEffect(() => {
        const drugs = showInit ? init_drug : drug_embedding;
        const proteins = showInit ? init_protein : protein_embedding;
        if (!drugs || !proteins) return;

        const data = [];
        if (showCategory === 'drugs') {
            data.push({
                x: drugs.map((d) => d.vector[0]),
                y: drugs.map((d) => d.vector[1]),
                mode: 'markers',
                type: 'scatter',
                name: 'Drugs',
                marker: { size: 8, color: '#F59E0B' }, // 오렌지
                hovertext: drugs.map(
                    (d) => `(${d.vector[0]}, ${d.vector[1]}), ${d.drug_name ?? ''}`
                ),
                hoverinfo: 'text',
            });
        } else {
            data.push({
                x: proteins.map((p) => p.vector[0]),
                y: proteins.map((p) => p.vector[1]),
                mode: 'markers',
                type: 'scatter',
                name: 'Proteins',
                marker: { size: 8, color: '#3B82F6' }, // 블루
                hovertext: proteins.map(
                    (p) => `(${p.vector[0]}, ${p.vector[1]}), ${p.protein_name ?? ''}`
                ),
                hoverinfo: 'text',
            });
        }

        setModifiedData(data);
    }, [
        drug_embedding,
        protein_embedding,
        init_drug,
        init_protein,
        showInit,
        showCategory,
    ]);

    return (
        <div className="w-full h-[400px] md:h-[650px]">
            {/* ─────────────────────────────────────────────
         토글 컨테이너 (세로 정렬 → 작은 화면 / 가로 정렬 → 중간 이상 화면)
      ───────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
                {/* Train ⇄ Init 토글 */}
                <div className="flex relative w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                    {/* 슬라이더 */}
                    <div
                        className={`absolute top-0 left-0 w-1/2 h-full bg-blue-600 rounded-full transition-transform duration-300 ${
                            showInit ? 'translate-x-[100%]' : ''
                        }`}
                    />
                    <button
                        onClick={() => setShowInit(false)}
                        className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ${
                            !showInit
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Train
                    </button>
                    <button
                        onClick={() => setShowInit(true)}
                        className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ${
                            showInit
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Init
                    </button>
                </div>

                {/* Drugs ⇄ Proteins 토글 */}
                <div className="flex relative w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                    {/* 슬라이더 */}
                    <div
                        className={`absolute top-0 left-0 w-1/2 h-full bg-green-500 rounded-full transition-transform duration-300 ${
                            showCategory === 'proteins' ? 'translate-x-full' : ''
                        }`}
                    />
                    <button
                        onClick={() => setShowCategory('drugs')}
                        className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ${
                            showCategory === 'drugs'
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Drugs
                    </button>
                    <button
                        onClick={() => setShowCategory('proteins')}
                        className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ${
                            showCategory === 'proteins'
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Proteins
                    </button>
                </div>
            </div>

            {/* ─────────────────────────────────────────────
         Plotly Scatter
      ───────────────────────────────────────────── */}
            <Plot
                data={modifiedData}
                layout={{
                    autosize: true,
                    margin: { t: 20, l: 20, r: 20, b: 20 },
                    paper_bgcolor: isDark ? '#1F2937' : '#FFFFFF',
                    plot_bgcolor: isDark ? '#1F2937' : '#FFFFFF',
                    font: { color: isDark ? '#F9FAFB' : '#111827' },
                }}
                config={{ responsive: true, displayModeBar: false }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default ScatterPlot;
