import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import fetchProducts from '../../../utils/fetchProducts';

import styles from './BarChart.module.scss';
let chartData = {
    labels: [
        'Paneer',
        'Yogurt',
        'Cow Milk',
        'Buffalo Milk',
        'Mixed Milk',
        'Kurauni',
    ],
    datasets: [
        {
            label: 'Sold',
            data: [100, 100, 100, 100, 102, 102],
            borderWidth: 1,
            backgroundColor: 'rgb(166, 238, 124)',
            hoverBorderColor: 'rgba(255,99,132,1)',
        },
        {
            label: 'Stock',
            backgroundColor: 'rgb(186, 230, 227)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [214, 198, 200, 200, 198, 198],
        },
    ],
};
let chartOptions = {
    scales: {
        y: {
            suggestedMax: 150,
            // stacked: true,
            beginAtZero: true,
            border: {
                color: 'white',
            },
            grid: {
                color: null,
            },
            ticks: {
                color: 'white',
                border: {
                    color: 'white',
                },
            },
        },
        x: {
            stacked: true,
            border: {
                color: 'white',
            },
            grid: {
                color: null,
            },
            ticks: {
                color: 'white',
            },
        },
    },
    plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            },
        },
        tooltip: {
            enabled: true,
        },
    },
};

function BarChart() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const wrapperFunc = async function () {
            let responseData = await fetchProducts();
            console.log(responseData);

            if (responseData) {
                setProducts(responseData);
            }

            //- Modifying chartData after fetching products
            chartData.labels = responseData.map((product) => product.name);
            console.log(chartData.datasets[0].data);
            chartData.datasets[0].data = responseData.map((item) => {
                if (item.sales) return item.sales;
                else return 0;
            });
            console.log(chartData.datasets);
        };
        wrapperFunc();
    }, []);

    useEffect(() => {
        const ctx = document.getElementById('myChart');

        let myChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions,
        });

        return () => {
            if (myChart) myChart.destroy();
        };
    });
    return (
        <div className={styles['chart-container']}>
            <canvas id="myChart" />
        </div>
    );
}

export default BarChart;
