import * as React from 'react'
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const headingVariants = cva(
  "max-w-2xl text-black dark:text-white text-center font-extrabold leading-tight tracking-tighter", {
    variants: {
      size: {
        default: "text-3xl md:text-4xl lg:text-5xl",
        lg: "text-3xl md:text-4xl lg:text-5xl",
        sm: "text-1xl, md:text-2xl lg:text-3xl",
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        {...props}
        className={cn(headingVariants({ size, className }))}>
        {children}
      </h1>
    )
  }
)

Heading.displayName = 'Heading'

export default Heading;
