import React from "react";
import styles from "../../styles/pages/cluster.module.scss";

//Components
import CopyButton from "../future-hopr-lib-components/CopyButton";


const Cluster = (props: {
    index: number;
    dAppUrl: string | false;
    peerId: string;
    apiToken: string | false;
    apiEndpoint: string | false;
}) => {
    return (
        <div className={`${styles.nodeDetails}`}>
            <div className={styles.nodeDetailsLine}>
                <strong>Node {props.index}</strong>
            </div>
            {props.dAppUrl &&
                <div className={styles.nodeDetailsLine}>
                    <div className={styles.nodeDetailsTitle}>
                        <strong>Url:</strong>
                    </div>
                    <div className={styles.nodeDetailsData}>
                        <a href={props.dAppUrl} target="_blank" rel="noreferrer">
                            {props.dAppUrl}
                        </a>
                    </div>
                    <div className={styles.nodeDetailsCopy}>
                        <CopyButton copy={props.dAppUrl} />
                    </div>
                </div>
            }
            <div className={styles.nodeDetailsLine}>
                <div className={styles.nodeDetailsTitle}>
                    <strong>Peer ID:</strong>
                </div>
                <div className={styles.nodeDetailsData}>
                    {props.peerId?.length > 0
                        ? props.peerId
                        : "loading..."}
                </div>
                {props.peerId?.length > 0 && (
                    <div className={styles.nodeDetailsCopy}>
                        <CopyButton copy={props.peerId} />
                    </div>
                )}
            </div>
            { props.apiEndpoint  && (
                <div className={styles.nodeDetailsLine}>
                    <div className={styles.nodeDetailsTitle}>
                        <strong>API url:</strong>
                    </div>
                    <div className={styles.nodeDetailsData}>
                        {props.apiEndpoint}
                    </div>
                    <div className={styles.nodeDetailsCopy}>
                        <CopyButton copy={props.apiEndpoint} />
                    </div>
                </div>
            )}
            { props.apiToken  && (
                <div className={styles.nodeDetailsLine}>
                    <div className={styles.nodeDetailsTitle}>
                        <strong>API key:</strong>
                    </div>
                    <div className={styles.nodeDetailsData}>
                        {props.apiToken}
                    </div>
                    <div className={styles.nodeDetailsCopy}>
                        <CopyButton copy={props.apiToken} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cluster;
