import classNames from "classnames/bind";
import React from "react";
import styles from "./SectionTag.module.scss";

const cx = classNames.bind(styles);

export default function SectionTag({
  text,
  className,
}: {
  text?: string,
  className?: string,
}) {
  return (
    <div className={cx("section-tag", className?.split(" "))}>
      {text || "Freshfarms"}
    </div>
  );
}
