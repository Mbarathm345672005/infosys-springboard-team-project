import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { User, Account, Transaction } from '../App';

type TransferPageProps = {
  user: User;
  accounts: Account[];
  onNavigate: (page: 'dashboard' | 'transfer' | 'transactions' | 'profile' | 'analytics') => void;
  onLogout: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
};

export default function TransferPage({ 
  user, 
  accounts, 
  onNavigate, 
  onLogout,
  addTransaction,
  updateAccountBalance 
}: TransferPageProps) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAccountId || !toAccount || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount) {
      toast.error('Invalid account selected');
      return;
    }

    if (fromAccount.balance < transferAmount) {
      toast.error('Insufficient funds');
      return;
    }

    // Update balance
    const newBalance = fromAccount.balance - transferAmount;
    updateAccountBalance(fromAccountId, newBalance);

    // Add transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      type: 'Transfer',
      amount: transferAmount,
      balanceAfter: newBalance,
      description: description || `Transfer to ${toAccount}`,
      toAccount: toAccount,
    };
    addTransaction(transaction);

    toast.success('Transfer completed successfully!');
    
    // Reset form
    setFromAccountId('');
    setToAccount('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-white/5 backdrop-blur-sm">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar currentPage="transfer" onNavigate={onNavigate} />
        
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h1 className="text-slate-900 mb-2">Transfer Funds</h1>
              <p className="text-slate-600">Send money to another account</p>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-slate-900">Transfer Funds</CardTitle>
                <CardDescription>Send money between accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="from-account">From Account</Label>
                    <Select value={fromAccountId} onValueChange={setFromAccountId}>
                      <SelectTrigger id="from-account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.accountType} ({account.accountNumber}) - ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="text-slate-600" size={20} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-account">To Account Number</Label>
                    <Input
                      id="to-account"
                      type="text"
                      placeholder="Enter account number"
                      value={toAccount}
                      onChange={(e) => setToAccount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What's this transfer for?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                    >
                      Transfer Funds
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => onNavigate('dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (accounts.length > 0) {
                      setFromAccountId(accounts[0].id);
                      setAmount('100');
                    }
                  }}
                >
                  ₹100
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (accounts.length > 0) {
                      setFromAccountId(accounts[0].id);
                      setAmount('500');
                    }
                  }}
                >
                  ₹500
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (accounts.length > 0) {
                      setFromAccountId(accounts[0].id);
                      setAmount('1000');
                    }
                  }}
                >
                  ₹1,000
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}