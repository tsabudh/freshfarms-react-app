import { BiUser, BiHome, BiQuestionMark } from "react-icons/bi";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaUserAlt, FaRegUser } from "react-icons/fa";
import {
  MdOutlineDashboardCustomize,
  MdOutlineStorefront,
  MdChatBubbleOutline,
} from "react-icons/md";
import { TbCalendarDollar } from "react-icons/tb";

const DefaultIcon = BiQuestionMark;

export const sidebarIconMap = {
  BiUser,
  BiHome,
  FaUserAlt,
  DefaultIcon,
  MdOutlineDashboardCustomize,
  TbCalendarDollar,
  BsFillPersonLinesFill,
  MdOutlineStorefront,
  FaRegUser,
  MdChatBubbleOutline,
};

export type SidebarIconName = keyof typeof sidebarIconMap;
