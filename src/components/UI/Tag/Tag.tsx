import React from "react";
import styles from "./Tag.module.scss";

type InputOrClickEvent =
  | React.MouseEvent<HTMLButtonElement>
  | React.ChangeEvent<HTMLInputElement>;

type TagProps = {
  title?: string;
  className?: string;
  onClick?:
    | React.MouseEventHandler<HTMLDivElement>
    | React.KeyboardEventHandler<HTMLDivElement> 
    | ((event: InputOrClickEvent) => void);
  children?: React.ReactNode;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

const Tag: React.FC<TagProps> = (props) => {
  let classArray, classNames;
  const handleActivate = () => {
    props.onClick?.(
      new MouseEvent("click") as unknown as React.MouseEvent<HTMLDivElement>
    );
  };
  if (props.className) {
    classArray = props.className.split(" ");
    classArray.push("tag");
    classNames = classArray.map((item) => styles[item]).join(" ");
  } else {
    classNames = styles["tag"];
  }
  return (
    <div
      role="button"
      title={props.title}
      className={classNames}
      tabIndex={0}
      onClick={props.onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
    >
      {props.children}
    </div>
  );
};

export default Tag;
