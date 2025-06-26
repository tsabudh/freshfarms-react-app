import React from 'react';

export default function IconWork(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
            xmlSpace="preserve"
            {...props}
        >
            <g>
                <path
                    className="duotone_twee"
                    fill="currentColor"
                    data-path="middle"
                    opacity={0.8}
                    d="M12,21h8v1h-8V21z M27.5,10h-23C4.225,10,4,10.205,4,10.48V21h7v-0.5c0-0.276,0.224-0.5,0.5-0.5h9
           c0.276,0,0.5,0.224,0.5,0.5V21h7V10.48C28,10.205,27.775,10,27.5,10z"
                />
                <path
                    className="duotone_een"
                    data-path="top-bottom"
                    fill="currentColor"
                    d="M28,22v5.492C28,27.767,27.775,28,27.5,28h-23C4.225,28,4,27.767,4,27.492V22h7v0.5
           c0,0.276,0.224,0.5,0.5,0.5h9c0.276,0,0.5-0.224,0.5-0.5V22H28z M19.5,5h-7C10.156,5,8,5.758,8,9.996h2C10,6.977,11.146,7,12.5,7h7
           C20.854,7,22,6.977,22,9.996h2C24,5.758,21.844,5,19.5,5z"
                />
            </g>
        </svg>
    );
}
