import React from "react";
function BouncingCircles(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="15"
            width={props.width}
            height={props.height}
            
        >
            <circle r="15" cx="40" cy="65">
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="2"
                    values="65;135;65;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4"
                />
            </circle>
            <circle r="15" cx="100" cy="65">
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="2"
                    values="65;135;65;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2"
                />
            </circle>
            <circle r="15" cx="160" cy="65">
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="2"
                    values="65;135;65;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0"
                />
            </circle>
        </svg>
    );
}
export default BouncingCircles;
