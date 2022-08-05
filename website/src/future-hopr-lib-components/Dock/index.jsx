import React, {useEffect, useRef} from "react";
import styled from "@emotion/styled";
import lottie from "lottie-web";

const StyledDock = styled.ul`
  width: 100%;
  height: 60px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  //position: absolute;
  //bottom: 20px;
  //left: 50%;
  //transform: translateX(-50%);

  .dock-container {
    padding: 3px;
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background: rgba(83, 83, 83, 0.25);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(13px);
    border: 1px solid rgba(255, 255, 255, 0.18);

    .li-bin {
      margin-left: 20px;
      border-left: 1.5px solid rgba(255, 255, 255, 0.4);
      padding: 0px 10px;
    }
    .li-active {
      &::after {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        content: "";
        bottom: 2px;
      }
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      vertical-align: bottom;
      transition: 0.2s;
      transform-origin: 50% 100%;
      &:hover {
        margin: 0px 13px 0px 13px;
      }

      .name {
        position: absolute;
        top: -45px;
        background: rgba(0, 0, 0, 0.5);
        color: rgba(255, 255, 255, 0.9);
        height: 10px;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        visibility: hidden;
        white-space: nowrap;
        &::after {
          content: "";
          position: absolute;
          bottom: -10px;
          width: 0;
          height: 0;
          backdrop-filter: blur(13px);
          -webkit-backdrop-filter: blur(13px);
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgba(0, 0, 0, 0.5);
        }
      }

      .ico {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.2s;
      }
      .ico-bin {
        width: 94% !important;
        height: 94% !important;
        object-fit: cover;
        transition: 0.2s;

        &:hover {
          margin-left: 10px;
        }
      }
    }
  }
  .icon-in-dock:hover {
    .name {
      visibility: visible !important;
    }
  }
  
  .ico:hover {
    -webkit-transform-origin: center bottom;
    -webkit-transform: scale(1.4);
  }
`


const placeholderApps = [
    {name:"Finder", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853981255cc36b3a37af_finder.png"},
    {name:"Siri", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ff3bafbac60495771_siri.png"},
    {name:"LaunchPad", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853943597517f128b9b4_launchpad.png"},
    {name:"Contacts", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853743597518c528b9b3_contacts.png"},
    {name:"Notes", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c849ec3735b52cef9_notes.png"},
    {name:"Reminders", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853d44d99641ce69afeb_reminders.png"},
    {name:"Photos", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c55558a2e1192ee09_photos.png"},
    {name:"Messages", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853a55558a68e192ee08_messages.png"},
    {name:"FaceTime", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708537f18e2cb27247c904_facetime.png"},
    {name:"Music", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ba0782d6ff2aca6b3_music.png"},
    {name:"Podcasts", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853cc718ba9ede6888f9_podcasts.png"},
    {name:"TV", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708540dd82638d7b8eda70_tv.png"},
    {name:"App Store", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853270b5e2ccfd795b49_appstore.png"},
    {name:"Safari", icon:"https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ddd826358438eda6d_safari.png"},
    {name:"Bin", icon:"https://findicons.com/files/icons/569/longhorn_objects/128/trash.png"}
]

function Dock(props) {

    // const loaded = useRef(false);

    // useEffect(() => {
    //     if (!loaded.current) {
    //         const icons = document.querySelectorAll(".ico");
    //         const length = icons.length;
    //
    //         icons.forEach((item, index) => {
    //             item.addEventListener("mouseover", (e) => {
    //                 focus(e.target, index);
    //             });
    //             item.addEventListener("mouseleave", (e) => {
    //                 icons.forEach((item) => {
    //                     item.style.transform = "scale(1)  translateY(0px)";
    //                 });
    //             });
    //         });
    //         const focus = (elem, index) => {
    //             let previous = index - 1;
    //             let previous1 = index - 2;
    //             let next = index + 1;
    //             let next2 = index + 2;
    //
    //             if (previous == -1) {
    //                 elem.style.transform = "scale(1.5)  translateY(-10px)";
    //             } else if (next == icons.length) {
    //                 elem.style.transform = "scale(1.5)  translateY(-10px)";
    //             } else {
    //                 elem.style.transform = "scale(1.5)  translateY(-10px)";
    //                 icons[previous].style.transform = "scale(1.2) translateY(-6px)";
    //                 icons[previous1].style.transform = "scale(1.1)";
    //                 icons[next].style.transform = "scale(1.2) translateY(-6px)";
    //                 icons[next2].style.transform = "scale(1.1)";
    //             }
    //         };
    //     }
    //     loaded.current = true;
    // }, []);

    function parseApps(apps){
        let parsedApps = [];

        for (let i = 0; i < apps.length; i++) {
            parsedApps.push(
                {
                    name: apps[i][0],
                    icon: placeholderApps[i].icon
                }
            )
        }
        return parsedApps
    }

    const parsedApps = parseApps(props.apps);
    console.log('parsedApps', parsedApps)

    return (
        <StyledDock>
            <div className="dock-container">
                {
                    parsedApps.map((app, index) =>{
                        return (
                            <li
                                className={`li-${index} icon-in-dock`}
                                key={`li-${index}`}
                                onClick={()=>{props.iconClicked(index)}}
                            >
                                <div className="name">{app.name}</div>
                                <img
                                     className="ico"
                                     src={app.icon}
                                     alt=""
                                />
                            </li>
                        )}
                    )
                }
            </div>
        </StyledDock>
    );
}

export default Dock;
