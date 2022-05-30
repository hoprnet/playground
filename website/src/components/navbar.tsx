import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/components/navbar.module.scss";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <span className={styles.hoprLogo}>
          <Image src="/logo.svg" height={60} width={120} alt="hopr" />
        </span>
      </Link>
      <Link href="/">
        <span className={styles.title}>PLAYGROUND</span>
      </Link>
    </div>
  );
};

export default Navbar;
