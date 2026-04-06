import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/payments";
import { CreditCard, Landmark, Wallet, ArrowRight, Star } from 'lucide-react';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  isLoading?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  onSelect,
  isLoading
}) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'card':
      case 'stripe':
        return <CreditCard className="w-6 h-6" />;
      case 'bank_transfer':
      case 'wire':
        return <Landmark className="w-6 h-6" />;
      default:
        return <Wallet className="w-6 h-6" />;
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all hover:border-primary/50 ${method.recommended ? 'border-primary shadow-md' : ''}`}>
      {method.recommended && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-tr-none rounded-bl-lg bg-primary text-primary-foreground px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Recommended
          </Badge>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${method.recommended ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {getIcon(method.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{method.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {method.instructions}
            </p>
            <Button
              onClick={() => onSelect(method)}
              className="w-full justify-between"
              variant={method.recommended ? "default" : "outline"}
              disabled={isLoading}
            >
              {method.actionText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
