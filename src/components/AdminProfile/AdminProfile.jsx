import React, { useContext, useState, useEffect } from 'react';
import fetchMyDetails from '../../utils/fetchMyDetails';
import { AuthContext } from '../../context/AuthContext';
import { MdPhotoCamera } from 'react-icons/md';

import styles from './AdminProfile.module.scss';

function AdminProfile() {
    const { token } = useContext(AuthContext);
    const [profile, setProfile] = useState();

    useEffect(() => {
        async function asyncWrapper() {
            const response = await fetchMyDetails(token);
            console.log(response);
            if (response.status == 'success') {
                setProfile(response.data);
            } else {
                console.log('Error fetching account details!');
            }
        }
        asyncWrapper();
    }, []);


const handleUpload = (e) =>{
    e.preventDefault();
    


}

    return (
        profile && (
            <div className={styles['container']}>
                <p>Admin Profile</p>
                <div className={styles['profile']}>
                    <div className={styles['profile-picture']}>
                        <figure className={styles['figure']}>
                            <img
                                src={`https://tsabudh-shreekrishnadairy1.s3.ap-south-1.amazonaws.com/admins/profilePicture/${profile._id}-profile-picture.webp`}
                                alt=""
                                className=""
                            />
                        </figure>
                            <MdPhotoCamera onClick={handleUpload}/>
                    </div>
                    <input type="file" />
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
                </div>
            </div>
        )
    );
}

export default AdminProfile;
