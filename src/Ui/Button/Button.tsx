import {
  useState,
  useRef,
  useEffect,
  cloneElement,
  ReactElement,
  ReactNode,
  MouseEvent,
  TouchEvent,
} from "react";
import "./Button.scss";

interface IconProps {
  className?: string;
  [key: string]: any;
}

interface ButtonProps {
  text?: string;
  onClick?: (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => void;
  icon?: IconProps;
  className?: string;
  type?:
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "report";
  children?: ReactNode;
}

function Button({
  text,
  onClick,
  icon,
  className = "",
  type = "default",
  children,
}: ButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartedRef = useRef(false);

  const handleInteractionStart = () => {
    setIsActive(true);
    touchStartedRef.current = true;
  };

  const handleInteractionEnd = (
    e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    if (!touchStartedRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (onClick) {
      setTimeout(() => onClick(e), 50);
    }

    timerRef.current = setTimeout(() => {
      setIsActive(false);
      touchStartedRef.current = false;
    }, 200);
  };

  const handleTouchCancel = () => {
    setIsActive(false);
    touchStartedRef.current = false;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const buttonContent = children || text;

  return (
    <button
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleTouchCancel}
      className={`button_base ${type}_button ${className} ${
        isActive ? "active" : ""
      }`.trim()}
      onTouchMove={(e: TouchEvent<HTMLButtonElement>) => e.preventDefault()}
      type="button"
    >
      {buttonContent}
      {icon && (
        <span className="button_icon-wrapper">
          <icon.type
            {...icon.props}
            className={`${icon.props.className || ""} button_icon`.trim()}
          />
        </span>
      )}
    </button>
  );
}

export default Button;
