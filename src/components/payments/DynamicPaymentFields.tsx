import React, { useEffect, useState } from 'react';
import { PaymentField } from '@/types/payments';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/api/client';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface DynamicPaymentFieldsProps {
  fields: PaymentField[];
  onChange: (name: string, value: any) => void;
  values: Record<string, any>;
}

export const DynamicPaymentFields: React.FC<DynamicPaymentFieldsProps> = ({ fields, onChange, values }) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        if (field.name === 'level' && field.type === 'number') {
          return (
            <input
              key={field.name}
              type="hidden"
              name={field.name}
              value={values[field.name] || 1}
            />
          );
        }
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <RenderField field={field} onChange={onChange} value={values[field.name]} />
          </div>
        );
      })}
    </div>
  );
};

const RenderField: React.FC<{ field: PaymentField; onChange: (name: string, value: any) => void; value: any }> = ({ field, onChange, value }) => {
  switch (field.type.toLowerCase()) {
    case 'text':
    case 'password':
    case 'number':
    case 'email':
      return (
        <Input
          id={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case 'otp':
      return (
        <InputOTP
          maxLength={6}
          value={value || ''}
          onChange={(val) => onChange(field.name, val)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      );
    case 'select':
      return <SelectField field={field} onChange={onChange} value={value} />;
    case 'info':
      return (
        <div className="p-3 bg-muted rounded-md text-sm font-medium flex justify-between items-center">
            <span className="text-muted-foreground">{field.label}:</span>
            <span>{field.value}</span>
        </div>
      );
    case 'countdown':
      return <CountdownField field={field} />;
    case 'date':
      return <DateField field={field} onChange={onChange} value={value} />;
    case 'timestamp':
      return <TimestampField field={field} onChange={onChange} value={value} />;
    case 'phone':
      return <PhoneField field={field} onChange={onChange} value={value} />;
    default:
      return null;
  }
};

const TimestampField: React.FC<{ field: PaymentField; onChange: (name: string, value: any) => void; value: any }> = ({ field, onChange, value }) => {
  return (
    <Input
      id={field.name}
      type="datetime-local"
      placeholder={field.placeholder}
      required={field.required}
      value={value || ''}
      onChange={(e) => onChange(field.name, e.target.value)}
    />
  );
};

const PhoneField: React.FC<{ field: PaymentField; onChange: (name: string, value: any) => void; value: any }> = ({ field, onChange, value }) => {
  return (
    <Input
      id={field.name}
      type="tel"
      placeholder={field.placeholder}
      required={field.required}
      value={value || ''}
      onChange={(e) => onChange(field.name, e.target.value)}
    />
  );
};

const DateField: React.FC<{ field: PaymentField; onChange: (name: string, value: any) => void; value: any }> = ({ field, onChange, value }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => onChange(field.name, date ? format(date, "yyyy-MM-dd") : undefined)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const SelectField: React.FC<{ field: PaymentField; onChange: (name: string, value: any) => void; value: any }> = ({ field, onChange, value }) => {
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItemsUrl = async (itemsUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any[]>(itemsUrl);
      // Assuming the API returns a list of items, we might need to map them if they aren't {label, value}
      setItems(res.map(item => typeof item === 'string' ? { label: item, value: item } : item));
    } catch (error: any) {
      console.log("Failed to load select options:", error);
      setError(error?.message || 'Failed to load options');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (field.itemsUrl) {
      loadItemsUrl(field.itemsUrl);
    }
  }, [field.itemsUrl]);

  return (
    <>
      <Select value={value} onValueChange={(val) => onChange(field.name, val)} required={field.required}>
        <SelectTrigger id={field.name}>
          {
            loading ? <Loader2 className="w-4 h-4 animate-spin" /> 
            : 
            <SelectValue placeholder={field.placeholder || "Select option"} />
          }
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {
        loading ? null 
        : 
        <>
          {error && 
          <>
            <span className="text-red-500 text-sm mt-1">{error}</span>
            <Button variant="link" size="sm" onClick={(e) => {
              e.stopPropagation();
              if (field.itemsUrl) loadItemsUrl(field.itemsUrl);
            }} className="ml-2">
              Reload
            </Button>
          </>
          }
          
        </>
      }
    </>
  );
};

const CountdownField: React.FC<{ field: PaymentField }> = ({ field }) => {
    const { gmt_start_millis, duration_millis } = field.value || {};
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (!gmt_start_millis || !duration_millis) return;

        const endTime = gmt_start_millis + duration_millis;

        const update = () => {
            const now = Date.now();
            const diff = Math.max(0, endTime - now);
            setTimeLeft(Math.floor(diff / 1000));
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [gmt_start_millis, duration_millis]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-md text-orange-700 text-center font-bold">
            {field.label}: {formatTime(timeLeft)}
        </div>
    );
};
