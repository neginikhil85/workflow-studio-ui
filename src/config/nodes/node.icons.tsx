import { Icon } from '@iconify/react';

interface IconProps {
    size?: number;
    className?: string;
}

export const KafkaIcon = ({ size = 16, className }: IconProps) => (
    <Icon icon="simple-icons:apachekafka" width={size} height={size} className={className} color="currentColor" />
);

export const ArtemisIcon = ({ size = 16, className }: IconProps) => (
    <img src="/artemis-logo.svg" style={{ width: size, height: size }} className={className} alt="Artemis" />
);

export const ActiveMQIcon = ({ size = 16, className }: IconProps) => (
    <img src="/activemq-logo.svg" style={{ width: size, height: size, objectFit: 'contain' }} className={className} alt="ActiveMQ" />
);
