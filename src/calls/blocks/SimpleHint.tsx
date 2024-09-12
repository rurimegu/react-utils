import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CallHintProps {
  readonly ratio: number;
}

function CallHint({ ratio }: CallHintProps) {
  return (
    <div
      className="absolute mt-px left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-6"
      style={{
        opacity: ratio,
      }}
    >
      <CircularProgressbar
        strokeWidth={24}
        value={1 - ratio}
        maxValue={1}
        styles={buildStyles({
          strokeLinecap: 'butt',
          pathTransition: 'none',
          pathColor: '#df2020',
          trailColor: 'transparent',
        })}
      />
    </div>
  );
}

export default CallHint;
