import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Login = props => {//functional component called Login using props as an argument

    const [name, setName] = useState("")//Use the useState hook to create a state variable for the name, initialized to an empty string
    const [id, setId] = useState("")

    
    const onChangeName = e => {//Function to handle changes in the name input fiel
        const name = e.target.value//Get the current value of the input field
        setName(name);//Update the name state with the new value
    }
    const onChangeId = e => {
        const id = e.target.value
        setId(id);
    }
    const login = () => {//Function to handle the login action
        props.login({ name: name, id: id })//Call the login function passed in via props, passing an object with the name and id
        props.history.push('/')//Navigate to the home page after login
    }
    return (//Return the JSX for rendering the component
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={name}
                        onChange={onChangeName}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter id"
                        value={id}
                        onChange={onChangeId}
                    />
                </Form.Group>
                <Button variant="primary" onClick={login}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}
export default Login;