import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ArrowUpCircle, ArrowDownCircle, ArrowLeftRight, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { User, Account, Transaction } from '../App';

type TransactionsPageProps = {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  onNavigate: (page: 'dashboard' | 'transfer' | 'transactions' | 'profile' | 'analytics') => void;
  onLogout: () => void;
};

export default function TransactionsPage({ 
  user, 
  accounts, 
  transactions, 
  onNavigate, 
  onLogout 
}: TransactionsPageProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((transaction) => {
    const accountMatch = selectedAccount === 'all' || true; // In a real app, transactions would be linked to accounts
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    return accountMatch && typeMatch;
  });

  const handleExport = () => {
    toast.success('Transactions exported successfully!');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <ArrowUpCircle className="text-green-600" size={20} />;
      case 'Withdraw':
        return <ArrowDownCircle className="text-red-600" size={20} />;
      case 'Transfer':
        return <ArrowLeftRight className="text-blue-600" size={20} />;
      default:
        return null;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Deposit</Badge>;
      case 'Withdraw':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Withdraw</Badge>;
      case 'Transfer':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Transfer</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white/5 backdrop-blur-sm">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar currentPage="transactions" onNavigate={onNavigate} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-slate-900 mb-2">Transaction History</h1>
                <p className="text-slate-600">View all your transactions</p>
              </div>
              <Button onClick={handleExport} className="gap-2">
                <Download size={16} />
                Export CSV
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter transactions by account or type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-700">Account</label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.accountType} ({account.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-700">Transaction Type</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Deposit">Deposits</SelectItem>
                        <SelectItem value="Withdraw">Withdrawals</SelectItem>
                        <SelectItem value="Transfer">Transfers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Balance After</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getTransactionIcon(transaction.type)}
                                {getTransactionBadge(transaction.type)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-slate-900">{transaction.description || transaction.type}</div>
                                {transaction.toAccount && (
                                  <div className="text-slate-500">To: {transaction.toAccount}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={
                                transaction.type === 'Deposit' ? 'text-green-600' :
                                transaction.type === 'Withdraw' ? 'text-red-600' :
                                'text-blue-600'
                              }>
                                {transaction.type === 'Deposit' ? '+' : '-'}₹
                                {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-slate-700">
                              ₹{transaction.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}