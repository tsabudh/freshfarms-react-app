import classNames from "classnames/bind";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { MdPhotoCamera } from "react-icons/md";

import styles from "./AdminProfile.module.scss";
import { AuthContext } from "../../context/AuthContext";

import { UserProfile } from "../../types/user.interface";
import { fetchMyDetails } from "../../utils/fetchMyDetails";
import { updateAdmin } from "../../utils/updateAdmin";
import Button from "../UI/Button/Button";
import Tag from "../UI/Tag/Tag";

const cx = classNames.bind(styles);
function AdminProfile() {
  const { jwtToken, user } = useContext(AuthContext);

  const [profile, setProfile] = useState<UserProfile>();
  const [loadingProfilePic, setLoadingProfilePic] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");

  const [editing, setEditing] = useState<boolean>(false);
  const [adminPhone, setUserPhone] = useState<string>("");
  const [addedPhones, setAddedPhones] = useState<string[]>([]);
  const [adminPhoneArray, setUserPhoneArray] = useState<UserProfile["phone"]>(
    []
  );

  const deleteStoredPhoneTag = (e: React.MouseEvent<HTMLElement>) => {
    if (!editing) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const text = target.innerText.toLowerCase();

    const tempAdminPhoneArray = [...adminPhoneArray];
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

    const tempAddedPhones = [...addedPhones];
    const matchedIndex = tempAddedPhones.findIndex((elem) => elem === text);
    if (matchedIndex >= 0) tempAddedPhones.splice(matchedIndex, 1);
    setAddedPhones(tempAddedPhones);
  };

  const addAdminPhone = () => {
    if (!adminPhone || adminPhone == " ") return;
    const newPhoneArray = [...addedPhones];

    const newNumber = adminPhone.toLowerCase().trim();

    if (newNumber.length != 10) return;

    //- adding new number to added phone state variable
    const newSet = new Set<string>(newPhoneArray);
    if (newNumber.includes(",")) {
      const numArr = newNumber.split(",");
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
  const uniqueParam = `?${Date.now()}`;

  //- Function for fetching adminDetails and setting it to profile state
  const getSetAdminProfile = useCallback(async () => {
    if (!jwtToken) throw new Error("JWT Token not found in context");
    if (!user) throw new Error("User not found in context");
    const response = await fetchMyDetails(jwtToken, user.userRole);
    if (response.status === "success") {
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

  const handlePictureUpload = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    //- Creating input element to select file
    const input = document.createElement("input");
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
        // const previewUrl = URL.createObjectURL(file);
        // setPreview(previewUrl);

        // ... upload logic here
        //  const result = await uploadProfilePhoto(file, jwtToken);
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

  const enableEditing = async () => {
    setEditing(true);
  };
  const disableEditing = async () => {
    if (!profile) return;
    setUserPhoneArray(profile.phone);

    setEditing(false);
  };

  const uploadChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!profile || !jwtToken) return;

    const el = document.getElementById("form-admin-edits");
    if (!el) return;
    const formAdmin: HTMLFormElement = el as HTMLFormElement;

    const formData = new FormData(formAdmin);
    formData.append("phone", JSON.stringify(addedPhones));

    const adminDetails: Partial<Record<keyof UserProfile, string | object>> = {};

    for (const [key, value] of formData) {
      const typedKey = key as keyof UserProfile;
      if (typeof value === "string" && value.trim().length !== 0) {
        adminDetails[typedKey] = value;
      } else if (value instanceof File && value.name) {
        adminDetails[typedKey] = value;
      }
    }
    type UpdateAdminResponse = {
      status: "success" | "error";
      data: UserProfile;
    };
    const responseTxt = await updateAdmin(
      profile._id,
      adminDetails as UserProfile,
      jwtToken
    ) as UpdateAdminResponse;
    if (responseTxt.status == "success") {
      setProfile(responseTxt.data);
      setEditing(false);
    }
  };

  if (!jwtToken || !user) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

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
