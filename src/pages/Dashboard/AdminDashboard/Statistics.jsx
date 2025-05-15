
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FcStatistics } from "react-icons/fc";

const COLORS = ['#10B981', '#FBBF24', '#EF4444', '#6366F1', '#3B82F6'];

const Statistics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/statistics');
      return res.data;
    },
  });

  const {
    totalProducts = 0,
    acceptedProducts = 0,
    pendingProducts = 0,
    totalUsers = 0,
    totalReviews = 0,
  } = stats;

  const chartData = [
    { name: 'Accepted Products', value: acceptedProducts },
    { name: 'Pending Products', value: pendingProducts },
    { name: 'All Products', value: totalProducts },
    { name: 'Total Reviews', value: totalReviews },
    { name: 'Total Users', value: totalUsers },
  ];

  return (
    <div className="p-6 md:p-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"> <FcStatistics className='w-8 h-8' /> Admin Statistics</h2>
      <div className="h-[400px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
