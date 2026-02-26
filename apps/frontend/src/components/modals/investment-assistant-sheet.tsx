
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Bot, User, X, Loader2, Sparkles, Send, ArrowRight, TrendingUp, Newspaper, History, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Input } from '@/components/ui/input';
import { pastInvestments } from '@/data/profile';
import type { Investment } from '@/types';
import toast from 'react-hot-toast';


type Message = {
  role: 'user' | 'bot';
  content: string | Investment[];
};

type View = 'home' | 'chat';

const prebuiltTasks = [
    { title: 'Suggest a Portfolio', icon: TrendingUp, action: 'suggest_portfolio', color: 'text-green-500' },
    { title: 'Analyze a Cluster', icon: Sparkles, action: 'analyze_cluster', color: 'text-purple-500' },
    { title: 'Market News', icon: Newspaper, action: 'market_news', color: 'text-blue-500' },
    { title: 'Investment History', icon: History, action: 'history', color: 'text-orange-500' },
]

export function InvestmentAssistantSheet({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<View>('home');
  const [historyQuestion, setHistoryQuestion] = useState('');

  const steps = [
    { key: 'investmentAmount', question: 'How much are you looking to invest?', type: 'number' },
    { key: 'riskTolerance', question: 'What is your risk tolerance?', options: ['low', 'medium', 'high'] },
    { key: 'investmentGoals', question: 'What are your main investment goals?' },
  ];
  
  const resetChat = () => {
    setMessages([]);
    setStep(0);
    setHistoryQuestion('');
  };

  const handleStep = async (value: string | number) => {
    let newMessages: Message[] = [...messages, { role: 'user', content: String(value) }];

    if (step < steps.length - 1) {
      setStep(step + 1);
      newMessages.push({ role: 'bot', content: steps[step + 1].question });
    } else {
      setIsLoading(true);
      newMessages.push({ role: 'bot', content: "Got it! Analyzing the best portfolio for you..."});
      setMessages(newMessages);

    }
    setMessages(newMessages);
  };

  const startPortfolioSuggestion = () => {
    resetChat();
    setView('chat');
    setMessages([{ role: 'bot', content: steps[0].question }]);
  };
  
  const startHistoryAnalysis = async () => {
    resetChat();
    setView('chat');
    setIsLoading(true);
    setMessages([
        { role: 'bot', content: "Let me pull up your investment history..." },
    ]);

    // Simulate a brief delay for fetching data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMessages([
        { role: 'bot', content: "Here's a summary of your past investments. What would you like to know?" },
        { role: 'bot', content: pastInvestments }
    ]);
    setIsLoading(false);
    setStep(steps.length); // To show the history question input
  };



  const handleTaskClick = (action: string) => {
    if(action === 'suggest_portfolio') {
        startPortfolioSuggestion();
    } else if (action === 'history') {
        startHistoryAnalysis();
    } else {
        toast.success('This feature is not yet implemented.')
    }
  }

  const renderMessageContent = (message: Message) => {
    if (typeof message.content === 'string') {
      return <p>{message.content}</p>;
    }

    if (Array.isArray(message.content)) {
        const history = message.content as Investment[];
        return (
            <div className="space-y-2">
                {history.map(inv => (
                    <Card key={inv.id} className="bg-background/70">
                         <CardContent className="p-2">
                             <div className="flex justify-between items-center">
                                 <div>
                                     <p className="font-bold text-sm">{inv.name}</p>
                                     <p className="text-xs text-muted-foreground">Invested: ₦{inv.amountInvested.toLocaleString()}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-semibold text-sm text-primary">+₦{(inv.return || 0).toLocaleString()}</p>
                                     <p className="text-xs text-muted-foreground">{inv.date}</p>
                                 </div>
                             </div>
                         </CardContent>
                    </Card>
                ))}
            </div>
        )
    }
    

    return (
        <div className="space-y-4">
          <p className="font-semibold text-lg">{message.content}</p>
        </div>
    );
  };
  
  const renderHomeView = () => (
    <div className="flex flex-col h-full p-4">
        <h2 className="text-4xl font-bold font-body mb-2">
            How may I help <br /> you today?
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
            Your personal investment buddy <br/> for smarter decisions.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
            {prebuiltTasks.map((task) => {
                const Icon = task.icon;
                return (
                    <Card key={task.action} className="bg-card cursor-pointer hover:bg-muted" onClick={() => handleTaskClick(task.action)}>
                        <CardContent className="p-4">
                            <div className="flex flex-col justify-between h-full">
                                <Icon className={cn("h-6 w-6 mb-4", task.color)} />
                                <p className="font-semibold">{task.title}</p>
                                <ArrowRight className="h-4 w-4 self-end text-muted-foreground mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
        <Button size="lg" variant="outline" onClick={() => handleTaskClick('new_chat')}>
            <MessageSquare className="mr-2 h-4 w-4" /> Start a New Chat
        </Button>
    </div>
  );

  const renderChatView = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
            {message.role === 'bot' && (
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            )}
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-3", 
                message.role === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground'
            )}>
              {renderMessageContent(message)}
            </div>
             {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                 <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5" />
                 </div>
                 <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span>Analyzing...</span>
                </div>
            </div>
        )}
      </div>

      {messages.length > 0 && !isLoading && (
        <div className="p-4 bg-background border-t space-y-3">
          {step < steps.length ? (
            <>
                {steps[step].options ? (
                    <div className="grid grid-cols-3 gap-2">
                    {steps[step].options?.map(option => (
                        <Button key={option} variant="outline" size="lg" className="capitalize" onClick={() => handleStep(option)}>{option}</Button>
                    ))}
                    </div>
                ) : (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const value = formData.get(steps[step].key) as string;
                        if (value) handleStep(steps[step].type === 'number' ? Number(value) : value);
                        (e.target as HTMLFormElement).reset();
                    }}>
                         <div className="relative">
                            <Input
                                name={steps[step].key}
                                type={steps[step].type || 'text'}
                                placeholder={
                                    steps[step].key === 'investmentAmount' ? 'e.g., 50000' :
                                    steps[step].key === 'investmentGoals' ? 'e.g., Long-term growth' : 'Type your answer...'
                                }
                                required 
                                className="pr-12 h-12"
                             />
                             <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                                <Send className="h-4 w-4" />
                             </Button>
                         </div>
                     </form>
                )}
            </>
          ) : (
            <form onSubmit={(e) => {
                e.preventDefault();
            }}>
                 <div className="relative">
                    <Input
                        name="history_question"
                        placeholder="Ask about your history..."
                        required 
                        className="pr-12 h-12"
                        value={historyQuestion}
                        onChange={(e) => setHistoryQuestion(e.target.value)}
                     />
                     <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-4 w-4" />
                     </Button>
                 </div>
            </form>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <SheetHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <SheetTitle className="sr-only">Investment Assistant</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => {onClose(); setView('home'); resetChat();}}>
                <X className="h-5 w-5" />
            </Button>
        </div>
      </SheetHeader>
      
      {view === 'home' && renderHomeView()}
      {view === 'chat' && renderChatView()}

    </div>
  );
}
