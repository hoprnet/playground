import React, { useState} from "react";
import styled from "@emotion/styled";

const StyledDock = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  margin-top: 1em;
  padding-inline-start: 0;
  //position: absolute;
  //bottom: 20px;
  //left: 50%;
  //transform: translateX(-50%);

  .dock-container {
    padding: 6px;
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
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgb(255, 255, 255);
        content: "";
        bottom: 1px;
      }
    }
    
    .li-separator{
      width: 1px;
      height: 72px;
      background: white;
      margin: 0 3px;
    }

    div.icon-in-dock  {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      vertical-align: bottom;
      transition: 0.2s;
      transform-origin: 50% 100%;
      &:hover {
        margin: 0px 13px 0px 13px;
      }

      .name {
        position: absolute;
        top: -55px;
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
        padding: 5px;
        border-radius: 14px;
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

  @media only screen and (max-width: 500px) {
    height: unset;
    .dock-container {
      flex-wrap: wrap;
      gap: 24px;
      padding: 14px;
      div.icon-in-dock {
        position: relative;
        img.ico {
          padding: 0;
        }
        &.li-active::after {
          bottom: -10px;
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

function Dock(props) {
    const [indexActive, set_indexActive] = useState(null);
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

    return (
        <StyledDock>
            <div className="dock-container">
                {
                    props.apps.map((app, index) =>{
                        if (app.key === "separator") {
                            return (
                                <div
                                    className={`li-separator`}
                                    key={`li-${index}`}
                                />
                            )
                        }
                        return (
                            <div
                                className={`li-${index} icon-in-dock ${index === indexActive ? 'li-active' : ''}`}
                                key={`li-${index}`}
                                onClick={()=>{
                                    set_indexActive(index);
                                    props.iconClicked(index);
                                }}
                            >
                                <div className="name">{app.name}</div>
                                <img
                                     className="ico"
                                     src={app.icon}
                                     alt=""
                                />
                            </div>
                        )}
                    )
                }
            </div>
        </StyledDock>
    );
}

export default Dock;
