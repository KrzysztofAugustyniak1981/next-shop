import Image from "next/image";

export default function PaymentIcons() {
    return (
        <Image
            src="/images/payment-icons.svg"
            alt="Payment methods"
            width={301}
            height={50}
        />
    );
}