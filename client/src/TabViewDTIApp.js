import React, {useState, useEffect} from 'react';
import {useModelVersion} from './contexts/ModelVersionContext';
import VersionSelector from './components/VersionSelector';
import DarkModeToggle from './components/DarkModeToggle';
import Instruction from './components/Instruction';
import PredictForm from './components/PredictForm';
import DTITable from './components/DTITable';
import ScatterPlot from './components/ScatterPlot';
import PerformanceChart from './components/PerformanceChart';
import VersionSummary from './components/VersionSummary';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Fullscreen, Menu, MessageCircleQuestion, Moon, Sun, X} from 'lucide-react';
import GoGithub from './components/GoGithub';
import CardModal from './components/CardModal';
import {getLog} from './api';
import useDarkMode from "./hooks/useDarkMode";
import {FaGithub} from "react-icons/fa";

const TABS = ['Predict', 'Table', 'Embedding', 'Evaluation'];

export default function TabViewDTIApp() {
    const {isDark, toggleDarkMode} = useDarkMode();
    const {version} = useModelVersion();
    const [loading, setLoading] = useState(false);
    const [showInstructionModal, setShowInstructionModal] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const [collapsed, setCollapsed] = useState(() => {
        const stored = localStorage.getItem('collapse');
        return stored === null ? true : stored === 'true';
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {setMobileMenuOpen(false); setShowInstructionModal(false);}
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [log, setLog] = useState({
        description: '',
        drug_embeddings: [],
        init_drug_embeddings: [],
        protein_embeddings: [],
        init_protein_embeddings: [],
        history: [],
        best: {acc: 0, epoch: 0, pr: 0, roc: 0},
        score: []
    });
    const [allDrugNames, setAllDrugNames] = useState([]);
    const [allProteinNames, setAllProteinNames] = useState([]);
    const [activeTab, setActiveTab] = useState('Predict');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [direction, setDirection] = useState(0);

    const cards = [
        {
            key: 'Predict',
            title: '🔍 Predict Drug-Target Interaction',
            component: (
                <PredictForm
                    allDrugs={allDrugNames}
                    allProteins={allProteinNames}
                    version={version}
                />
            )
        },
        {
            key: 'Table',
            title: '📋 Top 10 Predicted Interactions',
            component: <DTITable data={Array.isArray(log.score) ? log.score : []}/>
        },
        {
            key: 'Embedding',
            title: '🧠 Node Embedding',
            component: (
                <ScatterPlot
                    drug_embedding={log.drug_embeddings}
                    protein_embedding={log.protein_embeddings}
                    init_drug={log.init_drug_embeddings}
                    init_protein={log.init_protein_embeddings}
                />
            )
        },
        {
            key: 'Evaluation',
            title: `📊 Model Evaluation (${version})`,
            component: (
                <PerformanceChart
                    test_loss={log.history.test_loss}
                    test_roc={log.history.test_roc}
                    test_acc={log.history.test_acc}
                />
            )
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getLog(version);
                setLog({
                    ...log,
                    description: res.description,
                    drug_embeddings: res.drug_tsne_embedding,
                    init_drug_embeddings: res.init_drug_tsne_embedding,
                    protein_embeddings: res.protein_tsne_embedding,
                    init_protein_embeddings: res.init_protein_tsne_embedding,
                    history: res.eval_history,
                    score: res.score
                });
                setAllDrugNames(
                    [...new Set(res.drug_tsne_embedding.map(d => d.drug_name))]
                );
                setAllProteinNames(
                    [...new Set(res.protein_tsne_embedding.map(d => d.protein_name))]
                );
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [version]);

    useEffect(() => {
        localStorage.setItem('collapse', collapsed);
    }, [collapsed]);

    const renderActiveTab = () => {
        const selected = cards.find(c => c.key === activeTab);
        if (!selected) return null;
        return (
            <Card
                key={selected.key}
                title={selected.title}
                layoutId={selected.key}
                onFullscreen={() => {
                    setDirection(0);
                    setActiveIndex(cards.findIndex(c => c.key === activeTab));
                }}
            >
                {selected.component}
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-6">
            {loading && <LoadingOverlay/>}

            <header className="max-w-[1600px] mx-auto mb-6 flex justify-between items-center">
                <div
                    className="pl-2 cursor-pointer"
                    onClick={() => (window.location.href = '/')}
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-400">
                        💊 DTI Visualization
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                        Heterogeneous Graph-based interaction analytics
                    </p>
                </div>

                <div className="hidden sm:flex items-center space-x-6">
                    <VersionSelector/>
                    <GoGithub/>
                    <DarkModeToggle/>
                    <Instruction/>
                </div>

                <button
                    className="sm:hidden p-2 focus:outline-none dark:text-white"
                    onClick={() => setMobileMenuOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </header>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* backdrop (lower z-index) */}
                        <div
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* drawer panel (higher z-index) */}
                        <motion.nav
                            initial={{x: '100%'}}
                            animate={{x: 0}}
                            exit={{x: '100%'}}
                            className="ml-auto w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col z-50"
                        >
                            <button
                                className="self-end mb-6 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X size={20}/>
                            </button>
                            <ul className="flex-1 flex flex-col space-y-4 dark:text-white">
                                <li>
                                    <VersionSelector className="w-full"/>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded menu-item hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => window.open('https://github.com/your-repo', '_blank')}
                                    >
                                        <FaGithub size={20}/>
                                        <span>GitHub</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded menu-item hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={toggleDarkMode}
                                    >
                                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setShowInstructionModal(true)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded menu-item hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <MessageCircleQuestion size={20}/>
                                        <span>Instruction</span>
                                    </button>
                                </li>
                            </ul>
                        </motion.nav>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showInstructionModal && (
                    <motion.div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                                initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <motion.div className="bg-white max-h-[90vh] dark:bg-gray-800 rounded-lg p-6 max-w-md w-full flex flex-col gap-4 overflow-y-auto scrollbar"
                                    initial={{scale: 0.8}} animate={{scale: 1}} exit={{scale: 0.8}}
                                    transition={{ease: 'easeOut'}}>
                            <button className="hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white text-gray-500 self-end p-1 rounded-md"
                                    onClick={() => setShowInstructionModal(false)}><X/></button>
                            <div className="dark:text-white">
                                {/*<p className="font-semibold mb-1">*/}
                                {/*    🎓 캡스톤디자인 프로젝트 소개*/}
                                {/*</p>*/}
                                {/*<br/>*/}
                                <p className="mb-2">
                                    본 웹사이트는 동국대학교 컴퓨터공학과 종합설계 프로젝트의 일환으로 개발되었습니다.
                                    딥러닝 기반 DTI (Drug-Target Interaction) 예측 모델의 시각적 데이터를 제공합니다.
                                </p>
                                <br/>
                                <p className="font-semibold mb-1">👥 팀원</p>
                                <p className="mb-2">
                                    박형준, 오광훈, 원준섭, 이성원 (총 4명)
                                </p>
                                <br/>
                                <p className="font-semibold mb-1">🧪 데이터셋</p>
                                <p className="mb-2">
                                    Luo et al.의 DTI dataset을 기반으로 하며, drug-drug, drug-disease, drug-protein,
                                    protein-disease 관계를 포함한 이종 그래프 데이터입니다.
                                </p>
                                <br/>
                                <p className="font-semibold mb-1">🧠 모델</p>
                                <p className="mb-2">
                                    Heterogeneous Graph Attention Network (HAN)을 기반으로 하여, 다양한 관계를 통합적으로 학습하고
                                    약물-단백질 간 상호작용 점수를 예측합니다.
                                </p>
                                <br/>
                                <p className="font-semibold mb-1">📈 기능</p>
                                <p>
                                    예측 결과 검색, 임베딩 클러스터링, 버전별 성능 비교 기능을 지원합니다.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <VersionSummary
                version={version}
                versionDescriptions={log.description}
                roc={Array.isArray(log.history.best_roc) ? log.history.best_roc[0] : undefined}
                acc={Array.isArray(log.history.best_acc) ? log.history.best_acc[0] : undefined}
                pr={Array.isArray(log.history.best_pr) ? log.history.best_pr[0] : undefined}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <div className="w-full max-w-[1600px] mx-auto mt-6 flex flex-col">
                <TabButtons activeTab={activeTab} onTabClick={setActiveTab}/>
                {renderActiveTab()}

                {activeIndex !== -1 && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                style={{backdropFilter: 'blur(2.5px)'}}
                            >
                                <CardModal
                                    key={cards[activeIndex].key}
                                    card={cards[activeIndex]}
                                    activeIndex={activeIndex}
                                    cards={cards}
                                    direction={direction}
                                    setDirection={setDirection}
                                    setActiveIndex={setActiveIndex}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingOverlay() {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
            <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"/>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-200 animate-pulse">
          데이터를 불러오는 중...
        </span>
            </div>
        </div>
    );
}

function TabButtons({activeTab, onTabClick}) {
    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 border-b border-gray-300 dark:border-gray-700">
            {TABS.map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabClick(tab)}
                    className={`text-sm px-4 py-2 rounded-t-lg font-medium transition-colors ${
                        activeTab === tab
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-white border border-b-0 border-gray-300 dark:border-gray-700'
                            : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

function Card({title, children, onFullscreen, layoutId}) {
    return (
        <motion.div
            layoutId={layoutId}
            className="relative h-full min-h-[550px] bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-b-2xl shadow-lg p-4 border border-gray-200 overflow-hidden"
        >
            <div className="w-full mb-6 flex gap-1 items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                    onClick={onFullscreen}
                    className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                    title="전체화면 보기"
                >
                    <Fullscreen/>
                </button>
            </div>
            {children}
        </motion.div>
    );
}
