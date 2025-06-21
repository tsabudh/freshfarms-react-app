import React, { useContext, useState, useEffect, useCallback } from "react";
import classNames from "classnames/bind";
import { MdPhotoCamera } from "react-icons/md";

import { AuthContext } from "../../context/AuthContext";
import styles from "./AdminProfile.module.scss";

import Button from "../UI/Button/Button";
import uploadProfilePhoto from "../../utils/uploadProfilePhoto";
import Tag from "../UI/Tag/Tag";
import fetchMyDetails from "../../utils/fetchMyDetails";
import updateAdmin from "../../utils/updateAdmin";
import { UserProfile } from "../../types/user.interface";

const cx = classNames.bind(styles);
function AdminProfile() {
  const { jwtToken, user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile>();
  const [loadingProfilePic, setLoadingProfilePic] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [editing, setEditing] = useState(false);
  const [adminPhone, setUserPhone] = useState("");
  const [addedPhones, setAddedPhones] = useState<string[]>([]);
  const [adminPhoneArray, setUserPhoneArray] = useState<UserProfile["phone"]>(
    []
  );

  const deleteStoredPhoneTag = (e: React.MouseEvent<HTMLElement>) => {
    if (!editing) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const text = target.innerText.toLowerCase();

    let tempAdminPhoneArray = [...adminPhoneArray];
    const matchedIndex = tempAdminPhoneArray.findIndex((elem) => elem === text);
    if (matchedIndex >= 0) tempAdminPhoneArray.splice(matchedIndex, 1);

    setUserPhoneArray(tempAdminPhoneArray);
  };

  const deleteAddedPhoneTag = (e: React.MouseEvent<HTMLElement>) => {
    //- Return if not editing
    if (!editing) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const text = target.innerText.toLowerCase();

    let tempAddedPhones = [...addedPhones];
    let matchedIndex = tempAddedPhones.findIndex((elem) => elem === text);
    if (matchedIndex >= 0) tempAddedPhones.splice(matchedIndex, 1);
    setAddedPhones(tempAddedPhones);
  };

  const addAdminPhone = (e: React.MouseEvent<HTMLElement>) => {
    if (!adminPhone || adminPhone == " ") return;
    let newPhoneArray = [...addedPhones];

    let newNumber = adminPhone.toLowerCase().trim();

    if (newNumber.length != 10) return;

    //- adding new number to added phone state variable
    let newSet = new Set<string>(newPhoneArray);
    if (newNumber.includes(",")) {
      let numArr = newNumber.split(",");
      numArr.forEach((num: string) => newSet.add(num));
    } else {
      newSet.add(newNumber);
    }
    setAddedPhones(Array.from(newSet));

    //- clearing input field after addition
    setUserPhone("");
    newPhoneArray.push(newNumber);
  };

  //- cache busting
  let uniqueParam = `?${new Date().getTime()}`;

  //- Function for fetching adminDetails and setting it to profile state
  const getSetAdminProfile = useCallback(async () => {
    if (!user) throw new Error("User not found in context");
    const response = await fetchMyDetails(jwtToken, user.role);
    if (response.status === "success") {
      uniqueParam = `?${new Date().getTime()}`;
      setProfile(response.data);
      setUserPhoneArray(response.data.phone);
    } else {
      console.error("Error fetching account!");
    }
  }, [jwtToken, user]);

  //- Fetching adminDetails for first render
  useEffect(() => {
    getSetAdminProfile();
  }, [getSetAdminProfile]);

  const handlePictureUpload = async (e:  React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();

    //- Creating input element to select file
    let input = document.createElement("input");
    input.type = "file";
    input.name = "profilePhoto";
    input.onchange = async () => {
      setLoadingProfilePic(true);

      const file = input.files?.[0]; // ✅ safer with optional chaining
      if (!file) return;
      try {
        // handle file (upload, preview, etc.)
        console.log("Selected file:", file);

        // TODO: CREATE A PREVIEW OF THE IMAGE
        const previewUrl = URL.createObjectURL(file);
        // setPreview(previewUrl);

        // ... upload logic here
        let result = await uploadProfilePhoto(file, jwtToken);
        getSetAdminProfile();
        setLoadingProfilePic(false);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setLoadingProfilePic(false);
      }
    };
    input.click();
  };

  const handleAdminPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhone(e.target.value);
  };

  const enableEditing = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditing(true);
  };
  const disableEditing = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setUserPhoneArray(profile.phone);

    setEditing(false);
  };

  const uploadChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!profile) return;

    const el = document.getElementById("form-admin-edits");
    if (!el) return;
    let formAdmin: HTMLFormElement = el as HTMLFormElement;

    let formData = new FormData(formAdmin);
    formData.append("phone", JSON.stringify(addedPhones));

    const adminDetails: { [key: string]: any } = {};
    for (const [key, value] of formData) {
      if (typeof value === "string" && value.trim().length !== 0) {
        adminDetails[key] = value;
      } else if (value instanceof File && value.name) {
        adminDetails[key] = value;
      }
    }

    const responseTxt = await updateAdmin(profile._id, adminDetails, jwtToken);
    if (responseTxt.status == "success") {
      setProfile(responseTxt.data);
      setEditing(false);
    }
  };

  return (
    profile && (
      <div className={styles["container"]}>
        <h3>Profile</h3>
        <div className={styles["profile"]}>
          <div className={styles["profile-edit"]}>
            {editing ? (
              <Button className="stylish01" onClick={disableEditing}>
                Cancel
              </Button>
            ) : (
              <Button className="stylish01" onClick={enableEditing}>
                Edit
              </Button>
            )}
          </div>

          <div className={styles["profile-picture"]}>
            <figure
              className={`${styles["figure"]} ${
                loadingProfilePic
                  ? styles["figure--load"] + " anim-rotating-border-2"
                  : ""
              } `}
            >
              {!loadingProfilePic ? (
                <img
                  src={`https://tsabudh-shreekrishnadairy1.s3.ap-south-1.amazonaws.com/admins/profilePicture/${profile._id}-profile-picture.webp${uniqueParam}`}
                  alt=""
                  className=""
                />
              ) : null}
            </figure>
            {editing ? (
              <MdPhotoCamera
                onClick={handlePictureUpload}
                title="Change profile picture."
              />
            ) : null}
          </div>

          {/* //- Name */}
          <div className={cx("field-wrapper")}>
            <div className={cx("profile-field")}>
              <span className={cx("key")}>Name</span>
              <span className={cx("value", "name")}>{profile.name}</span>
            </div>

            {/* //- Editing name */}
            {editing && (
              <div className={cx(["profile-field", "profile-field--edits"])}>
                <span className={cx(["key", "key-edits"])}>Change name</span>
                <input
                  type="text"
                  form="form-admin-edits"
                  className={`${styles["value"]} ${styles["value--edits"]}`}
                  name="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* //- Phone  */}
          <div className={cx("field-wrapper")}>
            <div className={cx("profile-field")}>
              <span className={cx("key")}>Phone</span>
              <div className={cx("value")}>
                {adminPhoneArray.map((item) => (
                  <Tag
                    key={item}
                    className={`${editing ? "inherit-text" : "inherit-text"}`}
                    onClick={deleteStoredPhoneTag}
                    title="Remove Phone"
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>

            {/*  //- Add phone numbers while ediding */}
            {editing && (
              <div className={cx(["profile-field", "profile-field-edits"])}>
                <div className={cx("key")}> Add phone number</div>
                <div className={cx("value")}>
                  {editing &&
                    addedPhones.map((item) => (
                      <Tag
                        key={item}
                        className={`${
                          editing ? "green01 inherit-text" : "inherit-text"
                        }`}
                        onClick={deleteAddedPhoneTag}
                      >
                        {item}
                      </Tag>
                    ))}
                  {editing && (
                    <div className={styles["input-wrapper"]}>
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={handleAdminPhone}
                        id="phoneToAdd"
                        className={styles["value--edits"]}
                      />
                      <Button onClick={addAdminPhone} className="stylish02">
                        ADD
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* //- Username */}
          <div className={cx("field-wrapper")}>
            <div className={cx("profile-field")}>
              <span className={cx("key")}>Username</span>
              <span className={cx("value")}>{profile.username}</span>
            </div>

            {/*  //- Field to edit username */}

            {editing && (
              <div className={cx(["profile-field", "profile-field-edits"])}>
                <span className={cx(["key", "key-edits"])}>
                  Change Username
                </span>
                <input
                  type="text"
                  form="form-admin-edits"
                  className={`${styles["value"]} ${styles["value--edits"]}`}
                  name="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
            )}
          </div>
          {/* //- Id  */}
          <div className={cx("field-wrapper")}>
            <div className={cx("profile-field")}>
              <span className={cx("key")}>ID</span>
              <span className={cx("value")}>{profile._id}</span>
            </div>
          </div>

          <div className={styles["hidden-form"]}>
            {/* //- Invisible form to get formData */}
            <form id="form-admin-edits" />

            {/* //- Save button if editing. */}
            {editing ? (
              <Button className="action01 go" onClick={uploadChanges}>
                Save
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    )
  );
}

export default AdminProfile;
