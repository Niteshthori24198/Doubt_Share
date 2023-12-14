
import React from 'react'
import axios from 'axios';

function CreateDoubt() {

    const [doubtInfo, setDoubtInfo] = React.useState({
        doubtSubject: '',
        doubtDescription: ''
    });

    const handlesubmit = (e) => {

        e.preventDefault();

        axios.post(
            `${process.env.REACT_APP_BASE_URL}/doubt/create`,
            doubtInfo,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log(res.data);
            alert('Doubt created successfully');
        }).catch((err) => {
            console.error(err);
        });

    }

    return (

        <div>
            <form onSubmit={handlesubmit}>
                <select name="subject" id="selsubjectval" value={doubtInfo.doubtSubject} onChange={(e) => setDoubtInfo({ ...doubtInfo, doubtSubject: e.target.value })} required>
                    <option value="">Select Subject</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Maths">Maths</option>
                    <option value="Science">Science</option>
                </select>

                <textarea name="doubt" id="doubtdesc" cols="20" rows="5" value={doubtInfo.doubtDescription} onChange={(e) => setDoubtInfo({ ...doubtInfo, doubtDescription: e.target.value })}></textarea>

                <button type='submit'>Create Doubt</button>
            </form>

        </div>

    )
}

export default CreateDoubt
