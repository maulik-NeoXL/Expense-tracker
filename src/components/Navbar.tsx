"use client";

import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useApi";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { toast } = useToast();
  const { profileData } = useProfile();
  
  // Dynamic username from profile data
  const username = profileData?.name || "User";
  
  const getCurrencyFlag = (curr: string) => {
    const flags: { [key: string]: string } = {
      USD: "🇺🇸",
      EUR: "🇪🇺",
      GBP: "🇬🇧",
      JPY: "🇯🇵",
      CAD: "🇨🇦",
      AUD: "🇦🇺",
      INR: "🇮🇳",
    };
    return flags[curr] || "💵";
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    toast({
      title: "Currency Updated!",
      description: `All amounts will now be displayed in ${newCurrency}.`,
    });
  };
  
  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Hello, {username}</h1>
      </div>
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* CURRENCY MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="text-base">{getCurrencyFlag(currency)}</span>
              {currency}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCurrencyChange("USD")} className="flex items-center gap-3">
              <span className="text-lg">🇺🇸</span>
              <div>
                <div className="font-medium">USD</div>
                <div className="text-xs text-muted-foreground">US Dollar</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCurrencyChange("EUR")} className="flex items-center gap-3">
              <span className="text-lg">🇪🇺</span>
              <div>
                <div className="font-medium">EUR</div>
                <div className="text-xs text-muted-foreground">Euro</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCurrencyChange("GBP")} className="flex items-center gap-3">
              <span className="text-lg">🇬🇧</span>
              <div>
                <div className="font-medium">GBP</div>
                <div className="text-xs text-muted-foreground">British Pound</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCurrencyChange("JPY")} className="flex items-center gap-3">
              <span className="text-lg">🇯🇵</span>
              <div>
                <div className="font-medium">JPY</div>
                <div className="text-xs text-muted-foreground">Japanese Yen</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCurrencyChange("CAD")} className="flex items-center gap-3">
              <span className="text-lg">🇨🇦</span>
              <div>
                <div className="font-medium">CAD</div>
                <div className="text-xs text-muted-foreground">Canadian Dollar</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCurrencyChange("AUD")} className="flex items-center gap-3">
              <span className="text-lg">🇦🇺</span>
              <div>
                <div className="font-medium">AUD</div>
                <div className="text-xs text-muted-foreground">Australian Dollar</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCurrencyChange("INR")} className="flex items-center gap-3">
              <span className="text-lg">🇮🇳</span>
              <div>
                <div className="font-medium">INR</div>
                <div className="text-xs text-muted-foreground">Indian Rupee</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
