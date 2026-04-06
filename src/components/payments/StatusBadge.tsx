import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@/types/payments";
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return {
          label: 'Successful',
          icon: <CheckCircle2 className="w-3 h-3" />,
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600 text-white border-transparent'
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: <Clock className="w-3 h-3" />,
          variant: 'outline' as const,
          className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
        };
      case 'failed':
        return {
          label: 'Failed',
          icon: <XCircle className="w-3 h-3" />,
          variant: 'destructive' as const,
          className: 'bg-red-500/10 text-red-600 border-red-500/20'
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: <RefreshCw className="w-3 h-3 animate-spin" />,
          variant: 'secondary' as const,
          className: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
        };
      default:
        return {
          label: status,
          icon: null,
          variant: 'outline' as const,
          className: 'bg-muted/50 text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1.5 px-2.5 py-0.5 font-medium rounded-full ${config.className} ${className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};
