import React from "react";
import styles from "./Interlocutor.module.scss";
import Img from "../General/Img";
import profilepic from "../../Assets/Images/profilepic.png";
import { useContext, useEffect } from "react";
import { ChannelsContext } from "../../Context/ChannelsContext";
import { OpennerContext } from "../../Context/OpennerContext";
import { LoggedInUserContext } from "../../Context/LoggedInUserContext";
import { MessengerMessagesContext } from "../../Context/MessagesContext";
import nameFormatter from "../../Utils/Nameformatter";

import { AvatarGenerator } from "random-avatar-generator";

function Kausap({ update }) {
  const { messenger, messengerObject, setMessengerObject } = useContext(
    MessengerMessagesContext
  );
  const { userChannels, channelMembers, setDisplayChannelMembers } =
    useContext(ChannelsContext);
  const { usersList } = useContext(LoggedInUserContext);
  const { setIsOpenChannelMembers } = useContext(OpennerContext);
  let mesObj;
  function funcdisplayChannelMembers() {
    let newwww = channelMembers.map((obj) => obj.user_id);
    let membersEmails = usersList
      .filter((obj) => newwww.includes(obj.id))
      .map((obj) => obj.email);
    console.log(membersEmails);
    setIsOpenChannelMembers(true);
    console.log("add members open");
    setDisplayChannelMembers(membersEmails);
  }
  //get selected DMed
  useEffect(() => {
    if (messenger) {
      if (JSON.stringify(messenger).includes("@")) {
        mesObj = usersList.find((obj) => obj.uid === messenger);
        setMessengerObject(mesObj);
      } else {
        mesObj = userChannels.data.find((obj) => obj.name === messenger);
        setMessengerObject(mesObj);
        console.log(userChannels.data.length);
      }
    }
  }, [messenger, update]);
  const avatar = new AvatarGenerator();
  return (
    <>
      <div className={styles.contain}>
        <div className={styles.imgname}>
          {messenger && (
            <img
              className={styles.imgcontain}
              src={avatar.generateRandomAvatar(`${messenger}`)}
            />
          )}
          {messenger && (
            <h1 className={styles.textkausap}>{nameFormatter(messenger)}</h1>
          )}
        </div>
        {messengerObject && (
          <div className={styles.logoscont}>
            {messengerObject.name && (
              <i
                onClick={funcdisplayChannelMembers}
                id={styles.members}
                class="las la-users"
              ></i>
            )}
            <i id={styles.call} class="las la-phone"></i>
          </div>
        )}
      </div>
    </>
  );
}

export default Kausap;
