// @ts-nocheck
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import React from "react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactElement | React.ReactElement[];
  ref?: React.MutableRefObject<any>;
}
export const PullRelease = React.forwardRef(
  ({ className, children, ...rest }: IProps, ref) => {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));
    // Set the drag hook and define component movement based on gesture data
    const bind = useDrag(({ down, movement: [mx, my] }) => {
      set({ x: down ? mx : 0, y: down ? my : 0 });
    });
    // Bind it to a component
    return (
      <animated.div
        {...bind()}
        className={className}
        style={{ x, y }}
        ref={ref}
        {...rest}
      >
        {children}
      </animated.div>
    );
  }
);
