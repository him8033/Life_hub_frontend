import Image from "next/image";

export default function Logo({
    width = 120,
    height = 120,
    className = "max-w-[150px] rounded-full",
}) {
    return (
        <Image
            src="/assets/images/logo.png"
            alt="App Logo"
            width={width}
            height={height}
            priority
            className={className}
        />
    );
}
