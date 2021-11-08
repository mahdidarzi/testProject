import React from "react";
import styles from "../../../styles/Home.module.css";

export default function UserItem({ user }) {
  //i can reduce bellow code lines with loops
  return (
    <a href="https://nextjs.org/learn" className={styles.card}>
      <h2>id: ${user.id} &rarr;</h2>
      <h2>name: ${user.name} &rarr;</h2>
      <h2>email: ${user.email} &rarr;</h2>
      <h2>address: ${user.address.street} &rarr;</h2>
      <h2>suite: ${user.address.suite} &rarr;</h2>
      <h2>city: ${user.address.city} &rarr;</h2>
      <h2>zipcode: ${user.address.zipcode} &rarr;</h2>
      <h2>geo.lat: ${user.address.geo.lat} &rarr;</h2>
      <h2>geo.lng: ${user.address.geo.lng} &rarr;</h2>
      <h2>phone: ${user.phone} &rarr;</h2>
      <h2>website: ${user.website} &rarr;</h2>
      <h2>website: ${user.website} &rarr;</h2>
      <h2>company.name: ${user.company.name} &rarr;</h2>
      <h2>company.name: ${user.company.name} &rarr;</h2>
      <h2>company.catchPhrase: ${user.company.catchPhrase} &rarr;</h2>
      <h2>company.bs: ${user.company.bs} &rarr;</h2>
    </a>
  );
}
