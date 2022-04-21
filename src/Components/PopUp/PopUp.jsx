import React, { useState } from "react";
import Btn from "../General/Button";
import styles from "../PopUp/PopUp.module.scss";
import { useContext } from "react";
import { OpennerContext } from "../../Context/OpennerContext";
import Input from "../General/Input";
import UserListGenerator from "../../Utils/UserListGenerator";
import { ChannelsContext } from "../../Context/ChannelsContext";
import API from "../../Utils/API";
import { LoggedInUserContext } from "../../Context/LoggedInUserContext";
import { MessengerMessagesContext } from "../../Context/MessagesContext";

function PopUp({ updateMe }) {
  const {
    isOpen,
    setIsOpen,
    isOpenChannel,
    setIsOpenChannel,
    isOpenChannelMembers,
    setIsOpenChannelMembers,
  } = useContext(OpennerContext);

  const { setMessenger, messengerObject } = useContext(
    MessengerMessagesContext
  );
  const { userHeaders, usersList } = useContext(LoggedInUserContext);
  const { displayChannelMembers } = useContext(ChannelsContext);
  const { setAddThisChannel } = useContext(ChannelsContext);
  const [chosenUser, setChosenUser] = useState();
  const [channelName, setChannelName] = useState();
  const [channelMembers, setChannelMembers] = useState([{ user_ids: "" }]);

  const axiosCreateChannel = () => {
    API.post(
      "/channels",
      {
        name: channelName,
        user_ids: channelMembers.map((ids) => {
          return ids.user_ids;
        }),
      },
      { headers: userHeaders }
    ).catch((err) => {
      console.log(`add channel error ${err}`);
    });
    updateMe();
  };

  const axiosChannelAddMembers = () => {
    API.post(
      "/channel/add_member",
      {
        id: messengerObject.id,
        member_id: channelMembers[0].user_ids,
      },
      { headers: userHeaders }
    ).catch((err) => {
      console.log(`add member ${err}`);
    });
    updateMe();
  };

  function addChannelMembers() {
    setChannelMembers([...channelMembers, { user_ids: "" }]);
    console.log("add input");
  }

  function handleChannelNameChange() {
    setAddThisChannel(channelName);
    console.log(channelName);
  }

  function handleChange(i, e) {
    let newChannelMembers = [...channelMembers];
    newChannelMembers[i][e.target.name] = e.target.value;
    setChannelMembers(newChannelMembers);
  }

  function handleBlur(i, e) {
    let onDataList = usersList.find((obj) => obj.uid === e.target.value);
    if (onDataList !== undefined) {
      let newChannelMembers = [...channelMembers];
      newChannelMembers[i][e.target.name] = onDataList.id;
      setChannelMembers(newChannelMembers);
    } else {
      alert("email not found");
      e.target.value = "";
      let newChannelMembers = [...channelMembers];
      newChannelMembers[i][e.target.name] = "";
    }
  }

  function submitAddMembers(e) {
    e.preventDefault();
    console.log("membersadd");
    axiosChannelAddMembers();
    setIsOpenChannelMembers(false);
    updateMe();
  }

  function submitSelectMessenger(e) {
    e.preventDefault();
    setMessenger(chosenUser);
    setIsOpen(false);
  }

  function submitCreateChannel(e) {
    e.preventDefault();
    axiosCreateChannel();
    updateMe();
    setTimeout(() => {
      setIsOpenChannel(false);
    }, 2000);
  }
  //closebutton
  function closePopUp() {
    setIsOpen(false);
    setIsOpenChannel(false);
    setIsOpenChannelMembers(false);
  }

  return (
    <>
      <div className={styles.contain}>
        <div className={styles.box}>
          {isOpenChannel && (
            <>
              <form className={styles.pmform} onSubmit={submitCreateChannel}>
                <div className={styles.channelform}>
                  <h2 className={styles.label}>Channel Name:</h2>
                  <Input
                    className={styles.datalistinputfield}
                    onChange={(e) => setChannelName(e.target.value)}
                    autoComplete="off"
                    required={true}
                    onBlur={handleChannelNameChange}
                  />
                  <h2 className={styles.label}>Members:</h2>
                  <Btn
                    className={styles.button}
                    content={"Add"}
                    onClick={() => addChannelMembers()}
                    type="button"
                  />
                </div>
                {channelMembers.map((element, index) => (
                  <>
                    <Input
                      key={index}
                      name="user_ids"
                      list="userlist"
                      className={styles.datalistinputfield}
                      value={element.user_ids || ""}
                      onChange={(e) => handleChange(index, e)}
                      onBlur={(e) => handleBlur(index, e)}
                      autoComplete="off"
                      required={true}
                    />
                    <datalist id="userlist">
                      <UserListGenerator usersArray={usersList} />
                    </datalist>
                  </>
                ))}

                <Btn
                  className={styles.button}
                  content={"Add Channel"}
                  type={"submit"}
                />
              </form>
            </>
          )}
          {isOpen && (
            <>
              <h2 className={styles.label}>Send To:</h2>
              <form className={styles.pmform} onSubmit={submitSelectMessenger}>
                <Input
                  list="userlist"
                  className={styles.datalistinputfield}
                  onChange={(e) => setChosenUser(e.target.value)}
                  autoComplete="off"
                  required={true}
                />
                <datalist id="userlist">
                  <UserListGenerator usersArray={usersList} />
                </datalist>
                <Btn
                  className={styles.button}
                  content={"Submit"}
                  type={"submit"}
                />
              </form>
            </>
          )}
          {isOpenChannelMembers && (
            <>
              <div className={styles.channelform}>
                <ul>
                  {displayChannelMembers &&
                    displayChannelMembers.map((element) => (
                      <li key={element}>{element}</li>
                    ))}
                </ul>
              </div>
              <form className={styles.pmform} onSubmit={submitAddMembers}>
                <>
                  <h2 className={styles.label}>Add Members</h2>
                  {channelMembers.map((element, index) => (
                    <>
                      <Input
                        key={index}
                        name="user_ids"
                        list="userlist"
                        className={styles.datalistinputfield}
                        value={element.user_ids || ""}
                        onChange={(e) => handleChange(index, e)}
                        onBlur={(e) => handleBlur(index, e)}
                        autoComplete="off"
                        required={true}
                      />
                      <datalist id="userlist">
                        <UserListGenerator usersArray={usersList} />
                      </datalist>
                    </>
                  ))}
                </>
                <Btn
                  className={styles.button}
                  content={"Submit"}
                  type={"submit"}
                />
              </form>
            </>
          )}
          <i
            id={styles.close}
            onClick={closePopUp}
            class="las la-times-circle"
          ></i>
        </div>
      </div>
    </>
  );
}

export default PopUp;
