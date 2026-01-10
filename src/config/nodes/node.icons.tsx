import { Icon } from '@iconify/react';

interface IconProps {
    size?: number;
    className?: string;
}

export const KafkaIcon = ({ size = 16, className }: IconProps) => (
    <Icon icon="simple-icons:apachekafka" width={size} height={size} className={className} color="currentColor" />
);

export const ArtemisIcon = ({ size = 16, className }: IconProps) => (
    <Icon icon="simple-icons:apache" width={size} height={size} className={className} color="currentColor" />
);

export const ActiveMQIcon = ({ size = 16, className }: IconProps) => (
    <Icon icon="simple-icons:apache" width={size} height={size} className={className} color="currentColor" />
);
