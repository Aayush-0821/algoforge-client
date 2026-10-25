import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="
      flex
      items-center
      gap-3
      select-none
      "
    >
      <Image
        src="/logo.png"
        alt="AlgoForge"
        width={46}
        height={46}
        priority
        className="rounded-xl"
      />

      <h1
        className="
        text-[23px]
        font-bold
        tracking-[-0.04em]
        "
      >
        <span className="text-zinc-900 dark:text-white">
          Algo
        </span>

        <span className="text-orange-500">
          Forge
        </span>
      </h1>
    </Link>
  );
}