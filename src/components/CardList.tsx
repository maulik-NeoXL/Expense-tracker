"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SiUpwork, SiNetflix, SiSpotify, SiApple, SiGithub } from "react-icons/si";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useExpenses, useIncomes } from "@/hooks/useApi";

const popularContent = [
  {
    id: 1,
    title: "JavaScript Tutorial",
    badge: "Coding",
    image:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 4300,
  },
  {
    id: 2,
    title: "Tech Trends 2025",
    badge: "Tech",
    image:
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 3200,
  },
  {
    id: 3,
    title: "The Future of AI",
    badge: "AI",
    image:
      "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2400,
  },
  {
    id: 4,
    title: "React Hooks Explained",
    badge: "Coding",
    image:
      "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1500,
  },
  {
    id: 5,
    title: "Image Generation with AI",
    badge: "AI",
    image:
      "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1200,
  },
];

const CardList = ({ title }: { title: string }) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { formatCurrency } = useCurrency();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { incomes, loading: incomesLoading } = useIncomes();
  
  const getSortedTransactions = () => {
    // Combine expenses and incomes into one array
    const allTransactions = [
      ...expenses.map(expense => ({
        id: expense.id,
        transaction: expense.description || 'No description',
        type: expense.category.name,
        amount: expense.amount,
        date: expense.date,
        sortDate: new Date(expense.date),
        status: "debited" as const,
        categoryColor: expense.category.color || '#3B82F6',
      })),
      ...incomes.map(income => ({
        id: income.id,
        transaction: income.description || 'No description',
        type: income.source?.name || income.category?.name || 'Income',
        amount: income.amount,
        date: income.date,
        sortDate: new Date(income.date),
        status: "credited" as const,
        categoryColor: income.source?.color || income.category?.color || '#3B82F6',
      }))
    ];

    return allTransactions.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.sortDate.getTime() - a.sortDate.getTime();
      } else {
        return a.sortDate.getTime() - b.sortDate.getTime();
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  if (title === "Latest Transactions") {
    const sortedTransactions = getSortedTransactions();
    const isLoading = expensesLoading || incomesLoading;
    
    return (
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-medium">Transaction history</h1>
          <div className="flex gap-2">
            <Button
              variant={sortOrder === "newest" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOrder("newest")}
              className={sortOrder === "newest" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}
            >
              Newest
            </Button>
            <Button
              variant={sortOrder === "oldest" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOrder("oldest")}
              className={sortOrder === "oldest" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}
            >
              Oldest
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Transactions Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Start adding expenses and income to see your transaction history here.</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="flex mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex-1 text-sm font-medium text-gray-500 dark:text-gray-400">Transaction</div>
              <div className="flex-1 text-sm font-medium text-gray-500 dark:text-gray-400">Category</div>
              <div className="flex-1 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</div>
              <div className="flex-1 text-sm font-medium text-gray-500 dark:text-gray-400">Date</div>
              <div className="w-24 text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
            </div>
            
            {/* Transaction Rows */}
            <div className="space-y-3">
              {sortedTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 -mx-2 transition-colors duration-200">
                  <div className="flex-1 flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: transaction.categoryColor + '20' }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: transaction.categoryColor }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.transaction}</span>
                  </div>
                  <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">{transaction.type}</div>
                  <div className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span className={transaction.status === "credited" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {transaction.status === "credited" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">{formatDate(transaction.date)}</div>
                  <div className="w-24">
                    <Badge 
                      variant={transaction.status === "credited" ? "default" : "secondary"}
                      className={transaction.status === "credited" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"}
                    >
                      {transaction.status === "credited" ? "Credited" : "Debited"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {popularContent.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Badge variant="secondary">{item.badge}</Badge>
            </CardContent>
            <CardFooter className="p-0">{item.count / 1000}K</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
