"use client";

import { FC, useEffect, useState } from "react";
import Highlight, { defaultProps, type Language } from "prism-react-renderer";
import { useTheme } from "next-themes";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import darkTheme from "prism-react-renderer/themes/nightOwl";

interface CodeProps {
  code: string;
  show: boolean;
  language: Language;
  animationDelay?: number;
  animated?: boolean;
}

const Code: FC<CodeProps> = ({
  code,
  show,
  language,
  animationDelay,
  animated,
}) => {
  const [text, setText] = useState(animated ? "" : code);
  const { theme: appTheme } = useTheme();

  useEffect(() => {
    if (show && animated) {
      let index = 0;
      setTimeout(() => {
        const intervalId = setInterval(() => {
          setText(code.slice(0, index));
          index++;
          if (index > code.length) {
            clearInterval(intervalId);
          }
        }, 15);
        return () => clearInterval(intervalId);
      }, animationDelay || 150);
    }
  }, [code, show, animated, animationDelay]);

  const lines = text.split(/\r\n|\r|\n/).length;
  const theme = appTheme === "light" ? lightTheme : darkTheme;

  return (
    <Highlight {...defaultProps} code={text} language={language} theme={theme}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={
            className +
            "transition-all w-fit bg-transparent duration-100 py-0 no-scrollbar"
          }
          style={{
            maxHeight: show ? lines * 24 : 0,
            opacity: show ? 1 : 0,
          }}
        >
          {tokens.map((line, index) => {
            // eslint-disable-next-line no-unused-vars
            const { key, ...rest } = getLineProps({ line, key: index });

            return (
              <div
                key={`line-${index}`}
                style={{ position: "relative" }}
                {...rest}
              >
                {line.map((token, index) => {
                // eslint-disable-next-line no-unused-vars
                  const {key, ...props} = getTokenProps({token, index})

                  return <span key={index} {...props}></span>
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};

export default Code;
