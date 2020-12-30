import { animated, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import React from "react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactElement | React.ReactElement[];
  onDragStart?: () => void;
  onDrag?: () => void;
  draggable?: boolean;
  ref?: React.MutableRefObject<any>;
}
export const PullRelease = React.forwardRef(
  (
    { className, children, onDragStart, onDrag, draggable, ...rest }: IProps,
    ref
  ) => {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));
    // Set the drag hook and define component movement based on gesture data

    const bind = useGesture(
      {
        onDrag: ({ down, movement: [mx, my] }) => {
          set({ x: down ? mx : 0, y: down ? my : 0 });
          onDrag?.();
        },
        onDragStart: ({ event, ...sharedState }) => onDragStart?.(),
      }
    );

    return (
      <animated.div
        {...bind()}
        className={className}
        // @ts-ignore
        style={{ x, y }}
        // @ts-ignore
        ref={ref}
        {...rest}
      >
        {children}
      </animated.div>
    );
  }
);
