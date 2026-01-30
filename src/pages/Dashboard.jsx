import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, lowStock: 0 });
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error(error);
            return;
        }

        const totalItems = data.length;
        const totalValue = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const lowStock = data.filter(item => item.quantity < 10).length;

        setStats({ totalItems, totalValue, lowStock });

        // Prepare chart data (Distribution by Category)
        const categories = {};
        data.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
        });

        setChartData({
            labels: Object.keys(categories),
            datasets: [
                {
                    label: '# of Products',
                    data: Object.values(categories),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Inventory Value</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalValue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Low Stock Items</h3>
                    <p className={`text-3xl font-bold mt-2 ${stats.lowStock > 0 ? 'text-red-500' : 'text-green-500'}`}>{stats.lowStock}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Inventory by Category</h3>
                    <div className="h-64 flex justify-center">
                        {chartData && <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
