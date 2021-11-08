import React from "react";
import styles from "../../../styles/Home.module.css";

export default function UserItem({user}) {
  return (
    // <div>
      <a href="https://nextjs.org/learn" className={styles.card}>
        <h2>${user.id} &rarr;</h2>
        <p>Learn about Next.js in an interactive course with quizzes!</p>
      </a>
    // </div>
  );
}
