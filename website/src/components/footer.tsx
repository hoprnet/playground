import Image from "next/image";
import styles from "../../styles/components/footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftCell}>
        <div>
          <Image
            layout="fixed"
            src={"/hopr-favicon.svg"}
            alt="hopr"
            width="58"
            height="58"
          />
        </div>
        <div>
          <div className={`${styles.addressWrapper} ${styles.footerText}`}>
            <div>HOPR</div>
            <div>Bleicherweg 33</div>
            <div>8003 Zürich</div>
            <div>Switzerland</div>
          </div>
          <div className={styles.footerText}>
            © HOPR Association, all rights reserved
          </div>
        </div>
      </div>
      <div className={styles.iconListWrapper}>
        <ul className={styles.iconList}>
          <li>
            <a
              href="https://twitter.com/hoprnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/twitter.svg"
                alt="twitter"
                height={16}
                width={16}
              />
            </a>
          </li>
          <li>
            <a
              href="https://t.me/hoprnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/telegram.svg"
                alt="telegram"
                height={16}
                width={16}
              />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/hoprnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/linkedin.svg"
                alt="linkedin"
                height={16}
                width={16}
              />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/hoprnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/github.svg"
                alt="github"
                height={16}
                width={16}
              />
            </a>
          </li>
          <li>
            <a
              href="https://medium.com/hoprnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/medium.svg"
                alt="medium"
                height={16}
                width={16}
              />
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/channel/UC2DzUtC90LXdW7TfT3igasA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/youtube.svg"
                alt="youtube"
                height={16}
                width={16}
              />
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/dEAWC4G"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                layout="fixed"
                src="/discord.svg"
                alt="discord"
                height={16}
                width={16}
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
