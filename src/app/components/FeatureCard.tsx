/**
 * Feature Card Component
 * Reusable card component for displaying feature information
 */

import { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBackgroundColor: string;
  iconColor: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  iconBackgroundColor,
  iconColor,
}: FeatureCardProps): JSX.Element {
  return (
    <div className="text-center p-6">
      <div className={`w-16 h-16 ${iconBackgroundColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <div className={`w-8 h-8 ${iconColor}`}>{icon}</div>
      </div>
      <h3 className="text-xl mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
