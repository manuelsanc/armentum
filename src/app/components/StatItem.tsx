/**
 * Stat Item Component
 * Displays a statistic with label
 */

export interface StatItemProps {
  value: string;
  label: string;
}

export function StatItem({ value, label }: StatItemProps): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <div className="text-3xl text-red-600">{value}</div>
      <div className="text-gray-700">{label}</div>
    </div>
  );
}
