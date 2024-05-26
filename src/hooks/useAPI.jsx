import React, { useEffect, useState } from 'react';
import API_ROUTE from '../assets/globals/baseRoute';

const useAPI = (props) => {
    let { url, jwtToken, body, method, addedHeaders } = props;
    let apiRoute = `${API_ROUTE}/api/v1` + url;

    const [pendingStatus, setPendingStatus] = useState('static'); // posing must be in ['static','sending','success','failure']
    const [data, setData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const sendRequest = async (requestBody) => {
        setPendingStatus('sending');
        setErrorMessage(null);
        let responseObject = await requestAPI({
            url: apiRoute,
            method,
            jwtToken,
            body: requestBody,
            addedHeaders,
        });

        if (responseObject.status == 'success') {
            setData(responseObject.data);
            setPendingStatus('success');
        } else if (responseObject.status == 'failure') {
            setErrorMessage(
                responseObject.message || responseObject.errors[0].msg
            );
            setPendingStatus('failure');
            console.log(responseObject);
        }
    };

    return [pendingStatus, data, errorMessage, sendRequest];
};

export default useAPI;

const requestAPI = async (props) => {
    const { url, method, jwtToken, body, addedHeaders } = props;
    console.log('requesting API');
    let headers = {};

    headers['Content-Type'] =
        addedHeaders && addedHeaders['Content-Type']
            ? addedHeaders['Content-Type']
            : 'application/json';

    headers['Authorization'] = `Bearer ${jwtToken}`;

    // Appending addedHeaders to headers
    headers = Object.assign(headers, addedHeaders);

    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
    });
    return response.json();
};
