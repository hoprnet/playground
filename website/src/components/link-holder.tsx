import Image from "next/image";
import styles from "../../styles/components/link-holder.module.scss";

const LinkHolder = (props: { nodeNumber: number; link: string }) => {


    const openInNewTab = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

  return (
    <div className={styles.container}>
      <div className={styles.node}>Node {props.nodeNumber}</div>
      <div className={styles.linkBox}>
        <span>{props.link}</span>
        <div
            className={styles.copyIconContainer}
            onClick={()=>{openInNewTab(props.link)}}
        >
          <Image src="/hopr-copy-icon.svg" width={26} height={24} />
        </div>
      </div>
    </div>
  );
};

export default LinkHolder;
