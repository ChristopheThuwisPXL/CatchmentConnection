import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

export function Github(){
    return (
        <Button variant="outline" size="icon">
            <a
            aria-label="View on GitHub"
            href="https://github.com/ChristopheThuwisPXL/CatchmentConnection"
            target="_blank"
            >
            <FaGithub className="h-[1.2rem] w-[1.2rem]"/>
            </a>
        </Button>
    );
}