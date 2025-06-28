import React from 'react';

export default function Logo({ cx }:{ cx?: (className: string) => string }) {
    return (
        <svg
            version="1.1"
            id="skd_logo_svg"
            height="1em"
            width="1em"
            viewBox="0 0 371 296"
            xmlSpace="preserve"
        >
            <title>Freshfarms</title>

            <g id="Logo">
                <polyline
                    fill="none"
                    strokeWidth={10}
                    strokeMiterlimit={10}
                    
                    className={cx ? cx('krishna') : 'krishna'}
                    id="logo_id--krishna"
                    stroke="#ff5755"
                    points="353.3,287.5 193,152.2 353.3,16.9 		"
                />
                <polyline
                    fill="none"
                    strokeWidth={10}
                    strokeMiterlimit={10}
                    className={cx ? cx('dairy') : 'dairy'}
                    id="logo_id--dairy"
                    stroke="currentColor"
                    points="202.8,287.5 363.1,152.2 202.8,16.9 		"
                />
                <path
                    className={cx ? cx('shree') : 'shree'}
                    id="logo_id--shree"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeMiterlimit={10}
                    d="M3.3,149.1l77.6-66h0.3L126,46.2C107.6,30.4,98.5,22.3,80.9,6.7L35.1,46.2l46.2,36.9l82.3,69.2L3.3,291.4"
                />
                <line
                    className={cx ? cx('line') : 'line'}
                    id="logo_id--vertical-line"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeMiterlimit={10}
                    x1="178.2"
                    y1="6.7"
                    x2="178.2"
                    y2="291.4"
                />
            </g>
        </svg>
    );
}
