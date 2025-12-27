import React, {useState, useEffect, useContext} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {FaEdit} from 'react-icons/fa'
import {PiCheckFatFill} from 'react-icons/pi'
import { UserContext } from '../context/userContext'
import axios from 'axios'

const UserProfile = () => {
  const {id} = useParams();
  const [avatar, setAvatar] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [error, setError] = useState('')

  const [isAvatarTouched, setIsAvatarTouched] = useState(false)

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  //redirect to login page for any user who isn't logged in 
    useEffect(()=> {
      if(!token){
        navigate('/login')
      }
    },[navigate, token])


    useEffect(() => {
      const getUser = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
        const {name, email, avatar} = response.data;
        setName(name);
        setEmail(email);
        setAvatar(avatar);
      }

      getUser();
    }, [id, token])

   

    const changeAvatarHandler = async () => {
      setIsAvatarTouched(false)
      try {
        const postData = new FormData();
        postData.set('avatar', avatar)
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
        setAvatar(response?.data.avatar)
      } catch (error) {
        console.log(error)
      }
    }

    const updateUserDetails = async (e) => {
      e.preventDefault();
      
      try {
      const userData = new FormData();
      userData.set('name', name);
      userData.set('email', email)
      userData.set('currentPassword', currentPassword);
      userData.set('newPassword', newPassword);
      userData.set('confirmNewPassword', confirmNewPassword)
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
      if(response.status === 200){
        // log user out 
        navigate('/logout')
      }
      } catch (error) {
        setError(error.response.data.message)
      }
    }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${id}` } className='btn' >My Posts</Link>

        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt=""/>
            </div>

            {/* Form to update avatar */}
            <form className="avatar__form">
              <input type="file"  name='avatar' id='avatar' onChange={e=> setAvatar(e.target.files[0])}/>
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandler}><PiCheckFatFill /></button>}
          </div>
          <h1>{currentUser.name}</h1>
          <form action="" className="form profile__form"  onSubmit={updateUserDetails}>
            {error && <p className='form__error-message'>{error}</p>}
            <input type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)}/>
            <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type="password" placeholder='Current Password' value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
            <input type="password" placeholder='New password' value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
            <input type="password" placeholder='Confirm new password' value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)}/>
            <button className="btn primary" type='submit' >Update details</button>
          </form>


        </div>
      </div>
    </section>
  )
}

export default UserProfile