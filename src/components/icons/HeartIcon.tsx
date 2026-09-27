type HeartIconProps = {
    className?: string;
};

export default function HeartIcon({
    className = "",
}: HeartIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M20.8 4.6C18.7 2.5 15.3 2.5 13.2 4.6L12 5.8L10.8 4.6C8.7 2.5 5.3 2.5 3.2 4.6C1.1 6.7 1.1 10.1 3.2 12.2L12 21L20.8 12.2C22.9 10.1 22.9 6.7 20.8 4.6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}