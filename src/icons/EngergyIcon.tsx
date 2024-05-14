import * as React from 'react';

interface EngergyIconProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
}

export function EngergyIcon({ width = 21, height = 20, stroke = '#88909F' }: EngergyIconProps): React.JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="zap">
        <path
          id="Icon"
          d="M13.0008 2L4.09429 12.6879C3.74549 13.1064 3.57108 13.3157 3.56842 13.4925C3.5661 13.6461 3.63457 13.7923 3.7541 13.8889C3.89159 14 4.16402 14 4.70887 14H12.0008L11.0008 22L19.9074 11.3121C20.2562 10.8936 20.4306 10.6843 20.4333 10.5075C20.4356 10.3539 20.3671 10.2077 20.2476 10.1111C20.1101 10 19.8377 10 19.2928 10H12.0008L13.0008 2Z"
          stroke="#16B364"
          stroke-width="1.67"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
}
