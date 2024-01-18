import React, { useContext, useState, useEffect } from 'react';
import fetchMyDetails from '../../utils/fetchMyDetails';
import { AuthContext } from '../../context/AuthContext';
import { MdPhotoCamera } from 'react-icons/md';

import styles from './AdminProfile.module.scss';
import uploadProfilePhoto from '../../utils/uploadProfilePhoto';

function AdminProfile() {
    const { token } = useContext(AuthContext);
    const [profile, setProfile] = useState();
    const [loadingProfilePic, setLoadingProfilePic] = useState(false);

    //- cache busting
    let uniqueParam = `?${new Date().getTime()}`;

    useEffect(() => {
        async function asyncWrapper() {
            const response = await fetchMyDetails(token);
            if (response.status == 'success') {
                uniqueParam = `?${new Date().getTime()}`;
                setProfile(response.data);
            } else {
                console.log('Error fetching account details!');
            }
        }
        asyncWrapper();
    }, []);

    const handleUpload = async (e) => {
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
            setLoadingProfilePic(false);
        };
        input.click();
    };

    return (
        profile && (
            <div className={styles['container']}>
                <div className={styles['profile']}>
                    <div className={styles['profile-picture']}>
                        <figure
                            className={`${styles['figure']} ${
                                loadingProfilePic
                                    ? styles['figure--load'] +
                                      ' anim-rotating-border-2'
                                    : ''
                            } `}
                        >
                            <img
                                src={`https://tsabudh-shreekrishnadairy1.s3.ap-south-1.amazonaws.com/admins/profilePicture/${profile._id}-profile-picture.webp${uniqueParam}`}
                                alt=""
                                className=""
                            />
                        </figure>
                        <MdPhotoCamera
                            onClick={handleUpload}
                            title="Change profile picture."
                        />
                    </div>
                    <div className={styles['profile-field']}>
                        <span className={styles['key']}>Name</span>
                        <span className={styles['value']}>{profile.name}</span>
                    </div>
                    <div className={styles['profile-field']}>
                        <span className={styles['key']}>Phone</span>
                        <span className={styles['value']}>
                            {profile.phone.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </span>
                    </div>
                    <div className={styles['profile-field']}>
                        <span className={styles['key']}>Username</span>
                        <span className={styles['value']}>
                            {profile.username}
                        </span>
                    </div>
                    <div className={styles['profile-field']}>
                        <span className={styles['key']}>ID</span>
                        <span className={styles['value']}>{profile._id}</span>
                    </div>
                </div>
            </div>
        )
    );
}

export default AdminProfile;
