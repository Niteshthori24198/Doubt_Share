import '../Styles/register.css'
import React from 'react'
import axios from 'axios'

let hack = false;

let initialstate = {
    name: '',
    email: '',
    password: '',
    language: '',
    grade: null
}

let assignGradeSubject = {};

const reducer = (state = initialstate, { type, payload }) => {

    switch (type) {

        case 'name': {
            return {
                ...state,
                name: payload
            }
        }
        case 'email': {
            return {
                ...state,
                email: payload
            }
        }
        case 'password': {
            return {
                ...state,
                password: payload
            }
        }
        case 'language': {
            return {
                ...state,
                language: payload
            }
        }
        case 'grade': {
            return {
                ...state,
                grade: payload
            }
        }
        case 'reset': {
            return {
                ...initialstate
            }
        }
        default:
            throw new Error('Error')
    }

}


function Register() {

    const [show, setShow] = React.useState(false);
    const [state, dispatch] = React.useReducer(reducer, initialstate);

    const handleSubmit = (e) => {

        e.preventDefault();

        let invalidgrade = [];

        for (let k in assignGradeSubject) {
            if (assignGradeSubject[k].length == 0) {
                invalidgrade.push(k)
            }
        }

        for (let g of invalidgrade) {
            delete assignGradeSubject[g];
        }

        if (state.grade) {
            !hack && registerUser(state, 'student');
            !hack && dispatch({ type: 'reset' });
        } else {

            delete state.grade;
            let user = {
                ...state,
                assigned: {
                    ...assignGradeSubject
                }
            }
            !hack && registerUser(user, 'tutor');
            !hack && dispatch({ type: 'reset' });
            !hack && (document.getElementById('preferences').innerHTML = '');
            !hack && (document.querySelectorAll('.resetcheckbox').forEach((e) => {
                e.checked = false;
            }));
            !hack && (document.getElementById('tutorgrade').value = '');
        }
        hack = false;
    }

    return (

        <div className="registersection">
            <h2>Register Here</h2>
            <form onSubmit={handleSubmit}>

                <div>

                    <input type="text" placeholder='Enter your Name' value={state.name} onChange={(e) => dispatch({ type: 'name', payload: e.target.value })} required />

                    <input type="email" placeholder='Enter your email' value={state.email} onChange={(e) => dispatch({ type: 'email', payload: e.target.value })} required />

                    <input type="password" placeholder='Enter Password' value={state.password} onChange={(e) => dispatch({ type: 'password', payload: e.target.value })} required />

                    <select value={state.language} onChange={(e) => dispatch({ type: 'language', payload: e.target.value })} required>
                        <option value="">Select Language</option>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                    </select>

                    <select value={state.role} onChange={(e) => {
                        if (e.target.value === "tutor") {
                            setShow(true)
                        } else {
                            setShow(false)
                        }
                    }}>
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                    </select>

                    {!show && <select value={state.grade} onChange={(e) => dispatch({ type: 'grade', payload: +e.target.value })} required>
                        <option value="">Select Grade</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    }
                </div>

                {
                    show && <Tutor />
                }

                <input type="submit" value="Register" id="userregisterbtn" />

            </form>

            <div id='preferences'>

            </div>

        </div>
    )
}



function Tutor() {

    let grade;
    let pref = new Set();

    const handleclick = async () => {

        assignGradeSubject[grade] = Array.from(pref);
        pref = new Set();
        grade = null;

        hack = true;
        ShowPreferences();
    }

    const handlechange = (name, val) => {

        if (name === 'grade') {
            grade = +val;
            document.querySelectorAll('.resetcheckbox').forEach((e) => {
                e.checked = false;
            })
        } else {
            if (val) {
                pref.add(name);
            } else {
                pref.delete(name);
            }
        }
    }

    return <div>

        <select name="grade" id='tutorgrade' onChange={(e) => handlechange("grade", +e.target.value)} required>
            <option value="">Select Grade</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>

        <div style={{ width: "100%" }}></div>

        <div>

            <label>Hindi</label>
            <input type="checkbox" className='resetcheckbox' name="Hindi" onChange={(e) => handlechange("Hindi", e.target.checked)} />
            <label>English</label>
            <input type="checkbox" className='resetcheckbox' name="English" onChange={(e) => handlechange("English", e.target.checked)} />
            <label>Maths</label>
            <input type="checkbox" className='resetcheckbox' name="Maths" onChange={(e) => handlechange("Maths", e.target.checked)} />
            <label>Science</label>
            <input type="checkbox" className='resetcheckbox' name="Science" onChange={(e) => handlechange("Science", e.target.checked)} />
        </div>

        <button onClick={handleclick}>Add Preference</button>

    </div>

}


function registerUser(user, role) {

    axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/user/${role}/signup`,
        data: user
    }).then((res) => {
        console.log(res.data);
        alert('User Registration Done Successfully');
    }).catch((err) => {
        console.log(err)
    })
}


function ShowPreferences() {

    document.getElementById('preferences').innerHTML = `<table id="preferencetable">
            <thead>
                <th>Grade</th>
                <th>Subject</th>
                <th>Review Preference</th>

            </thead>
            <tbody>
                ${Object.entries(assignGradeSubject).map((e) => {
                        return `<tr>
                                <td>${e[0]}</td>
                                <td>${e[1].join(',')}</td>
                                <td><button class="removebtn" id="${e[0]}">Remove</button></td>
                            </tr > `
                        }).join('')
                            }
            </tbody>
        </table>`

    document.querySelectorAll('.removebtn').forEach(e => e.addEventListener('click', (e) => {
        delete assignGradeSubject[e.target.id];
        ShowPreferences();
    }))

}


export default Register

