import {useEffect, useState} from 'react';
import PredictForm from './components/PredictForm';
import ScatterPlot from './components/ScatterPlot';
import DTITable from './components/DTITable';
import DarkModeToggle from './components/DarkModeToggle';
import {AnimatePresence, motion} from "framer-motion";
import {Fullscreen, X, ArrowUpFromLine, MessageCircleQuestion} from 'lucide-react';
import {useModelVersion} from "./contexts/ModelVersionContext";
import VersionSelector from "./components/VersionSelector";
import PerformanceChart from "./components/PerformanceChart";
import Instruction from "./components/Instruction";
import CardModal from "./components/CardModal";
import GoGithub from "./components/GoGithub";
import VersionSummary from "./components/VersionSummary";
import axios from "axios"; // 새로 분리한 모달 컴포넌트

export default function App() {
    const versionDescriptions = {
        "v1": {
            name: "v1 (Basic)",
            description: "이 버전은 임베딩을 무작위(Random)로 초기화하였고, 하이퍼파라미터로는 학습률 0.0001과 10000 epoch를 사용하였습니다. 모델 구조는 기본 HAN(Heterogeneous Attention Network)을 적용하였습니다.",
        },
        "v2": {
            name: "v2 (Sequence String Based Initial Embedding Improved)",
            description: "이 버전에서는 초기 약물 임베딩에 Morgan Fingerprint 방법을 적용하였고, 단백질 임베딩에는 ESM-2를 사용하였습니다. 하이퍼파라미터는 학습률 0.xxxx와 xxxx epoch로 설정하였습니다.",
        },
        "v3": {
            name: "v3 (Similarity Matrix Based Initial Embedding Improved)",
            description: "이 버전에서는 초기 임베딩에 Similarity Matrix를 사용하였습니다. 학습률은 0.xxxx로 설정하였고, early stopping 기법과 더 확장된 MLP 레이어를 적용하였습니다.",
        },
    };
    const {version} = useModelVersion();
    const [predictState, setPredictState] = useState({
        drugInput: '',
        proteinInput: '',
        result: null,
        errors: {drug: false, protein: false, notFound: false}
    });
    const [data, setData] = useState({
        predictions: [],
        embedding: [],
        performance: [],
    });

    const cards = [
        {
            key: 'predict', title: '🔍 Predict Drug-Target Interaction', component: (
                <PredictForm
                    data={data.predictions}
                    predictState={predictState}
                    setPredictState={setPredictState}
                    version={version}
                />
            )
        },
        {key: 'table', title: '📋 Top 10 Predicted Interactions', component: <DTITable data={data.predictions}/>},
        {key: 'scatter', title: '🧠 Node Embedding', component: <ScatterPlot data={data.embedding}/>},
        {key: 'graph', title: `📊 Model Evaluation (${version})`, component: <PerformanceChart data={data.performance}/>}
    ];

    const [activeIndex, setActiveIndex] = useState(-1); // -1이면 전체화면X
    const [direction, setDirection] = useState(0); // 1: 다음, -1: 이전, 0: 고정

    // scroll 관련
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((scrollY / scrollHeight) * 100);
            setShowScrollTop(scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [pred, embed, perf] = await Promise.all([
                    import(`./data/${version}/predictions.json`),
                    import(`./data/${version}/embedding.json`),
                    import(`./data/${version}/performance.json`)
                ]);
                setData({
                    predictions: pred.default,
                    embedding: embed.default,
                    performance: perf.default
                });
            } catch (e) {
                console.error("데이터 로드 실패:", e);
            }
        };

        loadData();

    }, [version]);


// 사용 예

    return (
        <div className={activeIndex !== -1 ? 'overflow-hidden' : ''}>
            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
                <div
                    style={{width: `${scrollProgress}%`}}
                    className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-150"
                />
            </div>

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all p-6">
                <header className="grid grid-cols-3 w-full items-center max-w-[1600px] mx-auto mb-4">
                    <div></div>
                    <div className="flex flex-col items-center mb-4">
                        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">
                            💊 DTI Visualization
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Heterogeneous Graph-based interaction analytics
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-6">
                        <VersionSelector/>
                        <GoGithub/>
                        <DarkModeToggle/>
                        <Instruction/>
                    </div>
                    {version && versionDescriptions[version] && (
                        <VersionSummary
                            version={version}
                            versionDescriptions={versionDescriptions}
                            data={data}
                        />

                    )}

                </header>

                {activeIndex === -1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
                        {cards.map((card, idx) => (
                            <div className="h-[650px]">
                                <Card
                                    key={card.key}
                                    title={card.title}
                                    layoutId={card.key}
                                    onFullscreen={() => {
                                        setDirection(0);
                                        setActiveIndex(idx);
                                    }}
                                >
                                    {card.component}
                                </Card>
                            </div>
                        ))}
                    </div>)}
            </div>
            {/* 풀스크린 카드 모달 */}
            {activeIndex !== -1 && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <CardModal
                            key={cards[activeIndex].key}
                            card={cards[activeIndex]}
                            activeIndex={activeIndex}
                            cards={cards}
                            direction={direction}
                            setDirection={setDirection}
                            setActiveIndex={setActiveIndex}
                        />
                    </AnimatePresence>
                </div>
            )}


            {/* Scroll to top button */}
            <motion.button
                initial={{opacity: 1, scale: 0.9}}
                animate={{opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.9}}
                transition={{duration: 0.3}}
                onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                className="fixed bottom-5 right-5 z-10 p-3 rounded-full shadow-xl bg-gray-800 dark:bg-white dark:text-black hover:bg-gray-700 text-white transition-all"
                aria-label="Scroll to top"
            >
                <ArrowUpFromLine className="w-5 h-5"/>
            </motion.button>
        </div>
    );
}

function Card({title, children, onFullscreen, layoutId}) {
    return (
        <motion.div
            layoutId={layoutId}
            className="relative h-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-2xl shadow-lg p-4 border border-gray-200 overflow-hidden"
        >
            <button
                onClick={onFullscreen}
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                title="전체화면 보기"
            >
                <Fullscreen/>
            </button>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            {children}
        </motion.div>
    );
}
