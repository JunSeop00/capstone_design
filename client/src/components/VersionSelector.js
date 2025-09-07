import { useModelVersion } from "../contexts/ModelVersionContext";
import { ChevronDown } from "lucide-react";

const VersionSelector = () => {
    const { version, setVersion } = useModelVersion();

    return (
        <div className="relative inline-block w-40 text-left">
            <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="appearance-none w-full bg-gray-200 dark:bg-gray-700  border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 py-2 pl-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
                <option value="random">Model v1</option>
                <option value="pretrained">Model v2</option>
                <option value="similarity">Model v3</option>
                <option value="auto_encoder">Model v4</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </div>
        </div>
    );
};

export default VersionSelector;
