import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Wallet, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight, TrendingUp } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { User, Account, Transaction } from '../App';

type DashboardProps = {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  onNavigate: (page: 'dashboard' | 'transfer' | 'transactions' | 'profile' | 'analytics') => void;
  onLogout: () => void;
};

export default function Dashboard({ user, accounts, transactions, onNavigate, onLogout }: DashboardProps) {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-white/5 backdrop-blur-sm">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Overview of your accounts and recent activity</p>
            </div>

            {/* Total Balance Card */}
            <Card className="bg-gradient-to-br from-sky-400 to-blue-500 text-white border-0 shadow-lg">
              <CardHeader>
                <CardDescription className="text-blue-100">Total Balance</CardDescription>
                <CardTitle className="text-white">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="bg-white text-blue-700 hover:bg-blue-50 shadow-md"
                    onClick={() => onNavigate('transfer')}
                  >
                    <ArrowLeftRight size={16} className="mr-2" />
                    Transfer
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white hover:text-blue-700 transition-all shadow-md"
                    onClick={() => onNavigate('transactions')}
                  >
                    View Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Cards */}
            <div>
              <h2 className="text-slate-900 mb-4">Your Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                  <Card key={account.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardDescription>{account.accountType} Account</CardDescription>
                          <CardTitle className="mt-1">{account.accountNumber}</CardTitle>
                        </div>
                        <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                          <Wallet className="text-sky-600" size={24} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-900">
                        ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h2 className="text-slate-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-slate-700">Total Deposits</CardTitle>
                    <ArrowUpCircle className="text-green-600" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-900">
                      ₹{transactions
                        .filter(t => t.type === 'Deposit')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-slate-500 mt-1">
                      {transactions.filter(t => t.type === 'Deposit').length} transactions
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-slate-700">Total Withdrawals</CardTitle>
                    <ArrowDownCircle className="text-red-600" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-900">
                      ₹{transactions
                        .filter(t => t.type === 'Withdraw')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-slate-500 mt-1">
                      {transactions.filter(t => t.type === 'Withdraw').length} transactions
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-slate-700">Total Transfers</CardTitle>
                    <TrendingUp className="text-blue-600" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-900">
                      ₹{transactions
                        .filter(t => t.type === 'Transfer')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-slate-500 mt-1">
                      {transactions.filter(t => t.type === 'Transfer').length} transactions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Transactions</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'Deposit' ? 'bg-green-100' :
                          transaction.type === 'Withdraw' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {transaction.type === 'Deposit' ? (
                            <ArrowUpCircle className="text-green-600" size={20} />
                          ) : transaction.type === 'Withdraw' ? (
                            <ArrowDownCircle className="text-red-600" size={20} />
                          ) : (
                            <ArrowLeftRight className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div>
                          <div className="text-slate-900">{transaction.description || transaction.type}</div>
                          <div className="text-slate-500">{transaction.date}</div>
                        </div>
                      </div>
                      <div className={`${
                        transaction.type === 'Deposit' ? 'text-green-600' :
                        transaction.type === 'Withdraw' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {transaction.type === 'Deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}