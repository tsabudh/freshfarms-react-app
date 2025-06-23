import React from 'react';

export default function IconOfficeV2(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 800 800"
            {...props}
        >
            <polygon
                fill="currentColor"
                points="700,750 700,200 550,200 550,50 100,50 100,750 0,750 0,800 350,800 350,650 450,650 450,800 800,800 
       800,750 "
            />
            <path
                fill="#ffffff"
                data-path="big-windows"
                d="M300,550H200V450h100V550z M300,400H200V300h100V400z M300,250H200V150h100V250z M450,550H350V450h100V550z
        M450,400H350V300h100V400z M450,250H350V150h100V250z"
            />
            <path
                data-path="small-windows"
                fill="#ffffff"
                d="M650,550H550V450h100V550z M650,400H550V300h100V400z"
            />
        </svg>
    );
}
