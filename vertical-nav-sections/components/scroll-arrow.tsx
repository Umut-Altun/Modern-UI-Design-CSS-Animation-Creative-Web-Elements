"use client"

import { useEffect, type React } from "react"

interface ScrollArrowProps {
  targetRef: React.RefObject<HTMLElement>
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({ targetRef }) => {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes mouse-wheel {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(6px); opacity: 0; }
      }
      @keyframes mouse-scroll {
        0% { opacity: 0; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleClick = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={handleClick}>
      <div className="w-6 h-[100px]">
        <div className="w-6 h-[42px] rounded-full border-2 border-secondary-foreground mb-2">
          <div className="w-1 h-1 bg-secondary-foreground rounded-full mx-auto mt-[5px] animate-[mouse-wheel_0.6s_linear_infinite]"></div>
        </div>
        <div>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-4 h-4 border-r-2 border-b-2 border-secondary-foreground rotate-45 mb-[-6px] ml-1 animate-[mouse-scroll_1s_infinite]"
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            ></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScrollArrow

