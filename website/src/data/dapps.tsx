import { Apps } from "../types/index";
import ReactPlayer from "react-player";

export const dapps: Apps = [
  {
    key: "hoprd-admin",
    name: "Hoprd",
    icon: "/dapp-icons/hoprd.svg",
    text: (
      <div>
        Developer:{" "}
        <a href="https://github.com/hoprnet" target="_blank" rel="noreferrer">
          https://github.com/hoprnet
        </a>
        <br />
        <br />
        Spin up five HOPR nodes for you to test via a command line. The familiar
        interface from our testnets, without any of the install steps!
        <br />
        <br />
        Wait ~20s for the screen to turn from yellow to blue, then type
        &apos;help&apos; for a list of available commands, or visit our docs at{" "}
        <a href="https://docs.hoprnet.org/" target="_blank" rel="noreferrer">
          https://docs.hoprnet.org/
        </a>{" "}
        for more information.
      </div>
    ),
  },
  {
    key: "hopr-visual",
    name: "Visualizer",
    url: "https://hopr-visual.vercel.app/",
    author: "Eliaxie",
    icon: "/dapp-icons/visualizer.svg",
    text: (
      <div>
        Developer:{" "}
        <a href="https://github.com/Eliaxie" target="_blank" rel="noreferrer">
          https://github.com/Eliaxie
        </a>
        <br />
        <br />
        Visualizer draws a graphical representation of the HOPR network, showing
        all the nodes and the connections between them.
        <br />
        <br />
        <strong>Disclaimer: </strong>The data in this app are from our last
        public testnet (
        <a
          href="https://medium.com/hoprnet/matterhorn-testnet-is-coming-5a69ad9cb815"
          target="_blank"
          rel="noreferrer"
        >
          Matterhorn
        </a>
        ) and do not represent the Playground state.
      </div>
    ),
  },
  {
    key: "hopr-status-board",
    name: "Cockpit",
    url: "https://hopr-status-board.vercel.app/",
    author: "0xMrH",
    icon: "/dapp-icons/cockpit.svg",
    text: (
      <div>
        Developer:{" "}
        <a href="https://github.com/0xMrH" target="_blank" rel="noreferrer">
          https://github.com/0xMrH
        </a>
        <br />
        <br />
        This dashboard lets you see status information about your node at a
        glance, including token balance, version and payment channel
        connections.
      </div>
    ),
  },
  {
    key: "hopr-boomerang-chat",
    name: "Boomerang",
    url: "https://hopr-boomerang-chat.vercel.app/",
    author: "0xjjpa",
    icon: "/dapp-icons/boomerang_chat.svg",
    text: (
      <div>
        Developer:{" "}
        <a href="https://github.com/0xjjpa" target="_blank" rel="noreferrer">
          https://github.com/0xjjpa
        </a>
        <br />
        <br />
        A proof of concept dApp to demonstrate multihop messages. Send a message
        from a node, which will boomerang back to the sender after passing
        through the HOPR network.
        <br />
        <br />
        Learn how to build this dApp and what’s going on under the hood by
        following the step-by-step tutorial in our docs:{" "}
        <a
          href="https://docs.hoprnet.org/developers/demo-boomerang-chat"
          target="_blank"
          rel="noreferrer"
        >
          https://docs.hoprnet.org/developers/demo-boomerang-chat
        </a>
      </div>
    ),
  },
  {
    key: "hopr-chess",
    name: "Chess",
    url: "https://hopr-chess.vercel.app/",
    author: "vividwood",
    icon: "/dapp-icons/chess.svg",
    text: (
      <div>
        Developer:{" "}
        <a href="https://github.com/vividwood" target="_blank" rel="noreferrer">
          https://github.com/vividwood
        </a>
        <br />
        <br />
        The classic game of strategy, now over HOPR!
        <br />
        <br />
        Find a friend (or enemy) to play against, share the link and PeerID of
        another node in your Playground cluster and follow the connection
        instructions to play a game.
        <br />
        <br />
        <ReactPlayer url="./videos/chess_video_manual.webm" controls />
      </div>
    ),
  },
  {
    key: "hopr-dots-and-boxes",
    name: "Dots and boxes",
    url: "https://hopr-dots-and-boxes.vercel.app/",
    author: "vividwood",
    icon: "/dapp-icons/_dotsandboxes.svg",
  },
  {
    key: "hopr-tic-tac-toe",
    name: "Tic Tac Toe",
    url: "https://hopr-tic-tac-toe.vercel.app/",
    author: "h1xten",
    icon: "/dapp-icons/_tiktactoe.svg",
  },
  {
    key: "hopr-hangman",
    name: "Hangman",
    url: "https://hopr-hangman.vercel.app/",
    author: "ginanisque",
    icon: "/dapp-icons/_hangman.svg",
  },
  {
    key: "myne-chat",
    name: "myne.chat",
    url: "https://app.myne.chat",
    icon: "/dapp-icons/myne.chat.svg",
    text: (
      <div>
        Developer:{" "}
        <a href="https://github.com/hoprnet" target="_blank" rel="noreferrer">
          https://github.com/hoprnet
        </a>
        <br />
        <br />
        myne.chat – Chat. Finally private.
        <br />
        <br />
        Chat should be private but it isn&apos;t. Your identity is exposed,
        along with your data and metadata. Myne will make chat private and will
        pay you for making the internet more secure.
        <br />
        <br />
        Try out the myne experience in this version for Playground. Share links
        and PeerIDs with friends to give them access to a node and message with
        you.
        <br />
        <br />
        <ReactPlayer url="./videos/myne_video_manual.webm" controls />
      </div>
    ),
  },
  {
    key: "separator",
  },
  {
    key: "your-dApp",
    name: "your own dApp",
    icon: "/dapp-icons/settings.svg",
    text: (
      <div>
          Did you know that you can use the 5 HOPR Playground nodes for more than just the apps that are provided here? You can connect to the HORP Playground nodes from any app that is compatible with the{" "}
        <a
          href="https://github.com/hoprnet/hopr-community/blob/main/DAPP_STANDARD.md"
          target="_blank"
          rel="noreferrer"
        >
          HOPR dApp standard
        </a>
          . Visit our{" "}
        <a
          href="https://docs.hoprnet.org/developers/rest-api"
          target="_blank"
          rel="noreferrer"
        >
            docs for tutorials
        </a>
        {" "}on how to build HOPR apps that are compatible with our API. And visit the{" "}
          <a
              href="https://bounties.hoprnet.org/"
              target="_blank"
              rel="noreferrer"
          >
              HOPR Bounties portal to earn money for building dApps
          </a>
          !
      </div>
    ),
  },
];
