import { addDays, format, subDays, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DateSelect = ({ currentDate, onDateChange }: any) => {
  const date = new Date(currentDate);

  const prevDay = () => {
    const subDay = subDays(date, 1);
    onDateChange(formatISO(subDay));
  };
  const nextDay = () => {
    const nextDay = addDays(date, 1);
    onDateChange(formatISO(nextDay));
  };

  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="p-4 flex space-x-4 items-center justify-center">
      <img src="/src/assets/arrow-left.svg" className="w-6 text-red-500" onClick={prevDay} />
      <span className="font-bold">{formatDate(date)}</span>
      <img src="/src/assets/arrow-right.svg" className="w-6 text-red-500" onClick={nextDay} />
    </div>
  );
};
