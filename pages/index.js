import { useEffect } from "react";
import { APIService } from "../src/utils/apiService";
import styles from "../styles/Home.module.css";
import { usersUrl } from "../src/constantes/webServiceUrl";
import { GetMethod } from "../src/constantes/globalTexts";
import { useDispatch } from "react-redux";
import { changeUserLists } from "../src/redux/users/usersActions";
import RenderUsersList from "../src/componets/users/RenderUsersList";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    //for get user list of backend
    getListes();
  }, []);

  const getListes = () => {
    //APIService is custome function for send web request that maked by me(Mahdi Darzi) to handle request better in larg projectes
    APIService(
      usersUrl,
      GetMethod,
      {
        onSuccess(res) {
          const data = res.data;
          dispatch(changeUserLists(data));
        },
        onFail(err) {
          console.log(err);
        },
      },
      null,
      {
        useAccessToken: true,
      }
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* we use of bellow component to show users list */}
        <RenderUsersList />
      </main>
    </div>
  );
}