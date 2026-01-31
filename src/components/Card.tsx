import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  children?: ReactNode;
}

export const Card = ({ title, value, icon: Icon, color, children }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {children}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
