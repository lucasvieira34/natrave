import { addDays, format, subDays, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Icon } from "~/components/Icon";

export const DateSelect = ({ currentDate, onChange }) => {
  const date = new Date(currentDate);

  const prevDay = () => {
    const subDay = subDays(date, 1);
    onChange(formatISO(subDay));
  };
  const nextDay = () => {
    const nextDay = addDays(date, 1);
    onChange(formatISO(nextDay));
  };

  const formatDate = (date) => {
    return format(date, "d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="p-4 flex space-x-4 items-center justify-center">
      <Icon name="ArrowLeft" className="w-6 text-red-500" onClick={prevDay} />
      <span className="font-bold">{formatDate(date)}</span>
      <Icon name="ArrowRight" className="w-6 text-red-500" onClick={nextDay} />
    </div>
  );
};
