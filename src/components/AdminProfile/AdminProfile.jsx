import React, { useContext, useState, useEffect } from 'react';
import fetchMyDetails from '../../utils/fetchMyDetails';
import { AuthContext } from '../../context/AuthContext';
import { MdPhotoCamera } from 'react-icons/md';
import Button from '../UI/Button/Button';

import styles from './AdminProfile.module.scss';
import uploadProfilePhoto from '../../utils/uploadProfilePhoto';
import Tag from '../UI/Tag/Tag';
import updateAdmin from '../../utils/updateAdmin';

function AdminProfile() {
    const { token } = useContext(AuthContext);
    const [profile, setProfile] = useState();
    const [loadingProfilePic, setLoadingProfilePic] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const [editing, setEditing] = useState(false);
    const [adminPhone, setAdminPhone] = useState('');
    const [addedPhones, setAddedPhones] = useState([]);
    const [adminPhoneArray, setAdminPhoneArray] = useState([]);

    const deleteStoredPhoneTag = (e) => {
        console.log('tag');
        //- Return if not editing
        if (!editing) return;

        let tempAdminPhoneArray = [...adminPhoneArray];
        let matchedIndex = tempAdminPhoneArray.findIndex(
            (elem) => elem == e.target.innerText.toLowerCase()
        );
        if (matchedIndex >= 0) tempAdminPhoneArray.splice(matchedIndex, 1);
        setAdminPhoneArray(tempAdminPhoneArray);
    };
    const deleteAddedPhoneTag = (e) => {
        //- Return if not editing
        if (!editing) return;

        let tempAddedPhones = [...addedPhones];
        let matchedIndex = tempAddedPhones.findIndex(
            (elem) => elem == e.target.innerText.toLowerCase()
        );
        console.log(e.target.innerText);
        console.log(matchedIndex);
        if (matchedIndex >= 0) tempAddedPhones.splice(matchedIndex, 1);
        setAddedPhones(tempAddedPhones);
        console.log(tempAddedPhones);
    };

    const addAdminPhone = (e) => {
        if (!adminPhone || adminPhone == ' ') return;
        let newPhoneArray = [...addedPhones];

        let newNumber = adminPhone.toLowerCase().trim();

        if (newNumber.length != 10) return;

        //- adding new number to added phone state variable
        let newSet = new Set(newPhoneArray);
        if (newNumber.includes(',')) {
            let numArr = newNumber.split(',');
            numArr.forEach((num) => newSet.add(num));
        } else {
            newSet.add(newNumber);
        }
        console.log(newSet);
        setAddedPhones(Array.from(newSet));

        //- clearing input field after addition
        setAdminPhone('');
        newPhoneArray.push(newNumber);
    };

    //- cache busting
    let uniqueParam = `?${new Date().getTime()}`;

    //- Function for fetching adminDetails and setting it to profile state
    async function getSetAdminProfile() {
        const response = await fetchMyDetails(token);
        if (response.status == 'success') {
            uniqueParam = `?${new Date().getTime()}`;
            setProfile(response.data);
            setAdminPhoneArray(response.data.phone);
        } else {
            console.log('Error fetching account s!');
        }
    }

    //- Fetching adminDetails for first render
    useEffect(() => {
        getSetAdminProfile();
    }, []);

    const handlePictureUpload = async (e) => {
        e.preventDefault();

        //- Creating input element to select file
        let input = document.createElement('input');
        let file;
        input.type = 'file';
        input.name = 'profilePhoto';
        input.onchange = async () => {
            setLoadingProfilePic(true);

            file = input.files[0];
            let result = await uploadProfilePhoto(file, token);
            getSetAdminProfile();
            setLoadingProfilePic(false);
        };
        input.click();
    };

    const handleAdminPhone = (e) => {
        setAdminPhone(e.target.value);
    };

    const enableEditing = async (e) => {
        setEditing(true);
    };
    const disableEditing = async (e) => {
        setAdminPhoneArray(profile.phone);

        setEditing(false);
    };

    const uploadChanges = async (e) => {
        e.preventDefault();

        let formAdmin = document.getElementById('form-admin-edits');

        let formData = new FormData(formAdmin);
        formData.append('phone', addedPhones);

        let adminDetails = {};
        for (const [key, value] of formData) {
            if (value.trim().length != 0) adminDetails[key] = value;
        }
        console.log(...formData);
        console.log(formData.entries);
        console.log(adminDetails);

        const responseTxt = await updateAdmin(profile._id, adminDetails, token);
        if (responseTxt.status == 'success') {
            setProfile(responseTxt.data);
            setEditing(false);
        }
    };

    return (
        profile && (
            <div className={styles['container']}>
                <h3>Profile</h3>
                <div className={styles['profile']}>
                    <div className={styles['profile-edit']}>
                        {editing ? (
                            <Button
                                className="stylish01"
                                onClick={disableEditing}
                            >
                                Cancel
                            </Button>
                        ) : (
                            <Button
                                className="stylish01"
                                onClick={enableEditing}
                            >
                                Edit
                            </Button>
                        )}
                    </div>

                    <div className={styles['profile-picture']}>
                        <figure
                            className={`${styles['figure']} ${
                                loadingProfilePic
                                    ? styles['figure--load'] +
                                      ' anim-rotating-border-2'
                                    : ''
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
                    <div className={styles['field-wrapper']}>
                        <div className={styles['profile-field']}>
                            <span className={styles['key']}>Name</span>
                            <span className={styles['value']}>
                                {profile.name}
                            </span>
                        </div>

                        {/* //- Editing name */}
                        {editing && (
                            <div
                                className={`${styles['profile-field']} ${styles['profile-field--edits']}`}
                            >
                                <span
                                    className={`${styles['key']} ${styles['key--edits']}`}
                                >
                                    Change name
                                </span>
                                <input
                                    type="text"
                                    form="form-admin-edits"
                                    className={`${styles['value']} ${styles['value--edits']}`}
                                    name="name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* //- Phone  */}
                    <div className={styles['field-wrapper']}>
                        <div className={styles['profile-field']}>
                            <span className={styles['key']}>Phone</span>
                            <div className={styles['value']}>
                                {adminPhoneArray.map((item) => (
                                    <Tag
                                        key={item}
                                        className={`${
                                            editing
                                                ? 'inherit-text'
                                                : 'inherit-text'
                                        }`}
                                        onClick={deleteStoredPhoneTag}
                                        title='Remove Phone'
                                    >
                                        {item}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        {/*  //- Add phone numbers while ediding */}
                        {editing && (
                            <div
                                className={`${styles['profile-field']} ${styles['profile-field--edits']}`}
                            >
                                <div className={styles['key']}>
                                    {' '}
                                    Add phone number
                                </div>
                                <div className={`${styles['value']} `}>
                                    {editing &&
                                        addedPhones.map((item) => (
                                            <Tag
                                                key={item}
                                                className={`${
                                                    editing
                                                        ? 'green01 inherit-text'
                                                        : 'inherit-text'
                                                }`}
                                                onClick={deleteAddedPhoneTag}
                                            >
                                                {item}
                                            </Tag>
                                        ))}
                                    {editing && (
                                        <div
                                            className={styles['input-wrapper']}
                                        >
                                            <input
                                                type="text"
                                                value={adminPhone}
                                                onChange={handleAdminPhone}
                                                id="phoneToAdd"
                                                className={
                                                    styles['value--edits']
                                                }
                                            />
                                            <Button
                                                onClick={addAdminPhone}
                                                className="stylish02"
                                            >
                                                ADD
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* //- Username */}
                    <div className={styles['field-wrapper']}>
                        <div className={styles['profile-field']}>
                            <span className={styles['key']}>Username</span>
                            <span className={styles['value']}>
                                {profile.username}
                            </span>
                        </div>

                        {/*  //- Field to edit username */}
                        {editing && (
                            <div
                                className={`${styles['profile-field']} ${styles['profile-field--edits']}`}
                            >
                                <span
                                    className={`${styles['key']} ${styles['key--edits']}`}
                                >
                                    Change Username
                                </span>
                                <input
                                    type="text"
                                    form="form-admin-edits"
                                    className={`${styles['value']} ${styles['value--edits']}`}
                                    name="username"
                                    value={newUsername}
                                    onChange={(e) =>
                                        setNewUsername(e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </div>
                    {/* //- Id  */}
                    <div className={styles['field-wrapper']}>
                        <div className={styles['profile-field']}>
                            <span className={styles['key']}>ID</span>
                            <span className={styles['value']}>
                                {profile._id}
                            </span>
                        </div>
                    </div>

                    <div className={styles['hidden-form']}>
                        {/* //- Invisible form to get formData */}
                        <form id="form-admin-edits" />

                        {/* //- Save button if editing. */}
                        {editing ? (
                            <Button
                                className="action01 go"
                                onClick={uploadChanges}
                            >
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
