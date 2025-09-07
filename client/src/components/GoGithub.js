import { FaGithub } from "react-icons/fa";
const GoGithub = () => {
    return (
        <button
            onClick={()=>{
                window.open("https://github.com/ohgwanghoon/CapStoneDesign1_14");
            }}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
            <FaGithub size={20}/>
        </button>
    )
}
export default GoGithub;