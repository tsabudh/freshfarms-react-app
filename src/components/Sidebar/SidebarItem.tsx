import classNames from "classnames/bind";
import React, { useContext, useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";

import type { SidebarMenuItem, SubMenuItem } from "types/sidebar.type";
import styles from "./SidebarItem.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { sidebarIconMap } from "../../registry/iconRegistry";

const cx = classNames.bind(styles);

// Type guard to distinguish SidebarMenuItem from SubMenuItem
function isSidebarMenuItem(
  item: SidebarMenuItem | SubMenuItem
): item is SidebarMenuItem {
  return "children" in item;
}

function SidebarItem({
  item,
  id,
  expanded,
  handleExpand,
}: {
  item: SidebarMenuItem | SubMenuItem;
  id: string | number;
  expanded?: number | string | null;
  handleExpand: (id: number) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState<boolean>();
  const { userRole } = useContext(AuthContext);

  const Icon =
    "icon" in item && item.icon && item.icon in sidebarIconMap
      ? sidebarIconMap[item.icon as keyof typeof sidebarIconMap]
      : sidebarIconMap["DefaultIcon"];

  const handleNavigate = (_e: React.MouseEvent) => {
    if (isSidebarMenuItem(item)) {
      handleExpand(id as number);
    } else {
      console.log("navigating.");
      navigate(item.path);
    }
  };

  useEffect(() => {
    if (location.pathname === item.path) {
      setActive(true);
    } else if (
      isSidebarMenuItem(item) &&
      item.children &&
      location.pathname.includes(item.title)
    ) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [location.pathname, item]);

  // Render sidebar menu with children
  if (isSidebarMenuItem(item) && item.children) {
    if (userRole === "customer" && item.adminOnly) return null;

    return (
      <div className={cx("sidebar-item", { open: expanded === id })}>
        <div
          className={cx("sidebar-title")}
          onClick={() => handleExpand(id as number)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleExpand(id as number);
            }
          }}
        >
          <Icon />
          <span className={cx({ active })}>{item.title}</span>
          <div className={cx("toggle-btn")}>
            <SlArrowDown />
          </div>
        </div>
        <div className={cx("sidebar-content")}>
          {item.children.map((child, index) => {
            if (userRole === "customer" && child.adminOnly) return null;
            return (
              <SidebarItem
                key={index}
                id={index}
                item={child}
                expanded={expanded}
                handleExpand={handleExpand}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Render a leaf item (SubMenuItem or SidebarMenuItem without children)
  if (userRole === "customer" && item.adminOnly) return null;

  return (
    <>
      <div
        onClick={handleNavigate}
        className={cx("sidebar-item")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate(e as unknown as React.MouseEvent);
          }
        }}
      >
        <div
          className={cx(item.identity === "menu" ? "sidebar-title" : "plain")}
        >
          {item.identity === "sub-menu" ? null : <Icon />}
          <span className={active ? styles.active : ""}>{item.title}</span>
        </div>
      </div>
    </>
  );
}

export default SidebarItem;
