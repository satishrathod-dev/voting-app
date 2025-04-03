import React, { Children, createContext, useState } from 'react'

export const UserDataContext = createContext();
const UserContext = ({children}) => {

    const [user, setUser] = useState({
        email: "",
        fullname: {
            firstName: "",
            lastName: ""
        },
    })

    const [tasks, setTasks] = useState([]);


  return (
    <div>
      <UserDataContext.Provider value={{user, setUser, tasks, setTasks}}> 
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
