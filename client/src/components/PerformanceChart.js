import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const PerformanceChart = ({ test_loss, test_roc, test_acc }) => {
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

    if (!test_loss || !test_roc || !test_acc) return null;

    // epoch (x축) 생성
    const epochs = Array.from({ length: test_loss.length }, (_, i) => i);

    return (
        <div className="w-full h-[400px] md:h-[650px]">
            <Plot
                data={[
                    {
                        x: epochs,
                        y: test_loss,
                        type: "scatter",
                        mode: "lines",
                        name: "Loss",
                        line: { color: "#e11d48", width: 2 } // rose-600
                    },
                    {
                        x: epochs,
                        y: test_roc,
                        type: "scatter",
                        mode: "lines",
                        name: "AUROC",
                        line: { color: "#1e40af", width: 2 } // blue-800
                    },
                    {
                        x: epochs,
                        y: test_acc,
                        type: "scatter",
                        mode: "lines",
                        name: "Accuracy",
                        line: { color: "#059669", width: 2 } // emerald-600
                    }
                ]}
                layout={{
                    autosize: true,
                    xaxis: {
                        title: { text: "Epoch" }
                    },
                    yaxis: {
                        title: { text: "Value" },
                        range: [0, 1]
                    },
                    legend: { x: 0, y: 1.15, orientation: "h" },
                    paper_bgcolor: isDark ? "#1f2937" : "#ffffff",
                    plot_bgcolor: isDark ? "#1f2937" : "#ffffff",
                    font: { color: isDark ? "#f9fafb" : "#111827" },
                    margin: { t: 40, l: 50, r: 20, b: 50 }
                }}
                config={{
                    responsive: true,
                    displayModeBar: false
                }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default PerformanceChart;
