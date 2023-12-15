import '../Styles/doubts.css'
import axios from 'axios';
import React from 'react';
import { appContext } from '../AuthContext/AuthContextProvider';

function Doubts() {

    const [doubts, setDoubts] = React.useState([]);

    const { userRole } = React.useContext(appContext);

    const [solution, setSolution] = React.useState('');


    React.useEffect(() => {

        axios.get(`${process.env.REACT_APP_BASE_URL}/doubt/history`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then((res) => {
            setDoubts(res.data.doubts)
        }).catch((err) => {
            console.log(err)
        })

    }, [])


    const handleDoubtSolution = (doubtId) => {
        openForm(doubtId);
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        let doubtId = document.getElementById("myForm").getAttribute('doubtId');

        axios.post(`${process.env.REACT_APP_BASE_URL}/doubt/handle/${doubtId}`,
            { solution }
            , {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }


    function openForm(doubtId) {

        document.getElementById("myForm").style.display = "block";
        document.getElementById("myForm").setAttribute('doubtId', doubtId);
    }

    function closeForm() {
        document.getElementById("myForm").style.display = "none";
    }

    return <>
        <table id="doubtpagetable">
            <thead>
                <th>S.No</th>
                <th>Student-Email</th>
                <th>Tutor-Email</th>
                <th>Doubt-Subject</th>
                <th>Doubt-Description</th>
                <th>Doubt-Solution</th>
                {userRole === 'tutor' && <th>Action</th>}
            </thead>

            <tbody>

                {doubts.map((e, i) => {
                    return (
                        <tr key={i}>
                            <td>{e.id}</td>
                            <td>{e.studentEmail}</td>
                            <td>{e.tutorEmail ? e.tutorEmail : "Not Assigned"}</td>
                            <td>{e.doubtSubject}</td>
                            <td>{e.doubtDescription ? e.doubtDescription : "-"}</td>
                            <td>{e.doubtSolution ? e.doubtSolution : "-"}</td>
                            {userRole === 'tutor' && <td><button className='doubtsolutionbutton' onClick={() => handleDoubtSolution(e.id)}>Add Solution</button></td>}
                        </tr>
                    )
                })}

            </tbody>
        </table>

        <form id='myForm' onSubmit={handlesubmit} style={{ display: 'none' }}>
            <textarea placeholder='Add solution here' value={solution} name="solution" cols="12" rows="5" onChange={(e) => setSolution(e.target.value)}></textarea>
            <div>
                <button onClick={(e) => {
                    e.preventDefault();
                    closeForm()
                }}>Close</button>
                <input type='submit' value='Submit' />
            </div>
        </form>

    </>

}



export default Doubts
