import React, { ReactNode } from 'react';
import Card from './Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className = ''
}) => {
  return (
    <Card 
      className={`text-center py-8 px-6 min-h-[200px] flex flex-col justify-center items-center ${className}`}
      hoverable={true}
    >
      {icon && (
        <div className="mb-6 flex justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4 dark:text-white text-highlight-light">
        {title}
      </h3>
      <p className="text-sm dark:text-gray-300 text-accent-light max-w-[80%] mx-auto">
        {description}
      </p>
    </Card>
  );
};

export default FeatureCard;
