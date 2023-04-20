import React, { useEffect, useState } from "react";

const NAME = "ScrollToTop";

type ScrollToTopIntrinsicProps = JSX.IntrinsicElements["button"];
interface ScrollToTopProps extends ScrollToTopIntrinsicProps {
  offset?: number;
}

const ScrollToTop = React.forwardRef<HTMLButtonElement, ScrollToTopProps>(
  ({ offset = -65, ...rest }, ref) => {
    const [show, setShow] = useState(false);

    const handleScrollToTopClick = () => {
      window.scrollTo({ top: offset, left: 0, behavior: "smooth" });
    };

    useEffect(() => {
      const handleCheck = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 50) {
          setShow(true);
        } else {
          setShow(false);
        }
      };
      if (typeof window !== "undefined") {
        window.addEventListener("scroll", handleCheck);
      }
      return () => window.removeEventListener("scroll", handleCheck);
    }, []);

    return (
      <button
        ref={ref}
        {...rest}
        onClick={handleScrollToTopClick}
        type="button"
        id="scroll-to-top"
        className={`flex fixed w-0 h-0 opacity-0 hidden items-center decoration-none border-0 p-0 m-0 outline-none z-50 justify-center bottom-11 right-8 ${
          show &&
          "min-w-0 visible opacity-100 p-0 w-[40px] h-10 bottom-5 right-3"
        }`}
      >
        <span>
          <svg
            className="block m-auto"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 51 32"
          >
            <path d="M25.4,9.8L45.6,30l4.5-4.5L25.4,0.8L0.8,25.4L5.3,30L25.4,9.8z" />
          </svg>
        </span>
      </button>
    );
  }
);

ScrollToTop.displayName = NAME;

export { ScrollToTop };

export type { ScrollToTopProps };
