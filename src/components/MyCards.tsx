"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";

const MyCards = () => {
  const cards = [
    {
      id: 1,
      company: "Franklin Mgmt Inc",
      number: "**** 2076",
      color: "bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600",
    },
    {
      id: 2,
      company: "Valiant Capital Mgmt LP",
      number: "**** 2076",
      color: "bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-500",
    },
    {
      id: 3,
      company: "Valiant Capital Mgmt LP",
      number: "**** 2076",
      color: "bg-gradient-to-br from-teal-600 via-teal-700 to-green-600",
    },
  ];

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Your Card</h1>
        <p className="text-sm text-gray-600">Stay ahead of your payments</p>
      </div>
      
      {/* Stacked Cards */}
      <div className="relative mb-6 h-48">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`${card.color} text-white rounded-2xl p-5 h-40 w-full absolute shadow-xl border border-white/20`}
            style={{
              transform: `translateX(${index * 12}px) translateY(${index * 12}px)`,
              zIndex: cards.length - index,
            }}
          >
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                {/* Chip Icon */}
                <div className="w-10 h-7 bg-gradient-to-br from-orange-400 to-orange-500 rounded-md flex items-center justify-center shadow-sm">
                  <div className="w-6 h-4 bg-gradient-to-br from-orange-300 to-orange-400 rounded-sm"></div>
                </div>
                {/* Grid Icon */}
                <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="text-sm font-medium opacity-90">{card.company}</div>
                <div className="text-sm font-mono tracking-wider">{card.number}</div>
              </div>
            </div>
            
            {/* Subtle shine effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          </div>
        ))}
      </div>
      
      {/* Add Card Button */}
      <div className="flex justify-center mb-6">
        <Button variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-2 text-sm font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-xl font-bold text-gray-900">3</div>
          <div className="text-xs text-gray-600 font-medium">Active Cards</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-xl font-bold text-gray-900">$24,900</div>
          <div className="text-xs text-gray-600 font-medium">Total Balance</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-xl font-bold text-gray-900">$5,200</div>
          <div className="text-xs text-gray-600 font-medium">Total Outstanding</div>
        </div>
      </div>
    </div>
  );
};

export default MyCards;
