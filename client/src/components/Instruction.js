import {MessageCircleQuestion} from "lucide-react";

const Instruction = () => {
    return (
        <div
            className="relative group p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            <MessageCircleQuestion size={20}/>

            {/* 툴팁 */}
            <div
                className="pointer-events-none absolute right-0 top-full mt-2 w-[50vw] break-words p-4 text-sm bg-black text-white dark:bg-white dark:text-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md">
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
        </div>
    );
};

export default Instruction;
