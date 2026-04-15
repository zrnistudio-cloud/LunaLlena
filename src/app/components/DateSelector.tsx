import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + 'T12:00:00');
    onDateChange(newDate);
  };

  const formatDateForInput = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-center mb-4">
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          Seleccioná otra fecha
        </span>
      </label>
      
      <div className="relative">
        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
        
        <input
          type="date"
          value={formatDateForInput(selectedDate)}
          onChange={handleDateChange}
          className="w-full pl-[60px] pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white text-lg
                     focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40
                     transition-all duration-300
                     [color-scheme:dark]
                     hover:bg-white/15"
        />
      </div>
    </div>
  );
}
