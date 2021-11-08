import React from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/Home.module.css";
import UserItem from "./UserItem";

export default function RenderUsersList({}) {
  const states = useSelector((state) => state);
  let usersList = states.usersReducer.users;

  const renderUserList = () => {
    return usersList.map((user, index) => {
      //we use of UserItem item to show user data
      return <UserItem key={index} user={user} />;
    });
  };

  return <div className={styles.grid}>{renderUserList()}</div>;
}
