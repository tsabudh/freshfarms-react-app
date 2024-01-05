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
            backgroundColor: 'rgba(54, 235, 211, 0.88)',
            // hoverBorderColor: 'rgba(255,99,132,1)',
            border:null,
            borderWidth:1,
        },
        {
            label: 'Stock',
            data: [214, 198, 200, 200, 198, 198],
            backgroundColor: 'rgb(192, 236, 233)',
            border:null,
            borderWidth:1,
            // borderColor: [null],
            // hoverBorderColor: 'rgba(255,99,132,1)',
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

function BarChart(props) {
    const { products, setProducts } = props;
    // const [products, setProducts] = useState([]);
    useEffect(() => {
        const wrapperFunc = async function () {
            //- Modifying chartData after fetching products
            chartData.labels = products.map((product) => {
                let words = product.name.split(' ');
                words = words.map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1)
                );
                return words.join(' ');
            });
            console.log(chartData.datasets[0].data);
            chartData.datasets[0].data = products.map((item) => {
                if (item.sales) return item.sales;
                else return 0;
            });
            chartData.datasets[1].data = products.map((item) => {
                if (item.stock) return item.stock;
                else return 0;
            });
            console.log(chartData.datasets);
        };
        wrapperFunc();
    }, [products]);

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
