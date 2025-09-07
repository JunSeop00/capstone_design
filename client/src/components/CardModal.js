import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const swipeVariants = {
    enter: (direction) => ({
        x: direction === 1 ? 500 : direction === -1 ? -500 : 0,
        opacity: 0.7,
        scale: 0.97,
        position: "absolute"
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        position: "relative"
    },
    exit: (direction) => ({
        x: direction === 1 ? -500 : direction === -1 ? 500 : 0,
        opacity: 0,
        scale: 0.97,
        position: "absolute"
    }),
};

export default function CardModal({
                                      card,
                                      activeIndex,
                                      cards,
                                      direction,
                                      setDirection,
                                      setActiveIndex,
                                  }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // 초기 판단
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <motion.div
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(e, info) => {
                if (!isMobile) return;
                if (info.offset.x < -150 && activeIndex < cards.length - 1) {
                    setDirection(1);
                    setActiveIndex(activeIndex + 1);
                } else if (info.offset.x > 150 && activeIndex > 0) {
                    setDirection(-1);
                    setActiveIndex(activeIndex - 1);
                } else {
                    setDirection(0);
                }
            }}
            style={{ willChange: "transform" }}
            className="w-full max-w-[90vw] h-full max-h-[90vh] bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl overflow-auto scrollbar p-6 relative"
        >
            {/* 닫기 버튼 */}
            <button
                onClick={() => setActiveIndex(-1)}
                className="absolute top-4 right-4 text-black hover:text-white hover:bg-red-500 dark:text-white text-sm p-1 rounded"
            >
                <X />
            </button>

            {/* 상단 힌트/인디케이터 */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 select-none">
                <span
                    className={
                        "px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer " +
                        (activeIndex > 0
                            ? "bg-gray-200 dark:bg-gray-700 text-blue-500 hover:bg-blue-100 active:scale-95"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default pointer-events-none")
                    }
                    onClick={() => {
                        if (activeIndex > 0) {
                            setDirection(-1);
                            setActiveIndex(activeIndex - 1);
                        }
                    }}
                >
                    {activeIndex > 0 ? "← 이전" : "  "}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activeIndex + 1} / {cards.length}
                </span>
                <span
                    className={
                        "px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer " +
                        (activeIndex < cards.length - 1
                            ? "bg-gray-200 dark:bg-gray-700 text-blue-500 hover:bg-blue-100 active:scale-95"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default pointer-events-none")
                    }
                    onClick={() => {
                        if (activeIndex < cards.length - 1) {
                            setDirection(1);
                            setActiveIndex(activeIndex + 1);
                        }
                    }}
                >
                    {activeIndex < cards.length - 1 ? "다음 →" : "  "}
                </span>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 mt-8 mb-2">
                <div
                    className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${((activeIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            <h2 className="text-2xl font-semibold my-5">
                {card?.title}
            </h2>
            {card?.component}
        </motion.div>
    );
}
