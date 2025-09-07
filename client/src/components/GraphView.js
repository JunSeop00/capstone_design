import React, { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphView = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    const [highlightNode, setHighlightNode] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const dummy = {
            nodes: [
                ...Array.from({ length: 10 }, (_, i) => ({ id: `Drug_${i}`, group: 0 })),
                ...Array.from({ length: 10 }, (_, i) => ({ id: `Protein_${i}`, group: 1 }))
            ],
            links: [
                { source: "Drug_0", target: "Protein_0", value: 0.93 },
                { source: "Drug_1", target: "Protein_2", value: 0.87 },
                { source: "Drug_2", target: "Protein_1", value: 0.91 },
                { source: "Drug_3", target: "Protein_3", value: 0.88 },
                { source: "Drug_4", target: "Protein_5", value: 0.86 },
                { source: "Drug_5", target: "Protein_4", value: 0.84 },
                { source: "Drug_6", target: "Protein_6", value: 0.90 },
                { source: "Drug_7", target: "Protein_7", value: 0.89 },
                { source: "Drug_8", target: "Protein_8", value: 0.92 },
                { source: "Drug_9", target: "Protein_9", value: 0.85 },
                { source: "Drug_2", target: "Protein_5", value: 0.79 },
                { source: "Drug_3", target: "Protein_6", value: 0.82 },
                { source: "Drug_1", target: "Protein_7", value: 0.81 },
                { source: "Drug_6", target: "Protein_0", value: 0.80 },
                { source: "Drug_0", target: "Protein_4", value: 0.77 }
            ]
        };
        setGraphData(dummy);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkDark = () => {
            const root = document.documentElement;
            setIsDark(root.classList.contains("dark"));
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });
        return () => observer.disconnect();
    }, []);

    const highlightNodes = new Set();
    const highlightLinks = new Set();

    if (highlightNode) {
        graphData.links.forEach(link => {
            const src = typeof link.source === 'object' ? link.source.id : link.source;
            const tgt = typeof link.target === 'object' ? link.target.id : link.target;
            if (src === highlightNode || tgt === highlightNode) {
                highlightLinks.add(link);
                highlightNodes.add(src);
                highlightNodes.add(tgt);
            }
        });
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Node ID (e.g., Drug_3)"
                className="w-full mb-4 px-4 py-2 border rounded-lg text-sm"
                value={highlightNode || ''}
                onChange={(e) => setHighlightNode(e.target.value)}
            />
            <div
                ref={containerRef}
                className="w-full h-[400px] md:h-[650px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                <ForceGraph2D
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor={isDark ? '#1f2937' : '#ffffff'}
                    linkColor={(link) => highlightLinks.has(link) ? '#3b82f6' : (link.value > 0.9 ? '#ef4444' : link.value > 0.8 ? '#f59e0b' : (isDark ? '#9ca3af' : '#6b7280'))}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.fillStyle = highlightNodes.has(node.id) ? '#3b82f6' : '#374151';
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.fillText(label, node.x + 6, node.y + 4);
                    }}
                    linkLabel={(link) => `Score: ${link.value}`}
                    linkDirectionalParticles={2}
                    linkDirectionalArrowLength={4}
                />
            </div>
        </div>
    );
};

export default GraphView;
