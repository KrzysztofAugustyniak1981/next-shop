type ShoppingBagIconProps = {
    className?: string;
};

export default function ShoppingBagIcon({
    className = "",
}: ShoppingBagIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M5 8H19L18 21H6L5 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M9 9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}