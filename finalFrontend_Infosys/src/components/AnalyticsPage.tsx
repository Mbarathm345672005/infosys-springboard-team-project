import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { User, Account, Transaction } from '../App';

type AnalyticsPageProps = {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  onNavigate: (page: 'dashboard' | 'transfer' | 'transactions' | 'profile' | 'analytics') => void;
  onLogout: () => void;
};

export default function AnalyticsPage({ 
  user, 
  accounts, 
  transactions, 
  onNavigate, 
  onLogout 
}: AnalyticsPageProps) {
  // Calculate totals
  const totalDeposits = transactions
    .filter(t => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'Withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Pie chart data
  const pieData = [
    { name: 'Deposits', value: totalDeposits, color: '#10b981' },
    { name: 'Withdrawals', value: totalWithdrawals, color: '#ef4444' },
  ];

  // Line chart data - balance over time
  const lineData = transactions
    .slice()
    .reverse()
    .map((transaction, index) => ({
      name: transaction.date,
      balance: transaction.balanceAfter,
    }));

  // Get last transaction for comparison
  const lastTransaction = transactions[0];
  const previousTransaction = transactions[1];
  const balanceChange = lastTransaction && previousTransaction 
    ? lastTransaction.balanceAfter - previousTransaction.balanceAfter 
    : 0;

  return (
    <div className="min-h-screen bg-white/5 backdrop-blur-sm">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar currentPage="analytics" onNavigate={onNavigate} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-slate-900 mb-2">Analytics Dashboard</h1>
              <p className="text-slate-600">Insights into your spending and saving patterns</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-slate-700">Total Balance</CardTitle>
                  <DollarSign className="text-teal-600" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">
                    ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-slate-500 mt-1">Across all accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-slate-700">Total Deposited</CardTitle>
                  <TrendingUp className="text-green-600" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">
                    ₹{totalDeposits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-slate-500 mt-1">
                    {transactions.filter(t => t.type === 'Deposit').length} deposits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-slate-700">Total Withdrawn</CardTitle>
                  <TrendingDown className="text-red-600" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900">
                    ₹{totalWithdrawals.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-slate-500 mt-1">
                    {transactions.filter(t => t.type === 'Withdraw').length} withdrawals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-slate-700">Last Transaction</CardTitle>
                  <Activity className="text-blue-600" size={20} />
                </CardHeader>
                <CardContent>
                  <div className={`text-slate-900 ${balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balanceChange >= 0 ? '+' : ''}₹{Math.abs(balanceChange).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-slate-500 mt-1">
                    {lastTransaction ? lastTransaction.date : 'No transactions'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Deposits vs Withdrawals</CardTitle>
                  <CardDescription>Distribution of money in and out</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Balance Over Time</CardTitle>
                  <CardDescription>Track your account balance changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#0d9488" 
                        strokeWidth={2}
                        dot={{ fill: '#0d9488' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Breakdown</CardTitle>
                <CardDescription>Summary of all transaction types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="text-green-600" size={20} />
                      </div>
                      <div>
                        <div className="text-slate-900">Deposits</div>
                        <div className="text-slate-500">
                          {transactions.filter(t => t.type === 'Deposit').length} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600">
                      +₹{totalDeposits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <TrendingDown className="text-red-600" size={20} />
                      </div>
                      <div>
                        <div className="text-slate-900">Withdrawals</div>
                        <div className="text-slate-500">
                          {transactions.filter(t => t.type === 'Withdraw').length} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-red-600">
                      -₹{totalWithdrawals.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="text-slate-900">Net Change</div>
                        <div className="text-slate-500">Total income - expenses</div>
                      </div>
                    </div>
                    <div className={totalDeposits - totalWithdrawals >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {totalDeposits - totalWithdrawals >= 0 ? '+' : ''}₹
                      {Math.abs(totalDeposits - totalWithdrawals).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}