import { useState, useEffect } from "react";
import useWebsocket from "./hooks/useWebsocket";
import { isSSR, getUrlParams } from "./utils";

export type State = {
  page: "introduction" | "playground";
  clusters: {
    total: number;
    used: number;
    available: number;
    secondsUntilRelease: number; // seconds
  };
  cluster: {
    secondsRemaining: number; // seconds
    apps: {
      [app: string]: string[];
    };
  };
};

const useAppState = () => {
  const urlParams = !isSSR ? getUrlParams(location) : {};
  // set initial state
  const [state, setState] = useState<State>({
    page: "introduction",
//    page: "playground",
    clusters: {
      total: 0,
      used: 0,
      available: 0,
      secondsUntilRelease: 0,
    },
    cluster: {
      secondsRemaining: 0,
      apps: {
        // "hop rd": ["https://derp.hoprnet.org/node1?apiEndpoint=<node-id>", "https://derp.hoprnet.org/node2?apiEndpoint=<node-id>"],
        // "my.chat": ["x2", "y3"],
        // "my.chat-v2": ["x4", "y5"]
      },
    },
  });
  // initialize websocket
  const { state: connState, socketRef } = useWebsocket(urlParams.api || "");

  // called by WS event handler to handle messages
  const handleMessages = (event: MessageEvent<any>): void => {
    console.log("received websocket message:", event.data);
    try {
      const data = JSON.parse(event.data);
      if (data.type === "clusters_update") {
        setState((draft) => {
          draft.clusters.total = data.clusters_count;
          draft.clusters.used = data.clusters_count - data.clusters_available;
          draft.clusters.available = data.clusters_available;
          draft.clusters.secondsUntilRelease = data.secondsUntilRelease;
          return draft;
        });
      } else if (data.type === "cluster_update") {
        setState((draft) => {
          draft.cluster = data.cluster;
          draft.cluster.secondsRemaining = data.secondsRemaining;
          return draft;
        });
      }
    } catch (error) {
      console.error("Error parsing WS message", error);
    }
  };

  // runs everytime socket reference is changed (every reconnect)
  // adds listener for messages
  useEffect(() => {
    if (!socketRef.current) return;

    // handle messages
    socketRef.current.addEventListener("message", handleMessages);

    // cleanup when unmounting
    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleMessages);
    };
  }, [socketRef.current]);

  // launch cluster
  const launchCluster = () => {
    // some call to backend
    // some reply from backend
    setState((draft) => {
      draft.page = "playground";
      return draft;
    });
  };

  return {
    state,
    connState,
    launchCluster,
  };
};

export default useAppState;
